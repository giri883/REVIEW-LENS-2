# 🌿 EcoWatch — Campus Energy Waste Monitor

> **Tagline:** Detect Waste. Save Energy. Build a Greener Campus.

A smart campus energy monitoring dashboard that detects electricity waste in empty classrooms using a **Rule-Based Detection Algorithm** and simulated occupancy sensors.

Built as a beginner-friendly hackathon project — no backend, no API keys, no database required. Runs entirely in the browser.

---

## 📁 Project Files

| File | Purpose |
|---|---|
| `index.html` | App structure, sidebar, all section panels |
| `style.css` | Modern dashboard design (navy + teal theme) |
| `script.js` | Core algorithm, charts, controls, LocalStorage |
| `README.md` | This file |

---

## 🚀 How to Run

1. Download or clone this project folder.
2. Open **`index.html`** in any modern web browser (Chrome, Firefox, Edge).
3. No installation, no internet connection, no setup needed.

> **Tip:** If your browser blocks local scripts, right-click `index.html` → Open With → Chrome/Firefox.

---

## 🧠 Algorithm — Rule-Based Energy Waste Detection

```
Step 1 : Start
Step 2 : Read simulated room sensor data (occupancy, lights, fans)
Step 3 : Check occupancy count
Step 4 : Check whether any light or fan is ON
Step 5 : IF occupancy === 0 AND (lightsOn > 0 OR fansOn > 0)
              → Classify as ENERGY WASTE 🚨
Step 6 : ELSE classify as OCCUPIED ✅ or NORMAL ⬛
Step 7 : Calculate device power:  powerWatts = lightsOn × 20 + fansOn × 75
Step 8 : Calculate energy:        energyKWh  = powerWatts × hours / 1000
Step 9 : Calculate cost:          cost       = energyKWh × tariff (₹/kWh)
Step 10: Display alerts, status, charts, cost on dashboard
Step 11: Repeat every 5 seconds or on any user interaction
```

**Core JavaScript condition:**
```js
// detectEnergyWaste() — Room is flagged as WASTE only if:
occupancy === 0 && (lightsOn > 0 || fansOn > 0)
```

---

## ⚡ Energy & Cost Formulas

| Calculation | Formula |
|---|---|
| Total device power | `powerWatts = lightsOn × 20W + fansOn × 75W` |
| Energy consumed | `energyKWh = powerWatts × durationHours / 1000` |
| Electricity cost | `cost = energyKWh × tariff (₹ per kWh)` |
| Daily projection | `dailyCost = cost × 8 hours` |
| Monthly savings | `dailyCost × 30` |
| Annual savings | `dailyCost × 365` |

> Default tariff: **₹8 per kWh** (configurable in Settings)

---

## 🏫 Sample Rooms

| Room ID | Name | Notes |
|---|---|---|
| R101 | Classroom A | Occupied by default |
| R102 | Classroom B | **Empty + lights & fans ON → WASTE** |
| R103 | Classroom C | Occupied |
| R104 | Computer Lab | Empty, no devices |
| R201 | Seminar Hall | **Empty + devices ON → WASTE** |
| R202 | Tutorial Room | Occupied |
| R203 | Physics Lab | **Empty + devices ON → WASTE** |
| R204 | Chemistry Lab | **Empty + devices ON → WASTE** |
| R301 | Library Hall | Occupied |
| R302 | Staff Room | **Empty + devices ON → WASTE** |

---

## 🖥️ Dashboard Features

### 📊 Dashboard
- Summary cards: Total Rooms, Occupied Rooms, Waste Alerts, Total kWh, Daily Waste Cost (₹)
- Campus Energy Efficiency Score (% rooms without active waste)
- Energy consumption bar chart (green = occupied, red = waste)
- Recent waste alerts mini-list
- Energy-saving recommendations

