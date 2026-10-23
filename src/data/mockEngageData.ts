import { Service, FeedbackItem, IssueItem, AIInsightReport } from '../types/engageEd';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-food',
    name: 'BiteExpress Food Delivery',
    category: 'Food Delivery',
    logo: 'UtensilsCrossed',
    description: 'Hot meals, groceries & gourmet dining delivered in under 30 minutes.',
    websiteUrl: 'https://example.com/bite-express',
    isEmbeddable: true,
    isActive: true,
    rating: 4.2,
    feedbackCount: 18,
    tags: ['Restaurants', 'Groceries', 'Quick Commerce'],
    mockTheme: {
      primaryColor: '#f97316',
      tagline: 'Cravings fulfilled at lightning speed'
    }
  },
  {
    id: 'srv-ecom',
    name: 'TrendCart E-Commerce',
    category: 'E-Commerce',
    logo: 'ShoppingBag',
    description: 'Global marketplace for trending fashion, electronics, and home essentials.',
    websiteUrl: 'https://example.com/trendcart',
    isEmbeddable: true,
    isActive: true,
    rating: 4.5,
    feedbackCount: 24,
    tags: ['Fashion', 'Electronics', 'Prime Delivery'],
    mockTheme: {
      primaryColor: '#06b6d4',
      tagline: 'Shop the future today'
    }
  },
  {
    id: 'srv-bank',
    name: 'ApexPay Digital Banking',
    category: 'Banking',
    logo: 'Landmark',
    description: 'Zero-fee checking accounts, instant peer transfers, and high-yield savings.',
    websiteUrl: 'https://example.com/apexpay',
    isEmbeddable: false, // Security sensitive, requires external browser
    isActive: true,
    rating: 3.8,
    feedbackCount: 15,
    tags: ['Fintech', 'Payments', 'Savings'],
    mockTheme: {
      primaryColor: '#3b82f6',
      tagline: 'Smarter money for ambitious teams'
    }
  },
  {
    id: 'srv-travel',
    name: 'SkyWings Travel & Stays',
    category: 'Travel',
    logo: 'Plane',
    description: 'Seamless flight bookings, luxury stays, and curated adventure itineraries.',
    websiteUrl: 'https://example.com/skywings',
    isEmbeddable: true,
    isActive: true,
    rating: 4.4,
    feedbackCount: 12,
    tags: ['Flights', 'Hotels', 'Vacations'],
    mockTheme: {
      primaryColor: '#8b5cf6',
      tagline: 'Your passport to the extraordinary'
    }
  },
  {
    id: 'srv-edu',
    name: 'SkillForge Online Academy',
    category: 'Education',
    logo: 'GraduationCap',
    description: 'Interactive STEM bootcamps, coding sandboxes, and professional certifications.',
    websiteUrl: 'https://example.com/skillforge',
    isEmbeddable: true,
    isActive: true,
    rating: 4.7,
    feedbackCount: 20,
    tags: ['Learning', 'Coding', 'Certificates'],
    mockTheme: {
      primaryColor: '#10b981',
      tagline: 'Master real-world skills in weeks'
    }
  },
  {
    id: 'srv-health',
    name: 'VitalPulse TeleHealth',
    category: 'Healthcare',
    logo: 'HeartPulse',
    description: '24/7 video consultations with certified physicians and home prescription dispatch.',
    websiteUrl: 'https://example.com/vitalpulse',
    isEmbeddable: false,
    isActive: true,
    rating: 4.1,
    feedbackCount: 11,
    tags: ['Telemedicine', 'Pharmacy', 'Wellness'],
    mockTheme: {
      primaryColor: '#ec4899',
      tagline: 'Expert care at your fingertips'
    }
  },
  {
    id: 'srv-ent',
    name: 'StreamWave Cinema & Audio',
    category: 'Entertainment',
    logo: 'Clapperboard',
    description: '4K HDR movie streaming, indie documentaries, and spatial audio podcasts.',
    websiteUrl: 'https://example.com/streamwave',
    isEmbeddable: true,
    isActive: true,
    rating: 4.6,
    feedbackCount: 16,
    tags: ['Streaming', 'Podcasts', 'Dolby Atmos'],
    mockTheme: {
      primaryColor: '#f43f5e',
      tagline: 'Stories that move the world'
    }
  },
  {
    id: 'srv-local',
    name: 'QuickFix Pro HomeCare',
    category: 'Local Services',
    logo: 'Wrench',
    description: 'Verified on-demand plumbers, electricians, cleaners, and appliance repair specialists.',
    websiteUrl: 'https://example.com/quickfix',
    isEmbeddable: true,
    isActive: true,
    rating: 3.9,
    feedbackCount: 13,
    tags: ['Home Repair', 'Handyman', 'Electrician'],
    mockTheme: {
      primaryColor: '#eab308',
      tagline: 'Trusted neighborhood experts on call'
    }
  }
];

