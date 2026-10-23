import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { FeedbackItem, AssistantAnalysisResult } from './src/types/engageEd';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// DATABASE HELPERS
const DB_PATH = path.resolve(__dirname, 'data', 'db.json');

function getDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { users: [], businesses: [], reviews: [], notifications: [] };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { users: [], businesses: [], reviews: [], notifications: [] };
  }
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

function getAuthUser(req: express.Request) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '') || (req.headers['x-user-id'] as string);
  if (!token) return null;
  const db = getDB();
  return db.users.find((u: any) => u.id === token) || null;
}

// Shared Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'ReviewLens',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// AUTHENTICATION API (Role-Based Access Control)
// ============================================================================

// 1. Login with Role Verification
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = getDB();
  const trimmedEmail = email.trim().toLowerCase();
  const user = db.users.find((u: any) => u.email.toLowerCase() === trimmedEmail);

  if (!user) {
    return res.status(401).json({ error: 'No account found with this email address.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
  }

  // Enforce requested role match if specified
  if (role && user.role !== role) {
    const roleTitle = user.role === 'owner' ? 'Owner' : 'Customer';
    return res.status(403).json({
      error: `This account is registered as an ${roleTitle}. Please select the ${roleTitle} role option to sign in.`,
    });
  }

  const { password: _, ...safeUser } = user;
  return res.json({
    token: user.id,
    user: safeUser,
  });
});

// 2. Sign Up with Role and Business Setup
app.post('/api/auth/signup', (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    businessName,
    businessCategory,
    businessAddress,
    businessDescription,
  } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const db = getDB();
  const trimmedEmail = email.trim().toLowerCase();
  const existing = db.users.find((u: any) => u.email.toLowerCase() === trimmedEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUserId = `usr_${role}_${Date.now().toString(36)}`;
  let newBusinessId: string | undefined = undefined;

  if (role === 'owner') {
    if (!businessName) {
      return res.status(400).json({ error: 'Business name is required for Owner accounts.' });
    }
    newBusinessId = `biz_${Date.now().toString(36)}`;
    const newBusiness = {
      id: newBusinessId,
      ownerId: newUserId,
      name: businessName.trim(),
      category: businessCategory || 'General Service',
      description: businessDescription || `${businessName} provides quality services to its valued customers.`,
      address: businessAddress || 'Downtown Business Hub',
      phone: phone || '+1 (555) 000-0000',
      email: trimmedEmail,
      website: `https://${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.example.com`,
      hours: 'Mon-Sat: 9:00 AM - 8:00 PM',
      rating: 5.0,
      reviewCount: 0,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
    };
    db.businesses.push(newBusiness);
  }

  const newUser = {
    id: newUserId,
    email: trimmedEmail,
    password,
    name: name.trim(),
    role,
    phone: phone || '',
    businessId: newBusinessId,
    avatar:
      role === 'owner'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDB(db);

  const { password: _, ...safeUser } = newUser;
  return res.status(201).json({
    token: newUser.id,
    user: safeUser,
  });
});

// 3. Reset Password
app.post('/api/auth/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required.' });
  }

  const db = getDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email.' });
  }

  user.password = newPassword;
  saveDB(db);
  return res.json({ success: true, message: 'Password updated successfully. Please log in.' });
});

// 4. Get Current User Profile
app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
  }
  const { password: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});

// ============================================================================
// PUBLIC BUSINESSES API
// ============================================================================

app.get('/api/businesses', (req, res) => {
  const db = getDB();
  return res.json({ businesses: db.businesses || [] });
});

app.get('/api/businesses/:id', (req, res) => {
  const db = getDB();
  const business = db.businesses.find((b: any) => b.id === req.params.id);
  if (!business) {
    return res.status(404).json({ error: 'Business not found.' });
  }
  const reviews = db.reviews.filter((r: any) => r.businessId === req.params.id);
  return res.json({ business, reviews });
});