### 🏫 Room Monitoring
- 10 interactive room cards with live sensor readings
- Per-room controls: Set Occupancy, Set Lights, Set Fans
- Action buttons: Simulate Waste | All Devices OFF | Reset

### ⚡ Energy Analytics
- Donut chart: Waste vs Occupied vs Normal rooms
- Bar chart: Estimated daily energy waste per room
- Potential savings summary (daily / monthly / annual)
- Full room status table

### 🚨 Waste Alerts
- Full alert cards with severity (HIGH / MEDIUM / LOW)
- Reason, devices ON, power wasted, estimated cost
- "Fix Now" and "View Room" buttons per alert
- Clear All Alerts option

### ⚙️ Settings
- Change electricity tariff (₹/kWh) — saved to LocalStorage
- Change device ratings (light watts, fan watts) — saved
- Toggle auto-simulation ON/OFF
- Reset Demo button (restores all defaults)

---

## 💾 LocalStorage Keys

| Key | Value |
|---|---|
| `ecowatch_rooms` | Array of room objects (JSON) |
| `ecowatch_tariff` | Electricity tariff (₹/kWh) |
| `ecowatch_lightWatts` | Light bulb power (W) |
| `ecowatch_fanWatts` | Ceiling fan power (W) |
| `ecowatch_autoSim` | Auto-simulation enabled (bool) |
| `ecowatch_wasteTimers` | Simulated waste duration per room |

Settings persist after browser refresh. Use **Reset Demo** to restore defaults.

---

## 🧪 Testing Checklist

- [ ] Open `index.html` in a browser — dashboard loads
- [ ] 5 waste alerts visible by default (R102, R201, R203, R204, R302)
- [ ] Set R101 occupancy to 0 → energy waste alert appears
- [ ] Turn all devices OFF in R101 → alert disappears
- [ ] Change tariff in Settings → daily waste cost updates
- [ ] Refresh browser → saved settings persist
- [ ] Click Reset Demo → all defaults restored
- [ ] Click "Simulate Waste" on any room → instant alert
- [ ] Click "Fix Now" on an alert → devices turn off, alert clears

---

## 🛠️ Technology Stack

| Technology | Use |
|---|---|
| HTML5 | Structure and layout |
| CSS3 | Responsive design, animations, custom properties |
| Vanilla JavaScript | Algorithm, DOM manipulation, LocalStorage |
| Canvas API | Native bar and donut charts (no Chart.js needed) |
| Browser LocalStorage | Settings persistence |

**No backend. No API keys. No npm. No build step. Just open and run.**

---

## 🎤 2-Minute Hackathon Demo Script

1. **Open** `index.html` in Chrome.
2. **Point to the Dashboard** — "This is EcoWatch. It monitors every classroom in real-time."
3. **Show the red cards** — "We already have 5 energy waste alerts. These rooms are empty but lights and fans are still ON."
4. **Go to Room Monitoring** — click R204 "Simulate Waste" — "Watch — as soon as the room becomes empty with devices ON, the system immediately flags it."
5. **Show the Toast notification** — "A live alert pops up instantly."
6. **Click "Fix Now"** — "We can turn off all devices with one click. The alert disappears."
7. **Go to Energy Analytics** — "We can see the daily waste projected over 8 hours, and estimated savings of ₹X per day."
8. **Go to Settings** — change tariff to ₹10 — "The cost calculations update instantly across the whole dashboard."
9. **Refresh the browser** — "Settings are saved automatically — no backend needed."
10. **Closing line** — "EcoWatch is a simple, zero-cost solution to make any campus smarter and greener."

---

## ⚠️ Disclaimer

> All sensor data, occupancy counts, and energy readings in EcoWatch are **simulated estimates for demonstration purposes only**. This application does not connect to real sensors, meters, or any campus infrastructure.

---

## 👨‍💻 Built for

College Hackathon · Campus Energy Sustainability Track

*"Small changes in awareness lead to large savings in energy."*
