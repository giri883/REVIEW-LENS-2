/**
 * ═══════════════════════════════════════════════════════════
 *  EcoWatch — Campus Energy Waste Monitor
 *  script.js  |  Core Application Logic
 * ═══════════════════════════════════════════════════════════
 *
 *  ALGORITHM: Rule-Based Energy Waste Detection
 *  ─────────────────────────────────────────────
 *  Step 1 : Start
 *  Step 2 : Read / generate simulated room sensor data
 *  Step 3 : Check occupancy count
 *  Step 4 : Check whether any light or fan is ON
 *  Step 5 : If occupancy === 0 AND (lightsOn > 0 OR fansOn > 0)
 *             → classify as ENERGY WASTE
 *  Step 6 : Otherwise classify as OCCUPIED or NORMAL
 *  Step 7 : Calculate device power consumption (Watts)
 *  Step 8 : Calculate wasted energy in kWh
 *  Step 9 : Calculate wasted electricity cost (₹)
 *  Step 10: Display alerts, room status, charts, and cost on dashboard
 *  Step 11: Repeat every 5 seconds (or on any user interaction)
 *
 *  NOTE: All sensor data is SIMULATED for demo purposes only.
 */

'use strict';

/* ═══════════════════════════════════════════
   1. CONSTANTS & DEFAULT SETTINGS
═══════════════════════════════════════════ */

/** Default device power ratings (Watts) */
const DEFAULT_LIGHT_WATTS  = 20;
const DEFAULT_FAN_WATTS    = 75;
/** Default electricity tariff ₹ per kWh */
const DEFAULT_TARIFF       = 8;
/** Simulated run-time per update cycle (hours) — 1 minute = 1/60 hr */
const DURATION_HOURS       = 1;
/** Auto-refresh interval in milliseconds (5 seconds) */
const REFRESH_INTERVAL_MS  = 5000;

/* ═══════════════════════════════════════════
   2. INITIAL ROOM DATA — 10 Sample Classrooms
═══════════════════════════════════════════ */

/**
 * getDefaultRooms() — Returns the factory-default room list.
 * Each room holds: id, name, occupancy, lightsOn, fansOn, totalLights, totalFans.
 * totalLights / totalFans are the physical maximums for that room.
 */
function getDefaultRooms() {
  return [
    { id:'R101', name:'Classroom A', occupancy:24, lightsOn:4, fansOn:2, totalLights:6, totalFans:3 },
    { id:'R102', name:'Classroom B', occupancy:0,  lightsOn:3, fansOn:2, totalLights:6, totalFans:3 },
    { id:'R103', name:'Classroom C', occupancy:30, lightsOn:6, fansOn:3, totalLights:6, totalFans:3 },
    { id:'R104', name:'Computer Lab', occupancy:0, lightsOn:0, fansOn:0, totalLights:8, totalFans:2 },
    { id:'R201', name:'Seminar Hall', occupancy:0, lightsOn:5, fansOn:3, totalLights:8, totalFans:4 },
    { id:'R202', name:'Tutorial Room',occupancy:12,lightsOn:3, fansOn:2, totalLights:4, totalFans:2 },
    { id:'R203', name:'Physics Lab',  occupancy:0, lightsOn:4, fansOn:1, totalLights:6, totalFans:2 },
    { id:'R204', name:'Chemistry Lab',occupancy:0, lightsOn:4, fansOn:3, totalLights:6, totalFans:3 },
    { id:'R301', name:'Library Hall', occupancy:18,lightsOn:6, fansOn:3, totalLights:8, totalFans:4 },
    { id:'R302', name:'Staff Room',   occupancy:0, lightsOn:2, fansOn:1, totalLights:4, totalFans:2 },
  ];
}

/* ═══════════════════════════════════════════
   3. APP STATE
═══════════════════════════════════════════ */

let rooms         = [];          // Live room data array
let tariff        = DEFAULT_TARIFF;
let lightWatts    = DEFAULT_LIGHT_WATTS;
let fanWatts      = DEFAULT_FAN_WATTS;
let autoSim       = true;        // Auto-simulation toggle
let simTimer      = null;        // setInterval handle
let wasteTimers   = {};          // Track wasted minutes per room { roomId: minutes }
let knownWaste    = new Set();   // Room IDs that are CURRENTLY in waste state

/* ═══════════════════════════════════════════
   4. LOCAL STORAGE HELPERS
═══════════════════════════════════════════ */

/** Save current state to LocalStorage */
function saveState() {
  try {
    localStorage.setItem('ecowatch_rooms',       JSON.stringify(rooms));
    localStorage.setItem('ecowatch_tariff',      JSON.stringify(tariff));
    localStorage.setItem('ecowatch_lightWatts',  JSON.stringify(lightWatts));
    localStorage.setItem('ecowatch_fanWatts',    JSON.stringify(fanWatts));
    localStorage.setItem('ecowatch_autoSim',     JSON.stringify(autoSim));
    localStorage.setItem('ecowatch_wasteTimers', JSON.stringify(wasteTimers));
  } catch (e) {
    console.warn('EcoWatch: Could not save to LocalStorage.', e);
  }
}