// ============================================================================
// OWNER DASHBOARD & BUSINESS MANAGEMENT API (Strictly isolated per owner)
// ============================================================================

app.get('/api/owner/dashboard', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (user.role !== 'owner') {
    return res.status(403).json({ error: 'Access forbidden: Owner role required.' });
  }

  const db = getDB();
  // Strictly find this owner's business ONLY
  const business = db.businesses.find(
    (b: any) => b.ownerId === user.id || b.id === user.businessId
  );

  if (!business) {
    return res.status(404).json({ error: 'No business linked to this owner account.' });
  }

  // Strictly filter reviews for this business ONLY
  const reviews = db.reviews.filter((r: any) => r.businessId === business.id);

  // Compute analytics specifically for this owner's business
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? Number((reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / totalReviews).toFixed(1))
      : 5.0;

  const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const statusBreakdown = { New: 0, 'In Progress': 0, Resolved: 0 };
  const sentimentBreakdown = { Positive: 0, Neutral: 0, Negative: 0 };

  reviews.forEach((r: any) => {
    const star = r.rating as 1 | 2 | 3 | 4 | 5;
    if (ratingBreakdown[star] !== undefined) ratingBreakdown[star]++;

    const st = r.status as 'New' | 'In Progress' | 'Resolved';
    if (statusBreakdown[st] !== undefined) statusBreakdown[st]++;

    const sm = r.sentiment as 'Positive' | 'Neutral' | 'Negative';
    if (sentimentBreakdown[sm] !== undefined) sentimentBreakdown[sm]++;
  });

  const notifications = (db.notifications || []).filter((n: any) => n.userId === user.id);

  const { password: _, ...safeOwnerProfile } = user;

  return res.json({
    owner: safeOwnerProfile,
    business,
    reviews,
    analytics: {
      totalReviews,
      averageRating: avgRating,
      ratingBreakdown,
      statusBreakdown,
      sentimentBreakdown,
      responseRate: totalReviews > 0 ? Math.round((reviews.filter((r: any) => !!r.ownerReply).length / totalReviews) * 100) : 100,
      satisfactionRate: totalReviews > 0 ? Math.round((reviews.filter((r: any) => r.rating >= 4).length / totalReviews) * 100) : 100,
    },
    notifications,
  });
});

// Update Owner Business Details
app.put('/api/owner/business', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'owner') {
    return res.status(403).json({ error: 'Owner access required.' });
  }

  const db = getDB();
  const business = db.businesses.find(
    (b: any) => b.ownerId === user.id || b.id === user.businessId
  );
  if (!business) {
    return res.status(404).json({ error: 'Business not found.' });
  }

  const { name, category, description, address, phone, email, website, hours, image } = req.body;
  if (name) business.name = name;
  if (category) business.category = category;
  if (description) business.description = description;
  if (address) business.address = address;
  if (phone) business.phone = phone;
  if (email) business.email = email;
  if (website) business.website = website;
  if (hours) business.hours = hours;
  if (image) business.image = image;

  // Also update businessName on reviews
  db.reviews.forEach((r: any) => {
    if (r.businessId === business.id && name) {
      r.businessName = name;
    }
  });

  saveDB(db);
  return res.json({ success: true, business });
});