export const INITIAL_FEEDBACK: FeedbackItem[] = [
  {
    id: 'ENG-4891',
    serviceId: 'srv-food',
    serviceName: 'BiteExpress Food Delivery',
    rating: 2,
    ratingEmoji: '😕 Not Good',
    rawText: 'delivery romba late ah vandhuchu but food was good',
    refinedText: 'Overall, the food quality was great, but the delivery arrived significantly later than the estimated ETA.',
    aiSummary: 'Customer enjoyed the prepared food but was frustrated by severe delivery transit delay.',
    sentiment: 'Mixed',
    sentimentScore: 42,
    category: 'Delivery',
    priority: 'Medium',
    topic: 'Delivery Delay',
    isAnonymous: false,
    customerName: 'Karthik Raja',
    customerEmail: 'karthik.r@example.com',
    status: 'In Progress',
    internalNotes: 'Dispatched $5 coupon for courier delay; courier hub notified.',
    createdAt: '2026-10-04T15:30:00Z'
  },
  {
    id: 'ENG-4892',
    serviceId: 'srv-ecom',
    serviceName: 'TrendCart E-Commerce',
    rating: 5,
    ratingEmoji: '😊 Great',
    rawText: 'The application interface is very easy to use and one-click checkout was super smooth!',
    refinedText: 'The user interface is exceptionally intuitive, and the one-click checkout made purchasing completely seamless.',
    aiSummary: 'Customer praises checkout ergonomics and interface simplicity.',
    sentiment: 'Positive',
    sentimentScore: 98,
    category: 'User Interface',
    priority: 'Low',
    topic: 'Checkout Usability',
    isAnonymous: false,
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    status: 'Resolved',
    internalNotes: 'Shared with checkout UX squad as positive benchmark.',
    createdAt: '2026-10-04T14:15:00Z'
  },
  {
    id: 'ENG-4893',
    serviceId: 'srv-bank',
    serviceName: 'ApexPay Digital Banking',
    rating: 1,
    ratingEmoji: '😞 Poor',
    rawText: 'Payment failed twice during my electricity bill payment and money got deducted twice without invoice generation.',
    refinedText: 'Encountered duplicate payment failures during bill checkout where account funds were debited twice without transaction confirmation.',
    aiSummary: 'Critical duplicate debit incident on utility payment with missing confirmation receipt.',
    sentiment: 'Negative',
    sentimentScore: 8,
    category: 'Payment',
    priority: 'Critical',
    topic: 'Duplicate Charge / Gateway Failure',
    isAnonymous: true,
    status: 'Under Review',
    internalNotes: 'Escalated to billing gateway engineering; auto-refund initiated.',
    createdAt: '2026-10-04T11:20:00Z'
  },
  {
    id: 'ENG-4894',
    serviceId: 'srv-edu',
    serviceName: 'SkillForge Online Academy',
    rating: 5,
    ratingEmoji: '😊 Great',
    rawText: 'Customer support solved my issue quickly when my sandbox terminal froze. Agent David was polite and knowledgeable.',
    refinedText: 'Customer support was remarkably fast and helpful in unfreezing my development sandbox environment.',
    aiSummary: 'Customer experienced fast, expert technical resolution from live support agent.',
    sentiment: 'Positive',
    sentimentScore: 95,
    category: 'Support',
    priority: 'Low',
    topic: 'Support Responsiveness',
    isAnonymous: false,
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.s@example.com',
    status: 'Resolved',
    internalNotes: 'Kudos given to Agent David in weekly standup.',
    createdAt: '2026-10-03T18:45:00Z'
  },
  {
    id: 'ENG-4895',
    serviceId: 'srv-food',
    serviceName: 'BiteExpress Food Delivery',
    rating: 1,
    ratingEmoji: '😞 Poor',
    rawText: 'Delivery was late by 40 minutes and the soup had spilled all over the paper container. Ruined dinner.',
    refinedText: 'The delivery arrived over 40 minutes late with damaged packaging, causing the soup to leak extensively inside the bag.',
    aiSummary: 'Severe delay coupled with damaged parcel packaging destroying customer order.',
    sentiment: 'Negative',
    sentimentScore: 12,
    category: 'Delivery',
    priority: 'Critical',
    topic: 'Damaged Food Packaging & Delay',
    isAnonymous: false,
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@example.com',
    status: 'In Progress',
    internalNotes: 'Full refund processed and packaging feedback sent to restaurant partner.',
    createdAt: '2026-10-03T16:10:00Z'
  },
  {
    id: 'ENG-4896',
    serviceId: 'srv-travel',
    serviceName: 'SkyWings Travel & Stays',
    rating: 4,
    ratingEmoji: '🙂 Good',
    rawText: 'Flight seat selection was very visual and easy. Wish baggage policy details were clearer before paying.',
    refinedText: 'The visual seat selection interface was great, though baggage fee rules could be made more transparent prior to payment.',
    aiSummary: 'Positive booking interface feedback with recommendation for earlier baggage pricing disclosure.',
    sentiment: 'Positive',
    sentimentScore: 78,
    category: 'Product',
    priority: 'Medium',
    topic: 'Baggage Pricing Transparency',
    isAnonymous: true,
    status: 'New',
    createdAt: '2026-10-03T09:30:00Z'
  },
  {
    id: 'ENG-4897',
    serviceId: 'srv-health',
    serviceName: 'VitalPulse TeleHealth',
    rating: 4,
    ratingEmoji: '🙂 Good',
    rawText: 'Doctor consultation started right on schedule. Audio and video quality remained crisp throughout.',
    refinedText: 'Punctual video consultation with excellent audio/video stream clarity and high practitioner professionalism.',
    aiSummary: 'Customer pleased with telemedicine video stability and doctor punctuality.',
    sentiment: 'Positive',
    sentimentScore: 88,
    category: 'Service',
    priority: 'Low',
    topic: 'Teleconsultation Quality',
    isAnonymous: false,
    customerName: 'Dr. Emily Watson',
    customerEmail: 'emily.w@example.com',
    status: 'Resolved',
    createdAt: '2026-10-02T14:00:00Z'
  },
  {
    id: 'ENG-4898',
    serviceId: 'srv-ent',
    serviceName: 'StreamWave Cinema & Audio',
    rating: 3,
    ratingEmoji: '😐 Okay',
    rawText: 'Catalog has great indie films but offline downloads keep failing on my iPad with error code 403.',
    refinedText: 'Indie content catalog is outstanding, but offline iPad downloads repeatedly encounter error code 403 authorization timeouts.',
    aiSummary: 'Content selection loved, but offline download caching mechanism experiences DRM/auth failures.',
    sentiment: 'Mixed',
    sentimentScore: 50,
    category: 'Performance',
    priority: 'High',
    topic: 'Offline Download Authorization Error',
    isAnonymous: false,
    customerName: 'Lucas Moretti',
    customerEmail: 'lucas.m@example.com',
    status: 'Under Review',
    internalNotes: 'iOS DRM token refresh bug ticket #DRM-902 filed.',
    createdAt: '2026-10-02T10:15:00Z'
  },
  {
    id: 'ENG-4899',
    serviceId: 'srv-local',
    serviceName: 'QuickFix Pro HomeCare',
    rating: 2,
    ratingEmoji: '😕 Not Good',
    rawText: 'Electrician arrived 2 hours after the promised booking slot without sending any heads-up message.',
    refinedText: 'The service technician arrived two hours past the scheduled appointment window without proactive customer notification.',
    aiSummary: 'Technician tardiness and lack of communication compromised service reliability.',
    sentiment: 'Negative',
    sentimentScore: 22,
    category: 'Service',
    priority: 'High',
    topic: 'Technician Punctuality & Communication',
    isAnonymous: false,
    customerName: 'Priya Patel',
    customerEmail: 'priya.p@example.com',
    status: 'In Progress',
    internalNotes: 'Partner compliance strike recorded; automated ETA notification patch planned.',
    createdAt: '2026-10-01T17:20:00Z'
  },
  {
    id: 'ENG-4900',
    serviceId: 'srv-ecom',
    serviceName: 'TrendCart E-Commerce',
    rating: 5,
    ratingEmoji: '😊 Great',
    rawText: 'Returned a pair of shoes that did not fit and the refund appeared in my bank within 3 hours. Best return policy ever.',
    refinedText: 'Seamless shoe return experience with refund credited back to account within 3 hours.',
    aiSummary: 'Customer delighted by ultra-fast 3-hour automated return processing.',
    sentiment: 'Positive',
    sentimentScore: 99,
    category: 'Payment',
    priority: 'Low',
    topic: 'Fast Refund Processing',
    isAnonymous: true,
    status: 'Resolved',
    createdAt: '2026-10-01T12:05:00Z'
  },
  {
    id: 'ENG-4901',
    serviceId: 'srv-bank',
    serviceName: 'ApexPay Digital Banking',
    rating: 2,
    ratingEmoji: '😕 Not Good',
    rawText: 'Biometric face unlock fails almost 50% of the time, forcing me to re-enter a 16-character master passphrase.',
    refinedText: 'Biometric authentication frequently fails, creating friction by repeatedly requiring manual passphrase entry.',
    aiSummary: 'Biometric biometric sensor timeout causing login friction and frustration.',
    sentiment: 'Negative',
    sentimentScore: 26,
    category: 'Performance',
    priority: 'High',
    topic: 'Biometric Login Reliability',
    isAnonymous: false,
    customerName: 'Henrik Lindqvist',
    customerEmail: 'henrik.l@example.com',
    status: 'Under Review',
    createdAt: '2026-09-30T16:40:00Z'
  },
  {
    id: 'ENG-4902',
    serviceId: 'srv-edu',
    serviceName: 'SkillForge Online Academy',
    rating: 4,
    ratingEmoji: '🙂 Good',
    rawText: 'Course instructors are top-tier engineers. The video speed toggle (1.5x) resets every time a new video starts.',
    refinedText: 'Instructors are world-class, though playback speed preferences should persist automatically across lesson videos.',
    aiSummary: 'Instructional quality praised with specific UI state persistence enhancement request.',
    sentiment: 'Positive',
    sentimentScore: 84,
    category: 'User Interface',
    priority: 'Low',
    topic: 'Video Player State Persistence',
    isAnonymous: false,
    customerName: 'Chloe Dupont',
    customerEmail: 'chloe.d@example.com',
    status: 'Resolved',
    createdAt: '2026-09-30T11:10:00Z'
  }
];