/** Load state from LocalStorage; fall back to defaults if missing or invalid */
function loadState() {
  try {
    const storedRooms = localStorage.getItem('ecowatch_rooms');
    rooms = storedRooms ? JSON.parse(storedRooms) : getDefaultRooms();

    const storedTariff = localStorage.getItem('ecowatch_tariff');
    tariff = storedTariff ? parseFloat(storedTariff) : DEFAULT_TARIFF;

    const storedLight = localStorage.getItem('ecowatch_lightWatts');
    lightWatts = storedLight ? parseInt(storedLight) : DEFAULT_LIGHT_WATTS;

    const storedFan = localStorage.getItem('ecowatch_fanWatts');
    fanWatts = storedFan ? parseInt(storedFan) : DEFAULT_FAN_WATTS;

    const storedSim = localStorage.getItem('ecowatch_autoSim');
    autoSim = storedSim ? JSON.parse(storedSim) : true;

    const storedTimers = localStorage.getItem('ecowatch_wasteTimers');
    wasteTimers = storedTimers ? JSON.parse(storedTimers) : {};
  } catch (e) {
    console.warn('EcoWatch: Could not load from LocalStorage. Using defaults.', e);
    rooms        = getDefaultRooms();
    tariff       = DEFAULT_TARIFF;
    lightWatts   = DEFAULT_LIGHT_WATTS;
    fanWatts     = DEFAULT_FAN_WATTS;
    autoSim      = true;
    wasteTimers  = {};
  }
}

/** Hard reset — restore all defaults and clear LocalStorage */
function resetDemo() {
  rooms       = getDefaultRooms();
  tariff      = DEFAULT_TARIFF;
  lightWatts  = DEFAULT_LIGHT_WATTS;
  fanWatts    = DEFAULT_FAN_WATTS;
  autoSim     = true;
  wasteTimers = {};
  knownWaste  = new Set();
  saveState();
  updateSettingsUI();
  renderAll();
  showToast('Demo data has been reset to defaults.', 'info', '🔄');
}

/* ═══════════════════════════════════════════
   5. ENERGY WASTE DETECTION ALGORITHM
═══════════════════════════════════════════ */

/**
 * detectEnergyWaste(room)
 * ─────────────────────────────────────────
 * Core Rule-Based Algorithm.
 * Returns an object with status and waste details.
 *
 * Rule: occupancy === 0 AND (lightsOn > 0 OR fansOn > 0)
 *       → Energy Waste Detected
 */
function detectEnergyWaste(room) {
  // Step 3: Check occupancy
  const isEmpty    = room.occupancy === 0;
  // Step 4: Check devices
  const devicesOn  = room.lightsOn > 0 || room.fansOn > 0;

  // Step 7: Calculate total power consumption (Watts)
  const powerWatts = (room.lightsOn * lightWatts) + (room.fansOn * fanWatts);

  // Step 8: Energy in kWh for this period
  const energyKWh  = (powerWatts * DURATION_HOURS) / 1000;

  // Step 9: Cost in ₹
  const cost       = energyKWh * tariff;

  // Wasted energy (only if waste condition is met)
  const wastedKWh  = (isEmpty && devicesOn) ? energyKWh : 0;
  const wastedCost = (isEmpty && devicesOn) ? cost       : 0;

  let status;
  // Step 5 & 6: Classify room
  if (isEmpty && devicesOn) {
    status = 'WASTE';       // Energy waste detected
  } else if (room.occupancy > 0) {
    status = 'OCCUPIED';    // Room in use — devices expected
  } else {
    status = 'NORMAL';      // Empty room with no devices on
  }

  return {
    status,
    powerWatts,
    energyKWh,
    cost,
    wastedKWh,
    wastedCost,
    isEmpty,
    devicesOn,
  };
}

/**
 * getSeverity(powerWatts)
 * Assign alert severity based on estimated wasted power.
 */
function getSeverity(powerWatts) {
  if (powerWatts >= 300) return 'high';
  if (powerWatts >= 150) return 'medium';
  return 'low';
}

/**
 * getWasteAlerts()
 * Returns only rooms that have an active WASTE status.
 */
function getWasteAlerts() {
  return rooms
    .map(room => ({ room, result: detectEnergyWaste(room) }))
    .filter(({ result }) => result.status === 'WASTE');
}

/* ═══════════════════════════════════════════
   6. SIMULATION — Auto-update room data
═══════════════════════════════════════════ */

/**
 * simulateTick()
 * Called every REFRESH_INTERVAL_MS.
 * Applies slight random changes to occupancy to make the
 * demo feel live, without disrupting user-set values drastically.
 */
function simulateTick() {
  if (!autoSim) return;

  rooms.forEach(room => {
    // Rooms already in waste stay in waste so alerts are visible
    const result = detectEnergyWaste(room);
    if (result.status === 'WASTE') {
      // Increment waste timer (each tick = 1 simulated minute)
      wasteTimers[room.id] = (wasteTimers[room.id] || 0) + 1;
      return;
    }

    // Small random occupancy fluctuation for occupied rooms (±2)
    if (room.occupancy > 0) {
      const delta = Math.floor(Math.random() * 5) - 2;
      room.occupancy = Math.max(1, room.occupancy + delta);
    }
  });

  saveState();
  renderAll();
}