// Update Review Status and Reply (Owner only for their own business)
app.put('/api/owner/reviews/:id/status', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'owner') {
    return res.status(403).json({ error: 'Owner access required.' });
  }

  const db = getDB();
  const business = db.businesses.find(
    (b: any) => b.ownerId === user.id || b.id === user.businessId
  );
  if (!business) {
    return res.status(404).json({ error: 'Business not found.' });
  }

  const review = db.reviews.find((r: any) => r.id === req.params.id);
  if (!review) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  // Security check: review must belong to this owner's business!
  if (review.businessId !== business.id) {
    return res.status(403).json({ error: 'Access denied: You can only manage reviews for your own business.' });
  }

  const { status, ownerReply } = req.body;
  if (status) review.status = status;
  if (ownerReply !== undefined) {
    review.ownerReply = ownerReply
      ? { text: ownerReply.trim(), repliedAt: new Date().toISOString() }
      : null;

    // Send customer a notification
    if (review.customerId) {
      db.notifications.push({
        id: `notif_${Date.now().toString(36)}`,
        userId: review.customerId,
        title: 'Business Owner Replied',
        message: `${business.name} replied to your review: "${review.title || review.comment.slice(0, 30)}..."`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }
  }

  saveDB(db);
  return res.json({ success: true, review });
});

// ============================================================================
// CUSTOMER DASHBOARD & REVIEWS API
// ============================================================================

app.get('/api/customer/dashboard', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (user.role !== 'customer') {
    return res.status(403).json({ error: 'Access forbidden: Customer role required.' });
  }

  const db = getDB();
  // Filter only reviews written by this customer
  const myReviews = db.reviews.filter((r: any) => r.customerId === user.id);
  const businesses = db.businesses || [];
  const notifications = (db.notifications || []).filter((n: any) => n.userId === user.id);

  const { password: _, ...safeCustomerProfile } = user;

  return res.json({
    customer: safeCustomerProfile,
    myReviews,
    businesses,
    notifications,
  });
});

// Customer writes a review
app.post('/api/customer/reviews', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'customer') {
    return res.status(403).json({ error: 'Customer access required.' });
  }

  const { businessId, rating, title, comment } = req.body;
  if (!businessId || !rating || !comment) {
    return res.status(400).json({ error: 'Business ID, rating, and review comment are required.' });
  }

  const db = getDB();
  const business = db.businesses.find((b: any) => b.id === businessId);
  if (!business) {
    return res.status(404).json({ error: 'Selected business not found.' });
  }

  const numRating = Math.max(1, Math.min(5, Math.round(Number(rating))));
  const sentiment = numRating >= 4 ? 'Positive' : numRating === 3 ? 'Neutral' : 'Negative';

  const newReview = {
    id: `rev_${Date.now().toString(36)}`,
    businessId: business.id,
    businessName: business.name,
    customerId: user.id,
    customerName: user.name,
    customerAvatar: user.avatar,
    rating: numRating,
    title: title ? title.trim() : `${numRating}-Star Review`,
    comment: comment.trim(),
    sentiment,
    status: 'New',
    ownerReply: null,
    createdAt: new Date().toISOString(),
  };

  db.reviews.unshift(newReview);

  // Recalculate business average rating & count
  const bizReviews = db.reviews.filter((r: any) => r.businessId === business.id);
  business.reviewCount = bizReviews.length;
  business.rating = Number(
    (bizReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / bizReviews.length).toFixed(1)
  );

  // Notify business owner
  db.notifications.push({
    id: `notif_${Date.now().toString(36)}`,
    userId: business.ownerId,
    title: `New ${numRating}-Star Review`,
    message: `${user.name} wrote a review for ${business.name}: "${newReview.title}"`,
    timestamp: new Date().toISOString(),
    read: false,
  });

  saveDB(db);
  return res.status(201).json({ success: true, review: newReview, business });
});

// Customer edits their own review
app.put('/api/customer/reviews/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'customer') {
    return res.status(403).json({ error: 'Customer access required.' });
  }

  const db = getDB();
  const review = db.reviews.find((r: any) => r.id === req.params.id);
  if (!review) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  // Security check: customer can only edit their own review!
  if (review.customerId !== user.id) {
    return res.status(403).json({ error: 'Access denied: You can only edit your own reviews.' });
  }

  const { rating, title, comment } = req.body;
  if (rating !== undefined) {
    review.rating = Math.max(1, Math.min(5, Math.round(Number(rating))));
    review.sentiment = review.rating >= 4 ? 'Positive' : review.rating === 3 ? 'Neutral' : 'Negative';
  }
  if (title !== undefined) review.title = title.trim();
  if (comment !== undefined) review.comment = comment.trim();
  review.updatedAt = new Date().toISOString();

  // Recalculate business average rating
  const bizReviews = db.reviews.filter((r: any) => r.businessId === review.businessId);
  const business = db.businesses.find((b: any) => b.id === review.businessId);
  if (business) {
    business.rating = Number(
      (bizReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / bizReviews.length).toFixed(1)
    );
  }

  saveDB(db);
  return res.json({ success: true, review });
});

