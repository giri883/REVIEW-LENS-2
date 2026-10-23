export type ServiceCategory =
  | 'Food Delivery'
  | 'E-Commerce'
  | 'Banking'
  | 'Travel'
  | 'Education'
  | 'Healthcare'
  | 'Entertainment'
  | 'Local Services';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  logo: string;
  description: string;
  websiteUrl: string;
  isEmbeddable: boolean;
  isActive: boolean;
  rating: number;
  feedbackCount: number;
  tags?: string[];
  mockTheme?: {
    primaryColor: string;
    tagline: string;
  };
}

export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export type SentimentType = 'Positive' | 'Neutral' | 'Negative' | 'Mixed';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type FeedbackCategory =
  | 'Product'
  | 'Service'
  | 'Support'
  | 'Payment'
  | 'Delivery'
  | 'User Interface'
  | 'Performance'
  | 'Other';

export type FeedbackStatus = 'New' | 'Under Review' | 'In Progress' | 'Resolved';

export interface FeedbackItem {
  id: string; // e.g. "ENG-4891"
  serviceId: string;
  serviceName: string;
  rating: FeedbackRating;
  ratingEmoji: string; // "😊 Great" | "🙂 Good" | "😐 Okay" | "😕 Not Good" | "😞 Poor"
  rawText: string;
  refinedText?: string;
  aiSummary?: string;
  sentiment: SentimentType;
  sentimentScore: number; // 0 to 100
  category: FeedbackCategory;
  priority: PriorityLevel;
  topic: string;
  isAnonymous: boolean;
  customerName?: string;
  customerEmail?: string;
  imageUrl?: string;
  hasVoiceNote?: boolean;
  isQuickFeedback?: boolean;
  quickType?: 'like' | 'dislike';
  status: FeedbackStatus;
  internalNotes?: string;
  createdAt: string;
  userId?: string;
}

export interface AssistantAnalysisResult {
  refinedText: string;
  sentiment: SentimentType;
  sentimentScore: number;
  category: FeedbackCategory;
  priority: PriorityLevel;
  topic: string;
  aiSummary: string;
  suggestedAction: string;
}

export interface IssueItem {
  id: string;
  issue: string;
  serviceId?: string;
  serviceName: string;
  category: FeedbackCategory;
  mentions: number;
  sentiment: SentimentType;
  priority: PriorityLevel;
  status: FeedbackStatus;
  sampleQuote: string;
  lastReported: string;
}

export interface AIInsightReport {
  overallHealth: string;
  mostCommonProblems: Array<{
    problem: string;
    frequency: string;
    affectedServices: string[];
    urgency: PriorityLevel;
  }>;
  frequentlyMentionedTopics: Array<{
    topic: string;
    percentage: number;
    sentimentTone: SentimentType;
  }>;
  emergingIssues: Array<{
    issue: string;
    detectedWindow: string;
    growthRate: string;
    riskLevel: PriorityLevel;
  }>;
  positiveTrends: Array<{
    highlight: string;
    impact: string;
  }>;
  areasRequiringAttention: Array<{
    area: string;
    reason: string;
    recommendedAction: string;
  }>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
}