/* ═══════════════════════════════════════════
   7. RENDERING — Dashboard
═══════════════════════════════════════════ */

/**
 * renderAll()
 * Master render function — updates every UI section.
 * Called after any data change.
 */
function renderAll() {
  renderSummaryCards();
  renderEfficiencyScore();
  renderBarChart();
  renderPieChart();
  renderWasteBarChart();
  renderRoomGrid();
  renderAlertsSection();
  renderDashboardAlerts();
  renderStatusTable();
  renderSavings();
  renderRecommendations();
  updateNavBadge();
  updateLastUpdated();
}

/** Update the "Last Updated" timestamp */
function updateLastUpdated() {
  const el = document.getElementById('last-updated');
  if (el) el.textContent = 'Updated: ' + new Date().toLocaleTimeString();
}

/** Render the 5 summary cards */
function renderSummaryCards() {
  const totalRooms   = rooms.length;
  const occupiedRms  = rooms.filter(r => r.occupancy > 0).length;
  const alerts       = getWasteAlerts();
  const totalKWh     = rooms.reduce((sum, r) => sum + detectEnergyWaste(r).energyKWh, 0);
  const dailyWaste   = alerts.reduce((sum, { result }) => sum + result.wastedCost * 8, 0); // 8 simulated hrs

  setText('total-rooms',      totalRooms);
  setText('occupied-rooms',   occupiedRms);
  setText('waste-alerts-count', alerts.length);
  setText('total-kwh',        totalKWh.toFixed(3));
  setText('daily-waste-cost', '₹' + dailyWaste.toFixed(2));
}

/** Render efficiency score ring */
function renderEfficiencyScore() {
  const alerts   = getWasteAlerts();
  const score    = rooms.length > 0
    ? Math.round(((rooms.length - alerts.length) / rooms.length) * 100)
    : 100;

  setText('score-text', score + '%');

  const canvas = document.getElementById('score-canvas');
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const cx   = 55, cy = 55, r = 42;
  const angle = (score / 100) * 2 * Math.PI;

  ctx.clearRect(0, 0, 110, 110);

  // Background ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 9;
  ctx.stroke();

  // Score arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + angle);
  ctx.strokeStyle = score >= 70 ? '#00b89c' : score >= 40 ? '#ea580c' : '#dc2626';
  ctx.lineWidth = 9;
  ctx.lineCap   = 'round';
  ctx.stroke();
}

/* ═══════════════════════════════════════════
   8. CANVAS CHARTS (No external libraries)
═══════════════════════════════════════════ */

/**
 * drawBarChart(canvasId, labels, values, colors, options)
 * General-purpose horizontal/vertical bar chart using native Canvas.
 */
function drawBarChart(canvasId, labels, values, barColor, bgColor, axisLabel) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Responsive width
  const parent = canvas.parentElement;
  canvas.width  = parent.clientWidth || 600;
  canvas.height = Math.max(200, Math.min(300, labels.length * 35 + 60));

  const W = canvas.width, H = canvas.height;
  const padL = 70, padR = 20, padT = 30, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = bgColor || '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const maxVal = Math.max(...values, 0.001);
  const barH   = Math.max(8, (chartH / labels.length) - 10);
  const gap    = (chartH - barH * labels.length) / (labels.length + 1);

  labels.forEach((label, i) => {
    const x = padL;
    const y = padT + gap + i * (barH + gap);
    const barWidth = (values[i] / maxVal) * chartW;

    // Bar background
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    roundRect(ctx, x, y, chartW, barH, 4);
    ctx.fill();

    // Bar fill
    const color = Array.isArray(barColor) ? barColor[i] : barColor;
    ctx.fillStyle = color || '#00b89c';
    if (barWidth > 0) {
      ctx.beginPath();
      roundRect(ctx, x, y, barWidth, barH, 4);
      ctx.fill();
    }

    // Label
    ctx.fillStyle = '#334155';
    ctx.font = '600 12px Segoe UI, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, padL - 6, y + barH / 2);

    // Value
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    const valX = x + barWidth + 6;
    ctx.fillText(values[i].toFixed(3), valX, y + barH / 2);
  });

  // X-axis
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, padT + chartH);
  ctx.stroke();

  // Axis label
  if (axisLabel) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(axisLabel, padL + chartW / 2, H - 8);
  }
}

/** Helper — draw rounded rectangles */
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Energy consumption bar chart (dashboard) */
function renderBarChart() {
  const labels = rooms.map(r => r.id);
  const values = rooms.map(r => detectEnergyWaste(r).energyKWh);
  const colors = rooms.map(r => {
    const res = detectEnergyWaste(r);
    if (res.status === 'WASTE')    return '#dc2626';
    if (res.status === 'OCCUPIED') return '#16a34a';
    return '#94a3b8';
  });
  drawBarChart('bar-chart', labels, values, colors, '#ffffff', 'kWh per room');
}