// Customer deletes their own review
app.delete('/api/customer/reviews/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'customer') {
    return res.status(403).json({ error: 'Customer access required.' });
  }

  const db = getDB();
  const reviewIndex = db.reviews.findIndex((r: any) => r.id === req.params.id);
  if (reviewIndex === -1) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  const review = db.reviews[reviewIndex];
  // Security check: customer can only delete their own review!
  if (review.customerId !== user.id) {
    return res.status(403).json({ error: 'Access denied: You can only delete your own reviews.' });
  }

  const businessId = review.businessId;
  db.reviews.splice(reviewIndex, 1);

  // Recalculate business average rating
  const bizReviews = db.reviews.filter((r: any) => r.businessId === businessId);
  const business = db.businesses.find((b: any) => b.id === businessId);
  if (business) {
    business.reviewCount = bizReviews.length;
    business.rating =
      bizReviews.length > 0
        ? Number((bizReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / bizReviews.length).toFixed(1))
        : 5.0;
  }

  saveDB(db);
  return res.json({ success: true, message: 'Review deleted successfully.' });
});


// 1. SMART FEEDBACK ASSISTANT
// Helps customer articulate thoughts, converts slang/mixed language, detects sentiment, category, priority
app.post('/api/ai/assist-feedback', async (req, res) => {
  try {
    const { rawText, serviceName, ratingEmoji } = req.body;

    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ error: 'Feedback text is required.' });
    }

    if (!apiKey) {
      // Local fallback heuristics
      const lower = rawText.toLowerCase();
      let sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Mixed' = 'Neutral';
      if (lower.includes('good') && (lower.includes('late') || lower.includes('slow') || lower.includes('bad') || lower.includes('but'))) {
        sentiment = 'Mixed';
      } else if (lower.includes('late') || lower.includes('fail') || lower.includes('poor') || lower.includes('worst') || lower.includes('broken')) {
        sentiment = 'Negative';
      } else if (lower.includes('great') || lower.includes('fast') || lower.includes('love') || lower.includes('smooth') || lower.includes('best')) {
        sentiment = 'Positive';
      }

      let category: 'Product' | 'Service' | 'Support' | 'Payment' | 'Delivery' | 'User Interface' | 'Performance' | 'Other' = 'Service';
      if (lower.includes('delivery') || lower.includes('courier') || lower.includes('food') || lower.includes('late')) category = 'Delivery';
      else if (lower.includes('payment') || lower.includes('refund') || lower.includes('charge') || lower.includes('money')) category = 'Payment';
      else if (lower.includes('ui') || lower.includes('interface') || lower.includes('button') || lower.includes('screen')) category = 'User Interface';
      else if (lower.includes('support') || lower.includes('agent') || lower.includes('chat')) category = 'Support';
      else if (lower.includes('freeze') || lower.includes('speed') || lower.includes('slow') || lower.includes('crash')) category = 'Performance';

      let priority: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
      if (sentiment === 'Negative' && (lower.includes('fail') || lower.includes('charge') || lower.includes('money') || lower.includes('spilled'))) {
        priority = 'Critical';
      } else if (sentiment === 'Positive') {
        priority = 'Low';
      }

      let refinedText = rawText;
      if (lower.includes('romba late') && lower.includes('good')) {
        refinedText = 'Overall, the service quality was good, but the delivery was significantly delayed.';
      } else if (sentiment === 'Negative') {
        refinedText = `Experiencing issues with ${serviceName || 'the service'}: ${rawText.trim()}`;
      } else if (sentiment === 'Positive') {
        refinedText = `Very pleased with ${serviceName || 'the service'}: ${rawText.trim()}`;
      }

      return res.json({
        refinedText,
        sentiment,
        sentimentScore: sentiment === 'Positive' ? 90 : sentiment === 'Negative' ? 20 : 50,
        category,
        priority,
        topic: `${category} Experience`,
        aiSummary: `Customer feedback regarding ${serviceName || 'service'}: "${rawText.slice(0, 80)}..."`,
        suggestedAction: `Review ${category.toLowerCase()} operational workflow.`,
        aiPowered: false,
      });
    }

    const systemInstruction = `You are ReviewLens AI, an empathetic and intelligent Customer Feedback Assistant.
Your task is to:
1. Help the customer express their thoughts in clear, constructive, professional English without altering their intended meaning or sentiment. If the customer wrote in casual slang, mixed language (e.g. Manglish, Hinglish, Tanglish, Singlish), or informal shorthand, translate and refine it into clear, respectful prose.
2. Determine the exact sentiment ("Positive", "Neutral", "Negative", or "Mixed").
3. Determine sentiment score (percentage 0 to 100).
4. Identify the most appropriate category: "Product", "Service", "Support", "Payment", "Delivery", "User Interface", "Performance", or "Other".
5. Assign a priority level: "Low", "Medium", "High", or "Critical".
6. Generate a concise 1-sentence executive summary.
7. Provide a suggested action for the business team.

Output ONLY valid JSON adhering strictly to the schema.`;

    const prompt = `Service: "${serviceName || 'General Service'}"
Customer Experience Rating: "${ratingEmoji || 'Neutral'}"
Raw Customer Input: "${rawText}"

JSON Schema:
{
  "refinedText": string (clear, constructive feedback preserving customer intent),
  "sentiment": "Positive" | "Neutral" | "Negative" | "Mixed",
  "sentimentScore": number (0-100),
  "category": "Product" | "Service" | "Support" | "Payment" | "Delivery" | "User Interface" | "Performance" | "Other",
  "priority": "Low" | "Medium" | "High" | "Critical",
  "topic": string (concise topic label like "Delivery Delay", "Checkout Usability", "Duplicate Charge"),
  "aiSummary": string (1 sentence summary of what the customer is saying),
  "suggestedAction": string (actionable advice for the business)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed: AssistantAnalysisResult = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, aiPowered: true });
  } catch (error) {
    console.error('Error in assist-feedback endpoint:', error);
    return res.status(500).json({ error: 'Failed to process feedback with AI.' });
  }
});

// Single review analysis compatibility endpoint
app.post('/api/analyze-single', async (req, res) => {
  try {
    const { text, product, rating, feedbackType } = req.body;
    const rawText = text || '';
    const serviceName = product || 'General Service';
    const ratingEmoji = rating >= 4 ? '😊 Great' : rating === 3 ? '😐 Okay' : '😞 Poor';

    if (!apiKey) {
      const isPositive = (rating || 5) >= 4;
      return res.json({
        sentiment: isPositive ? 'Positive' : 'Negative',
        sentimentScore: isPositive ? 88 : 25,
        emotion: isPositive ? 'Satisfied' : 'Frustrated',
        topic: feedbackType || 'Product Quality',
        priority: isPositive ? 'Low' : 'High',
        aiSummary: `Customer feedback regarding ${serviceName}: "${rawText.slice(0, 80)}..."`,
        recommendation: `Optimize and address ${feedbackType || 'service'} concerns.`,
        confidenceScore: 92,
        aiPowered: false,
      });
    }

    const systemInstruction = `You are ReviewLens AI Feedback Classifier. Analyze customer review and return structured classification JSON.`;
    const prompt = `Service/Product: "${serviceName}"