export const INITIAL_ISSUES: IssueItem[] = [
  {
    id: 'iss-1',
    issue: 'Fulfillment & Courier Transit Delays (>30m late)',
    serviceName: 'BiteExpress Food Delivery',
    category: 'Delivery',
    mentions: 14,
    sentiment: 'Negative',
    priority: 'Critical',
    status: 'In Progress',
    sampleQuote: 'Delivery was late by 40 minutes and soup had spilled all over.',
    lastReported: '2026-10-04'
  },
  {
    id: 'iss-2',
    issue: 'Payment Gateway Duplicate Charge / Timeout Errors',
    serviceName: 'ApexPay Digital Banking',
    category: 'Payment',
    mentions: 8,
    sentiment: 'Negative',
    priority: 'Critical',
    status: 'Under Review',
    sampleQuote: 'Payment failed twice during checkout and money deducted twice.',
    lastReported: '2026-10-04'
  },
  {
    id: 'iss-3',
    issue: 'Biometric Face ID Failure on Mobile App Launch',
    serviceName: 'ApexPay Digital Banking',
    category: 'Performance',
    mentions: 7,
    sentiment: 'Negative',
    priority: 'High',
    status: 'Under Review',
    sampleQuote: 'Biometric face unlock fails almost 50% of the time.',
    lastReported: '2026-09-30'
  },
  {
    id: 'iss-4',
    issue: 'Offline Content Download Error (Code 403)',
    serviceName: 'StreamWave Cinema & Audio',
    category: 'Performance',
    mentions: 6,
    sentiment: 'Negative',
    priority: 'High',
    status: 'Under Review',
    sampleQuote: 'Offline iPad downloads keep failing with error code 403.',
    lastReported: '2026-10-02'
  },
  {
    id: 'iss-5',
    issue: 'Technician Punctuality & Missing Dispatch Alerts',
    serviceName: 'QuickFix Pro HomeCare',
    category: 'Service',
    mentions: 5,
    sentiment: 'Negative',
    priority: 'High',
    status: 'In Progress',
    sampleQuote: 'Electrician arrived 2 hours after booking slot without notice.',
    lastReported: '2026-10-01'
  },
  {
    id: 'iss-6',
    issue: 'Video Player Playback Speed Auto-Reset Friction',
    serviceName: 'SkillForge Online Academy',
    category: 'User Interface',
    mentions: 4,
    sentiment: 'Neutral',
    priority: 'Low',
    status: 'Resolved',
    sampleQuote: 'Video speed toggle resets every time a new chapter begins.',
    lastReported: '2026-09-30'
  }
];