/** Waste-rooms bar chart (analytics) */
function renderWasteBarChart() {
  const wasteRooms = rooms.filter(r => detectEnergyWaste(r).status === 'WASTE');
  if (wasteRooms.length === 0) {
    const canvas = document.getElementById('waste-bar-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = canvas.parentElement.clientWidth || 400;
    canvas.height = 120;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✅ No waste detected!', canvas.width / 2, 60);
    return;
  }
  const labels = wasteRooms.map(r => r.id);
  // Simulate 8 hrs daily projection
  const values = wasteRooms.map(r => detectEnergyWaste(r).wastedKWh * 8);
  drawBarChart('waste-bar-chart', labels, values, '#dc2626', '#ffffff', 'Estimated kWh wasted (8 hrs)');
}

/** Pie chart — waste vs normal rooms */
function renderPieChart() {
  const canvas = document.getElementById('pie-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const wasteCount    = rooms.filter(r => detectEnergyWaste(r).status === 'WASTE').length;
  const occupiedCount = rooms.filter(r => detectEnergyWaste(r).status === 'OCCUPIED').length;
  const normalCount   = rooms.filter(r => detectEnergyWaste(r).status === 'NORMAL').length;

  const data   = [wasteCount, occupiedCount, normalCount];
  const colors = ['#dc2626', '#16a34a', '#94a3b8'];
  const labels = ['Waste Alert', 'Occupied', 'Normal/Empty'];
  const total  = data.reduce((a, b) => a + b, 0) || 1;

  const size = 220;
  canvas.width = canvas.height = size;
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2, cy = size / 2, r = 85;
  let startAngle = -Math.PI / 2;

  data.forEach((val, i) => {
    const slice = (val / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    startAngle += slice;
  });

  // Centre hole (donut)
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();

  // Centre text
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 14px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(total + ' rooms', cx, cy);

  // Legend
  const legend = document.getElementById('pie-legend');
  if (legend) {
    legend.innerHTML = data.map((val, i) =>
      `<div class="pie-legend-item">
        <div class="legend-dot" style="background:${colors[i]}"></div>
        <span>${labels[i]}: <strong>${val}</strong></span>
      </div>`
    ).join('');
  }
}

/* ═══════════════════════════════════════════
   9. ROOM MONITORING GRID
═══════════════════════════════════════════ */

/** Build the full room monitoring grid */
function renderRoomGrid() {
  const grid = document.getElementById('room-grid');
  if (!grid) return;
  grid.innerHTML = rooms.map(room => buildRoomCard(room)).join('');

  // Attach event listeners for all controls
  rooms.forEach(room => {
    attachRoomControls(room.id);
  });
}

/** Generate HTML for a single room card */
function buildRoomCard(room) {
  const result   = detectEnergyWaste(room);
  const statusClass = result.status === 'WASTE' ? 'waste' :
                      result.status === 'OCCUPIED' ? 'occupied' : 'empty';
  const badgeClass  = result.status === 'WASTE' ? 'badge-waste' :
                      result.status === 'OCCUPIED' ? 'badge-occupied' : 'badge-normal';
  const badgeText   = result.status === 'WASTE' ? '⚡ WASTE' :
                      result.status === 'OCCUPIED' ? '✅ OCCUPIED' : '⬛ NORMAL';

  const alertMsg = result.status === 'WASTE'
    ? `⚠️ Energy waste: ${room.lightsOn} light(s) and ${room.fansOn} fan(s) ON in an empty room!`
    : '';

  return `
    <div class="room-card ${statusClass}" id="room-card-${room.id}">
      <div class="room-card-header">
        <div class="room-id-block">
          <div class="room-id">${room.id}</div>
          <div class="room-name">${room.name}</div>
        </div>
        <span class="room-status-badge ${badgeClass}">${badgeText}</span>
      </div>

      <div class="room-alert-banner">${alertMsg}</div>

      <div class="room-sensors">
        <div class="sensor-item">
          <div class="sensor-value">${room.occupancy}</div>
          <div class="sensor-label">👤 Occupancy</div>
        </div>
        <div class="sensor-item">
          <div class="sensor-value">${room.lightsOn}</div>
          <div class="sensor-label">💡 Lights ON</div>
        </div>
        <div class="sensor-item">
          <div class="sensor-value">${room.fansOn}</div>
          <div class="sensor-label">🌀 Fans ON</div>
        </div>
      </div>

      <div class="room-power">
        <span>⚡ Power: <strong>${result.powerWatts}W</strong></span>
        <span>📊 kWh/hr: <strong>${result.energyKWh.toFixed(3)}</strong></span>
        <span>₹/hr: <strong>${result.cost.toFixed(2)}</strong></span>
      </div>

      <div class="room-controls">
        <div class="control-row">
          <span class="control-label">👤 Occupancy</span>
          <div class="control-input">
            <input type="number" class="num-input" id="occ-${room.id}"
              value="${room.occupancy}" min="0" max="100" />
            <button class="btn btn-sm btn-primary" onclick="setOccupancy('${room.id}')">Set</button>
          </div>
        </div>
        <div class="control-row">
          <span class="control-label">💡 Lights ON</span>
          <div class="control-input">
            <input type="number" class="num-input" id="lights-${room.id}"
              value="${room.lightsOn}" min="0" max="${room.totalLights}" />
            <button class="btn btn-sm btn-primary" onclick="setLights('${room.id}')">Set</button>
          </div>
        </div>
        <div class="control-row">
          <span class="control-label">🌀 Fans ON</span>
          <div class="control-input">
            <input type="number" class="num-input" id="fans-${room.id}"
              value="${room.fansOn}" min="0" max="${room.totalFans}" />
            <button class="btn btn-sm btn-primary" onclick="setFans('${room.id}')">Set</button>
          </div>
        </div>
      </div>

      <div class="room-action-btns">
        <button class="btn btn-sm btn-warn"
          onclick="simulateWaste('${room.id}')">⚠️ Simulate Waste</button>
        <button class="btn btn-sm btn-outline"
          onclick="turnOffAll('${room.id}')">🔴 All Devices OFF</button>
        <button class="btn btn-sm btn-outline"
          onclick="resetRoom('${room.id}')">↺ Reset</button>
      </div>
    </div>`;
}

/** Attach event listeners (Enter key) for number inputs in a room card */
function attachRoomControls(roomId) {
  const occ = document.getElementById(`occ-${roomId}`);
  if (occ) occ.addEventListener('keydown', e => { if (e.key === 'Enter') setOccupancy(roomId); });

  const lights = document.getElementById(`lights-${roomId}`);
  if (lights) lights.addEventListener('keydown', e => { if (e.key === 'Enter') setLights(roomId); });

  const fans = document.getElementById(`fans-${roomId}`);
  if (fans) fans.addEventListener('keydown', e => { if (e.key === 'Enter') setFans(roomId); });
}

/* ═══════════════════════════════════════════
   10. INTERACTIVE ROOM CONTROLS
═══════════════════════════════════════════ */

/** Find a room object by ID */
function findRoom(roomId) {
  return rooms.find(r => r.id === roomId);
}

/** Set occupancy for a room */
function setOccupancy(roomId) {
  const room = findRoom(roomId);
  if (!room) return;

  const input = document.getElementById(`occ-${roomId}`);
  const val   = parseInt(input ? input.value : 0);

  if (isNaN(val) || val < 0) {
    showToast('Occupancy cannot be negative!', 'warn', '⚠️');
    return;
  }

  room.occupancy = val;
  checkAndToastWaste(room);
  saveState();
  renderAll();
}

/** Set lights for a room */
function setLights(roomId) {
  const room = findRoom(roomId);
  if (!room) return;

  const input = document.getElementById(`lights-${roomId}`);
  const val   = parseInt(input ? input.value : 0);

  if (isNaN(val) || val < 0) {
    showToast('Lights count cannot be negative!', 'warn', '⚠️');
    return;
  }
  if (val > room.totalLights) {
    showToast(`${roomId}: Max lights is ${room.totalLights}`, 'warn', '⚠️');
    return;
  }

  room.lightsOn = val;
  checkAndToastWaste(room);
  saveState();
  renderAll();
}

/** Set fans for a room */
function setFans(roomId) {
  const room = findRoom(roomId);
  if (!room) return;

  const input = document.getElementById(`fans-${roomId}`);
  const val   = parseInt(input ? input.value : 0);

  if (isNaN(val) || val < 0) {
    showToast('Fan count cannot be negative!', 'warn', '⚠️');
    return;
  }
  if (val > room.totalFans) {
    showToast(`${roomId}: Max fans is ${room.totalFans}`, 'warn', '⚠️');
    return;
  }

  room.fansOn = val;
  checkAndToastWaste(room);
  saveState();
  renderAll();
}

/**
 * simulateWaste(roomId)
 * Convenience button: sets occupancy to 0 and turns on all devices.
 */
function simulateWaste(roomId) {
  const room = findRoom(roomId);
  if (!room) return;
  room.occupancy = 0;
  room.lightsOn  = room.totalLights;
  room.fansOn    = room.totalFans;
  checkAndToastWaste(room);
  saveState();
  renderAll();
  showToast(`Waste simulated in ${roomId}! Lights & fans left ON in empty room.`, 'warn', '🚨');
}

/**
 * turnOffAll(roomId)
 * Turn off all lights and fans in a room (resolves waste alert).
 */
function turnOffAll(roomId) {
  const room = findRoom(roomId);
  if (!room) return;
  room.lightsOn = 0;
  room.fansOn   = 0;
  if (knownWaste.has(roomId)) {
    knownWaste.delete(roomId);
    delete wasteTimers[roomId];
  }
  saveState();
  renderAll();
  showToast(`${roomId}: All devices switched OFF. Energy saved! ✅`, 'success', '✅');
}

/**
 * resetRoom(roomId)
 * Restore a room to its original default state.
 */
function resetRoom(roomId) {
  const defaults = getDefaultRooms();
  const def = defaults.find(r => r.id === roomId);
  if (!def) return;
  const idx = rooms.findIndex(r => r.id === roomId);
  if (idx !== -1) {
    rooms[idx] = { ...def };
    knownWaste.delete(roomId);
    delete wasteTimers[roomId];
    saveState();
    renderAll();
    showToast(`${roomId} has been reset to default state.`, 'info', '↺');
  }
}

/**
 * checkAndToastWaste(room)
 * Show a toast when a room NEWLY enters waste state.
 */
function checkAndToastWaste(room) {
  const result = detectEnergyWaste(room);
  if (result.status === 'WASTE' && !knownWaste.has(room.id)) {
    knownWaste.add(room.id);
    showToast(
      `🚨 Energy Waste Detected! ${room.id} is empty but has devices ON.`,
      'warn', '🚨'
    );
  } else if (result.status !== 'WASTE') {
    knownWaste.delete(room.id);
  }
}

/* ═══════════════════════════════════════════
   11. ALERTS RENDERING
═══════════════════════════════════════════ */

/** Build a full alert card HTML for a waste room */
function buildAlertCard(room, result) {
  const severity = getSeverity(result.powerWatts);
  const sevLabel = severity === 'high' ? 'HIGH' : severity === 'medium' ? 'MEDIUM' : 'LOW';
  const dailyCost = result.wastedCost * 8;

  return `
    <div class="alert-card severity-${severity}">
      <div class="alert-body">
        <div class="alert-room-id">🚨 ${room.id} — ${room.name}</div>
        <p class="alert-message">
          Energy Waste Detected: Room ${room.id} is empty, but
          ${room.lightsOn} light(s) and ${room.fansOn} fan(s) are ON.
          Switch off unnecessary devices to save electricity.
        </p>
        <div class="alert-meta">
          <div class="alert-meta-item">
            <span>Power wasted: </span>
            <strong>${result.powerWatts}W</strong>
          </div>
          <div class="alert-meta-item">
            <span>kWh/hr: </span>
            <strong>${result.wastedKWh.toFixed(3)}</strong>
          </div>
          <div class="alert-meta-item">
            <span>Est. daily cost: </span>
            <strong>₹${dailyCost.toFixed(2)}</strong>
          </div>
          <div class="alert-meta-item">
            <span>Recommendation: </span>
            <strong>Turn off all lights & fans immediately.</strong>
          </div>
        </div>
      </div>
      <div class="alert-actions">
        <span class="alert-severity sev-${severity}">${sevLabel}</span>
        <button class="btn btn-sm btn-warn" onclick="turnOffAll('${room.id}')">
          🔴 Fix Now
        </button>
        <button class="btn btn-sm btn-outline" onclick="gotoRoom('${room.id}')">
          📍 View Room
        </button>
      </div>
    </div>`;
}

/** Render the full Waste Alerts section */
function renderAlertsSection() {
  const container = document.getElementById('full-alerts-list');
  if (!container) return;

  const wasteList = getWasteAlerts();
  if (wasteList.length === 0) {
    container.innerHTML = '<p class="empty-msg">✅ No active waste alerts. Great job!</p>';
    return;
  }
  container.innerHTML = wasteList.map(({ room, result }) => buildAlertCard(room, result)).join('');
}

/** Render mini alerts on the Dashboard */
function renderDashboardAlerts() {
  const container = document.getElementById('dashboard-alerts-list');
  if (!container) return;

  const wasteList = getWasteAlerts();
  if (wasteList.length === 0) {
    container.innerHTML = '<p class="empty-msg">✅ No waste detected — all rooms are efficient!</p>';
    return;
  }

  container.innerHTML = wasteList.map(({ room, result }) => `
    <div class="mini-alert">
      <div class="mini-alert-dot"></div>
      <div class="mini-alert-text">
        <strong>${room.id}</strong>: ${room.lightsOn} light(s), ${room.fansOn} fan(s) ON —
        wasting <strong>${result.powerWatts}W</strong>
      </div>
      <span class="mini-alert-badge">${getSeverity(result.powerWatts).toUpperCase()}</span>
    </div>`).join('');
}

/** Navigate to Room Monitoring and highlight the room */
function gotoRoom(roomId) {
  showSection('room-monitoring');
  setTimeout(() => {
    const el = document.getElementById(`room-card-${roomId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.outline = '3px solid #dc2626';
      setTimeout(() => { el.style.outline = ''; }, 2500);
    }
  }, 100);
}

/** Update nav badge count */
function updateNavBadge() {
  const count = getWasteAlerts().length;
  const badge = document.getElementById('nav-alert-count');
  if (!badge) return;
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
}

/* ═══════════════════════════════════════════
   12. STATUS TABLE
═══════════════════════════════════════════ */

function renderStatusTable() {
  const tbody = document.getElementById('status-table-body');
  if (!tbody) return;

  tbody.innerHTML = rooms.map(room => {
    const result = detectEnergyWaste(room);
    const cls = result.status === 'WASTE' ? 'td-waste' :
                result.status === 'OCCUPIED' ? 'td-occupied' : 'td-normal';
    const statusText = result.status === 'WASTE' ? '⚡ WASTE' :
                       result.status === 'OCCUPIED' ? '✅ OCCUPIED' : '⬛ NORMAL';
    return `
      <tr>
        <td><strong>${room.id}</strong></td>
        <td>${room.name}</td>
        <td>${room.occupancy}</td>
        <td>${room.lightsOn} / ${room.totalLights}</td>
        <td>${room.fansOn} / ${room.totalFans}</td>
        <td>${result.powerWatts}</td>
        <td>${result.energyKWh.toFixed(4)}</td>
        <td class="${cls}">${statusText}</td>
      </tr>`;
  }).join('');
}

/* ═══════════════════════════════════════════
   13. SAVINGS & RECOMMENDATIONS
═══════════════════════════════════════════ */

function renderSavings() {
  const grid = document.getElementById('savings-grid');
  if (!grid) return;

  const wasteList   = getWasteAlerts();
  const totalWasteW = wasteList.reduce((s, { result }) => s + result.powerWatts, 0);
  const dailyKWh    = (totalWasteW * 8) / 1000;
  const dailyCost   = dailyKWh * tariff;
  const monthlyCost = dailyCost * 30;
  const yearlyCost  = dailyCost * 365;

  grid.innerHTML = `
    <div class="saving-item">
      <div class="saving-value">${totalWasteW}W</div>
      <div class="saving-label">Current Wasted Power</div>
    </div>
    <div class="saving-item">
      <div class="saving-value">${dailyKWh.toFixed(2)} kWh</div>
      <div class="saving-label">Est. Daily Waste (8 hrs)</div>
    </div>
    <div class="saving-item">
      <div class="saving-value">₹${dailyCost.toFixed(2)}</div>
      <div class="saving-label">Est. Daily Savings</div>
    </div>
    <div class="saving-item">
      <div class="saving-value">₹${monthlyCost.toFixed(0)}</div>
      <div class="saving-label">Est. Monthly Savings</div>
    </div>
    <div class="saving-item">
      <div class="saving-value">₹${yearlyCost.toFixed(0)}</div>
      <div class="saving-label">Est. Annual Savings</div>
    </div>
    <div class="saving-item">
      <div class="saving-value">${wasteList.length}/${rooms.length}</div>
      <div class="saving-label">Rooms with Waste</div>
    </div>`;
}

function renderRecommendations() {
  const list     = document.getElementById('recommendations-list');
  if (!list) return;
  const waste    = getWasteAlerts();
  const items    = [];

  if (waste.length === 0) {
    items.push('All rooms are currently operating efficiently. Keep it up!');
  } else {
    waste.forEach(({ room }) => {
      items.push(`Turn off lights and fans in ${room.id} (${room.name}) — room is empty.`);
    });
  }

  items.push('Install motion-sensor switches to auto-switch off devices in empty rooms.');
  items.push('Adopt LED lighting (5W) instead of fluorescent lamps (20W) to cut light energy by 75%.');
  items.push('Schedule a daily 30-min "campus switch-off" audit between classes.');
  items.push('Display real-time energy dashboards in corridors to raise student awareness.');

  list.innerHTML = items.map(i => `<li>${i}</li>`).join('');
}

/* ═══════════════════════════════════════════
   14. SETTINGS UI
═══════════════════════════════════════════ */

function updateSettingsUI() {
  const tariffInput = document.getElementById('tariff-input');
  if (tariffInput) tariffInput.value = tariff;

  const lightInput = document.getElementById('light-watts');
  if (lightInput) lightInput.value = lightWatts;

  const fanInput = document.getElementById('fan-watts');
  if (fanInput) fanInput.value = fanWatts;

  const simToggle = document.getElementById('auto-sim-toggle');
  if (simToggle) simToggle.checked = autoSim;

  const simLabel = document.getElementById('sim-toggle-label');
  if (simLabel) simLabel.textContent = autoSim ? 'ON' : 'OFF';
}

function saveTariff() {
  const input = document.getElementById('tariff-input');
  const val   = parseFloat(input ? input.value : 0);
  if (isNaN(val) || val <= 0) {
    showToast('Please enter a valid tariff (₹ > 0).', 'warn', '⚠️');
    return;
  }
  tariff = val;
  saveState();
  renderAll();
  showToast(`Tariff updated to ₹${tariff.toFixed(2)} per kWh.`, 'success', '💡');
}

function saveDeviceSettings() {
  const lInput = document.getElementById('light-watts');
  const fInput = document.getElementById('fan-watts');

  const lVal = parseInt(lInput ? lInput.value : 0);
  const fVal = parseInt(fInput ? fInput.value : 0);

  if (isNaN(lVal) || lVal <= 0) {
    showToast('Light wattage must be > 0.', 'warn', '⚠️');
    return;
  }
  if (isNaN(fVal) || fVal <= 0) {
    showToast('Fan wattage must be > 0.', 'warn', '⚠️');
    return;
  }

  lightWatts = lVal;
  fanWatts   = fVal;
  saveState();
  renderAll();
  showToast(`Device ratings updated: Light=${lVal}W, Fan=${fVal}W.`, 'success', '🔧');
}

/* ═══════════════════════════════════════════
   15. NAVIGATION
═══════════════════════════════════════════ */

/** Show a content section; update active nav link */
function showSection(sectionKey) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Remove active from all nav links
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  // Show target section
  const target = document.getElementById(`section-${sectionKey}`);
  if (target) target.classList.add('active');

  // Activate matching nav link
  const link = document.querySelector(`.nav-link[data-section="${sectionKey}"]`);
  if (link) link.classList.add('active');

  // Rerender charts after DOM becomes visible (canvas sizing)
  setTimeout(() => {
    renderBarChart();
    renderPieChart();
    renderWasteBarChart();
    renderEfficiencyScore();
  }, 50);

  closeMobileSidebar();
}

/* ═══════════════════════════════════════════
   16. TOAST NOTIFICATIONS
═══════════════════════════════════════════ */

/**
 * showToast(message, type, icon)
 * type: 'warn' | 'success' | 'info'
 */
function showToast(message, type, icon) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'success' : type === 'info' ? 'info' : ''}`;
  toast.innerHTML = `
    <span class="toast-icon">${icon || '🔔'}</span>
    <span class="toast-msg">${message}</span>
    <span class="toast-close" onclick="removeToast(this.parentElement)">✕</span>
  `;
  container.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => removeToast(toast), 4000);
}

function removeToast(el) {
  if (!el || !el.parentElement) return;
  el.classList.add('removing');
  setTimeout(() => { if (el.parentElement) el.parentElement.removeChild(el); }, 300);
}

/* ═══════════════════════════════════════════
   17. SIDEBAR CLOCK
═══════════════════════════════════════════ */

function updateClock() {
  const el = document.getElementById('sidebar-clock');
  if (el) el.textContent = new Date().toLocaleTimeString();
}

/* ═══════════════════════════════════════════
   18. MOBILE SIDEBAR
═══════════════════════════════════════════ */

function openMobileSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  if (sidebar)  sidebar.classList.add('open');
  if (overlay)  overlay.classList.add('visible');
}

function closeMobileSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  if (sidebar)  sidebar.classList.remove('open');
  if (overlay)  overlay.classList.remove('visible');
}

/* ═══════════════════════════════════════════
   19. UTILITY
═══════════════════════════════════════════ */

/** Set textContent safely */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* ═══════════════════════════════════════════
   20. INITIALISATION
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Load persisted state ─────────────────
  loadState();

  // ── Identify initially wasted rooms ──────
  rooms.forEach(room => {
    const result = detectEnergyWaste(room);
    if (result.status === 'WASTE') knownWaste.add(room.id);
  });

  // ── Create sidebar overlay (mobile) ──────
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebar-overlay';
  overlay.addEventListener('click', closeMobileSidebar);
  document.body.appendChild(overlay);

  // ── Sidebar Navigation ────────────────────
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      showSection(this.dataset.section);
    });
  });

  // ── Dashboard: "View All" alerts link ────
  const dashAlerts = document.getElementById('dash-goto-alerts');
  if (dashAlerts) dashAlerts.addEventListener('click', () => showSection('waste-alerts'));

  // ── Reset Demo buttons ───────────────────
  document.getElementById('reset-demo-btn')
    ?.addEventListener('click', resetDemo);
  document.getElementById('reset-demo-settings-btn')
    ?.addEventListener('click', resetDemo);

  // ── Clear All Alerts button ──────────────
  document.getElementById('clear-alerts-btn')
    ?.addEventListener('click', () => {
      // Turn off devices in all waste rooms
      getWasteAlerts().forEach(({ room }) => {
        room.lightsOn = 0;
        room.fansOn   = 0;
        knownWaste.delete(room.id);
        delete wasteTimers[room.id];
      });
      saveState();
      renderAll();
      showToast('All waste alerts cleared — devices turned off.', 'success', '✅');
    });

  // ── Settings: Save Tariff ────────────────
  document.getElementById('save-tariff-btn')
    ?.addEventListener('click', saveTariff);

  // ── Settings: Save Device Ratings ────────
  document.getElementById('save-devices-btn')
    ?.addEventListener('click', saveDeviceSettings);

  // ── Settings: Auto-sim toggle ────────────
  document.getElementById('auto-sim-toggle')
    ?.addEventListener('change', function () {
      autoSim = this.checked;
      const label = document.getElementById('sim-toggle-label');
      if (label) label.textContent = autoSim ? 'ON' : 'OFF';
      saveState();
    });

  // ── Hamburger (mobile menu) ──────────────
  document.getElementById('hamburger')
    ?.addEventListener('click', openMobileSidebar);

  // ── Initial render ───────────────────────
  updateSettingsUI();
  renderAll();

  // ── Auto-simulation interval (5 seconds) ─
  simTimer = setInterval(simulateTick, REFRESH_INTERVAL_MS);

  // ── Clock (every second) ─────────────────
  updateClock();
  setInterval(updateClock, 1000);

  console.log('✅ EcoWatch initialised successfully.');
  console.log(`   Rooms: ${rooms.length} | Tariff: ₹${tariff}/kWh`);
  console.log('   Algorithm: Rule-Based Energy Waste Detection');
});