Rating: ${rating} / 5
Type: "${feedbackType || 'General'}"
Review: "${rawText}"

Schema:
{
  "sentiment": "Positive" | "Neutral" | "Negative" | "Mixed",
  "sentimentScore": number (0-100),
  "emotion": "Happy" | "Satisfied" | "Frustrated" | "Angry" | "Confused" | "Disappointed" | "Excited",
  "topic": string,
  "priority": "Low" | "Medium" | "High" | "Critical",
  "aiSummary": string,
  "recommendation": string,
  "confidenceScore": number
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, aiPowered: true });
  } catch (error) {
    console.error('Error in analyze-single:', error);
    return res.status(500).json({ error: 'Failed to analyze review' });
  }
});

// Conversational AI co-pilot for "Ask ReviewLens AI"
app.post('/api/chat', async (req, res) => {
  try {
    const { message, contextSummary } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!apiKey) {
      return res.json({
        answer: `[ReviewLens AI Intelligence]: Based on customer records, our key findings are:
1. Delivery transit delays on BiteExpress represent the top volume driver for customer complaints (35%).
2. Payment gateway duplicate debits on ApexPay require highest engineering urgency.
3. TrendCart e-commerce checkout and SkillForge support team hold our highest satisfaction scores (95%+).
Recommended priority: Deploy courier tracking webhooks and finalize automatic payment retry reconciliation.`,
        aiPowered: false,
      });
    }

    const systemInstruction = `You are ReviewLens AI, an executive customer feedback strategist for business owners.
Use the provided feedback dataset summary to answer questions accurately, citing specific services, recurring issues, sentiments, and actionable next steps.
Be concise, data-driven, strategic, and professional.`;

    const prompt = `Context Data:
${contextSummary || 'Multi-service feedback dataset across BiteExpress, TrendCart, ApexPay, SkyWings, and SkillForge.'}

User Question: "${message}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    return res.json({
      answer: response.text || 'Unable to generate response.',
      aiPowered: true,
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({ error: 'Failed to generate chat response.' });
  }
});

// Natural Language Feedback Search
app.post('/api/search', async (req, res) => {
  try {
    const { query, reviews } = req.body;
    if (!query || !reviews || !Array.isArray(reviews)) {
      return res.status(400).json({ error: 'Query and reviews array are required.' });
    }

    const qLower = query.toLowerCase();

    // Fast heuristic match
    const heuristicMatched = reviews
      .filter((r) => {
        const text = (r.text || r.rawText || '').toLowerCase();
        const prod = (r.product || r.serviceName || '').toLowerCase();
        const cat = (r.category || '').toLowerCase();
        const topic = (r.topic || '').toLowerCase();
        return (
          text.includes(qLower) ||
          prod.includes(qLower) ||
          cat.includes(qLower) ||
          topic.includes(qLower)
        );
      })
      .map((r) => r.id);

    if (!apiKey) {
      return res.json({
        matchedIds: heuristicMatched.length > 0 ? heuristicMatched : reviews.slice(0, 4).map((r) => r.id),
        intent: `Filtered feedback matching keyword query: "${query}"`,
        summaryAnswer: `Found relevant customer entries addressing "${query}".`,
        query,
      });
    }

    const reviewSamples = reviews
      .slice(0, 35)
      .map((r) => `[ID: ${r.id} | Product: ${r.product || r.serviceName} | Rating: ${r.rating}★ | ${r.sentiment}]: "${r.text || r.rawText}"`)
      .join('\n');

    const prompt = `Search Query: "${query}"

Review Database:
${reviewSamples}

Return JSON with:
{
  "matchedIds": string[] (IDs of reviews that semantically match or explain the query),
  "intent": string (explained search intent),
  "summaryAnswer": string (direct answer to query based on matched reviews)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, query });
  } catch (error) {
    console.error('Error in /api/search:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
});