export const INITIAL_AI_INSIGHTS: AIInsightReport = {
  overallHealth: 'Customer sentiment is largely favorable across education and e-commerce (86% positive), but logistics latency in food delivery and payment gateway timeout spikes in fintech represent high-urgency friction areas requiring operational intervention.',
  mostCommonProblems: [
    {
      problem: 'Transit Delay & Opaque Courier Communication',
      frequency: '32% of negative reviews',
      affectedServices: ['BiteExpress Food Delivery', 'QuickFix Pro HomeCare'],
      urgency: 'Critical'
    },
    {
      problem: 'Duplicate Checkout Debits During Gateway Timeouts',
      frequency: '18% of negative reviews',
      affectedServices: ['ApexPay Digital Banking'],
      urgency: 'Critical'
    },
    {
      problem: 'Mobile App Biometric & DRM Authentication Failures',
      frequency: '14% of negative reviews',
      affectedServices: ['ApexPay Digital Banking', 'StreamWave Cinema'],
      urgency: 'High'
    }
  ],
  frequentlyMentionedTopics: [
    { topic: 'Delivery Punctuality', percentage: 28, sentimentTone: 'Negative' },
    { topic: 'Checkout & Return Speed', percentage: 24, sentimentTone: 'Positive' },
    { topic: 'Support Agent Helpfulness', percentage: 20, sentimentTone: 'Positive' },
    { topic: 'Mobile Navigation Ergonomics', percentage: 16, sentimentTone: 'Neutral' },
    { topic: 'Payment Reliability', percentage: 12, sentimentTone: 'Negative' }
  ],
  emergingIssues: [
    {
      issue: 'Courier packaging leak complaints spiked over the last 72 hours.',
      detectedWindow: 'Past 3 days',
      growthRate: '+38% increase',
      riskLevel: 'Critical'
    },
    {
      issue: 'iPad iOS 18 DRM video download failures following recent firmware release.',
      detectedWindow: 'Past 5 days',
      growthRate: '+25% increase',
      riskLevel: 'High'
    }
  ],
  positiveTrends: [
    {
      highlight: 'Ultra-fast refund turnaround (< 3 hours) in TrendCart drives organic 5★ ratings.',
      impact: 'Boosted e-commerce customer retention by 22% month-over-month.'
    },
    {
      highlight: 'Live screen-share support on technical queries achieves 96% first-contact resolution.',
      impact: 'Significantly elevated SkillForge user loyalty.'
    }
  ],
  areasRequiringAttention: [
    {
      area: 'Multi-Carrier Webhook Tracking Integration',
      reason: 'Customers feel anxious when couriers have zero tracking updates.',
      recommendedAction: 'Deploy real-time SMS tracking links with dynamic delivery SLA guarantees.'
    },
    {
      area: 'Payment Gateway Idempotency',
      reason: 'Users experiencing duplicate charges lose brand trust instantly.',
      recommendedAction: 'Institute automated Stripe/Visa 3DS retry queue and instant grace hold notification.'
    }
  ]
};