// 2. AI INSIGHTS GENERATION FOR BUSINESS DASHBOARD
app.post('/api/ai/insights', async (req, res) => {
  try {
    const { feedbackList } = req.body as { feedbackList: FeedbackItem[] };

    if (!feedbackList || !Array.isArray(feedbackList) || feedbackList.length === 0) {
      return res.status(400).json({ error: 'Feedback list is required.' });
    }

    if (!apiKey) {
      return res.json({
        overallHealth: 'Aggregated sentiment shows strong customer appreciation for interface speed and support resolution, offset by recurring courier delays and billing timeouts.',
        mostCommonProblems: [
          { problem: 'Courier Transit Delays & Spills', frequency: '30% of complaints', affectedServices: ['BiteExpress Food Delivery'], urgency: 'Critical' },
          { problem: 'Payment Gateway Timeouts', frequency: '20% of complaints', affectedServices: ['ApexPay Digital Banking'], urgency: 'Critical' }
        ],
        frequentlyMentionedTopics: [
          { topic: 'Delivery Punctuality', percentage: 32, sentimentTone: 'Negative' },
          { topic: 'Checkout Ease', percentage: 26, sentimentTone: 'Positive' },
          { topic: 'Support Helpfulness', percentage: 22, sentimentTone: 'Positive' }
        ],
        emergingIssues: [
          { issue: 'Spike in delivery packaging leakage over last 48 hours.', detectedWindow: 'Past 3 days', growthRate: '+35%', riskLevel: 'Critical' }
        ],
        positiveTrends: [
          { highlight: '3-hour automated refund turnaround drives high trust in e-commerce.', impact: '+25% repeat purchase retention' }
        ],
        areasRequiringAttention: [
          { area: 'Live Courier Dispatch Webhooks', reason: 'Customer anxiety when tracking ETA is silent.', recommendedAction: 'Deploy SMS courier alerts with dynamic guarantees.' }
        ],
        aiPowered: false,
      });
    }

    const reviewsSummary = feedbackList
      .slice(0, 50)
      .map(
        (f) =>
          `[${f.serviceName} | ${f.rating}★ | ${f.category} | ${f.sentiment}]: "${f.refinedText || f.rawText}"`
      )
      .join('\n');

    const systemInstruction = `You are ReviewLens AI Executive Insights Engine.
Analyze customer feedback from participating multi-service platforms and generate high-level business intelligence.
Do NOT invent facts; ground all conclusions exclusively in the provided feedback corpus.
Return ONLY valid JSON.`;

    const prompt = `Analyze this customer feedback corpus (${feedbackList.length} items):

${reviewsSummary}

Return JSON with this schema:
{
  "overallHealth": string (2 sentences diagnosing sentiment and operational health),
  "mostCommonProblems": [
    {
      "problem": string,
      "frequency": string,
      "affectedServices": [string],
      "urgency": "Low" | "Medium" | "High" | "Critical"
    }
  ],
  "frequentlyMentionedTopics": [
    {
      "topic": string,
      "percentage": number,
      "sentimentTone": "Positive" | "Neutral" | "Negative" | "Mixed"
    }
  ],
  "emergingIssues": [
    {
      "issue": string,
      "detectedWindow": string,
      "growthRate": string,
      "riskLevel": "Low" | "Medium" | "High" | "Critical"
    }
  ],
  "positiveTrends": [
    {
      "highlight": string,
      "impact": string
    }
  ],
  "areasRequiringAttention": [
    {
      "area": string,
      "reason": string,
      "recommendedAction": string
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, aiPowered: true });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return res.status(500).json({ error: 'Failed to generate AI insights.' });
  }
});

// Vite middleware for dev / static files for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`ReviewLens server active on port ${PORT}`);
  });
}

startServer();
