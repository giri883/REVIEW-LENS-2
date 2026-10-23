export type FeedbackCategory =
  | 'Product'
  | 'Service'
  | 'Support'
  | 'Delivery'
  | 'Pricing'
  | 'UI/UX'
  | 'User Experience'
  | 'Features'
  | 'General';

export type FeedbackType =
  | 'Product'
  | 'Service'
  | 'Support'
  | 'Pricing'
  | 'Delivery'
  | 'UI/UX'
  | 'Other';

export type FeedbackStatus = 'New' | 'Reviewing' | 'Under Review' | 'In Progress' | 'Resolved';

export type SentimentType = 'Positive' | 'Neutral' | 'Negative' | 'Mixed';

export type EmotionType =
  | 'Happy'
  | 'Satisfied'
  | 'Frustrated'
  | 'Angry'
  | 'Confused'
  | 'Disappointed'
  | 'Excited';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type FeedbackTopic =
  | 'UI/UX'
  | 'Performance'
  | 'Pricing'
  | 'Customer Support'
  | 'Product Quality'
  | 'Delivery'
  | 'Features'
  | 'Reliability'
  | string;

export interface FeedbackReview {
  id: string;
  customerName?: string;
  author?: string; // backwards compatibility alias
  email?: string;
  isAnonymous?: boolean;
  product: string;
  category?: string;
  feedbackType?: FeedbackType;
  rating: number; // 1 to 5
  text: string;
  imageUrl?: string;
  date: string;
  status: FeedbackStatus;
  ownerNotes?: string;

  // AI-Derived properties
  sentiment: SentimentType;
  sentimentScore?: number;
  emotion: EmotionType | string;
  topic: FeedbackTopic;
  priority: PriorityLevel;
  aiSummary: string;
  recommendation: string;
  confidenceScore?: number;
  keyTakeaway?: string;
}

export interface SentimentOverview {
  positive: number;
  neutral: number;
  negative: number;
  mixed?: number;
  total: number;
}

export interface EmotionItem {
  emotion: EmotionType;
  percentage: number;
  count: number;
  description: string;
  color: string;
}

export interface KeyIssue {
  id: string;
  name: string;
  frequencyPercent: number;
  count: number;
  severity: PriorityLevel;
  category: string;
  sampleQuote: string;
  status?: string;
}

export interface CustomerPreference {
  title: string;
  type: 'love' | 'want';
  category: string;
  impact: string;
  evidenceQuote: string;
}

export interface TopicDetection {
  topic: string;
  count: number;
  sentimentRatio: {
    positive: number;
    neutral: number;
    negative: number;
  };
  keyAspects: string[];
}

export interface ActionRecommendation {
  id: string;
  problem: string;
  suggestedAction: string;
  priority: PriorityLevel;
  expectedImpact: string;
  responsibleTeam: string;
  timeframe: string;
  status?: 'To Do' | 'In Progress' | 'Implemented';
}

export interface RadarMetrics {
  productQuality: number;
  pricing: number;
  support: number;
  delivery: number;
  usability: number;
  features: number;
  customerSatisfaction: number;
}

export interface VoiceItem {
  title: string;
  quote: string;
  category: string;
}

export interface TopCustomerVoices {
  summaryQuote: string;
  whatCustomersLove: VoiceItem[];
  whatCustomersDislike: VoiceItem[];
  whatCustomersWantNext: VoiceItem[];
}

export interface TrendItem {
  id: string;
  title: string;
  mentionsCount: number;
  firstDetected: string;
  latestDetected: string;
  sentiment: SentimentType;
  suggestedAction: string;
  severity: PriorityLevel;
}

export interface TrendDataPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  satisfactionScore: number;
  complaintCount: number;
}

export interface FeedbackTrends {
  sentimentTrend: 'improving' | 'declining' | 'stable';
  sentimentHistory: TrendDataPoint[];
  emergingIssueAlert: string;
  emergingIssues: Array<{
    topic: string;
    growthRate: string;
    urgency: PriorityLevel;
    evidence: string;
  }>;
  increasingComplaints: string[];
  improvingAreas: string[];
}

export interface WhyCustomersFeelThisWay {
  executiveExplanation: string;
  primaryNegativeDrivers: Array<{
    driver: string;
    impactExplanation: string;
    customerQuote: string;
  }>;
  primaryPositiveDrivers: Array<{
    driver: string;
    impactExplanation: string;
    customerQuote: string;
  }>;
  rootCauses: Array<{
    issue: string;
    rootCause: string;
    affectedSentiment: string;
  }>;
}

export interface CustomerVoiceScore {
  score: number;
  satisfaction: number;
  productQuality: number;
  support: number;
  experience: number;
  loyalty: number;
  summary: string;
}

export interface FeedbackHealthIndicator {
  status: 'Healthy' | 'Needs Attention' | 'Critical';
  explanation: string;
  keyRiskFactor?: string;
}

export interface ExecutiveSummary {
  overallSentiment: string;
  biggestComplaint: string;
  mostAppreciatedFeature: string;
  biggestOpportunity: string;
  mostUrgentAction: string;
  businessImpactForecast: string;
}

export interface AnalysisResult {
  id: string;
  analyzedAt: string;
  reviewCount: number;
  sentimentOverview: SentimentOverview;
  emotionBreakdown: EmotionItem[];
  customerVoiceScore: CustomerVoiceScore;
  feedbackHealth: FeedbackHealthIndicator;
  whyCustomersFeelThisWay: WhyCustomersFeelThisWay;
  actionCenter: ActionRecommendation[];
  keyIssues: KeyIssue[];
  customerPreferences: CustomerPreference[];
  topicDetection: TopicDetection[];
  radarMetrics: RadarMetrics;
  topCustomerVoices: TopCustomerVoices;
  trends: FeedbackTrends;
  executiveSummary: ExecutiveSummary;
  enrichedReviews: FeedbackReview[];
}

export interface DepartmentRecommendation {
  id: string;
  department: string;
  recommendation: string;
  reason: string;
  customerEvidence: string;
  priority: PriorityLevel;
  expectedBusinessImpact: string;
  suggestedNextStep: string;
  kpiToTrack: string;
}

export interface MarketInsight {
  comparisons: Array<{
    competitorOrAlternative: string;
    aspectCompared: string;
    customerPerception: string;
    advantageHolder: 'Our Company' | 'Competitor' | 'Tie';
  }>;
  customerPreferencesVsCompetitors: string[];
  competitorKeyStrengths: string[];
  untappedMarketOpportunities: string[];
  strategicTakeaway: string;
}

export interface ImprovementItem {
  id: string;
  problem: string;
  evidence: string;
  solution: string;
  expectedImpact: string;
  timeframe: 'Immediate' | 'Short Term' | 'Medium Term' | 'Long Term';
  priority: PriorityLevel;
}

export interface ImprovementRoadmap {
  immediate: ImprovementItem[];
  shortTerm: ImprovementItem[];
  mediumTerm: ImprovementItem[];
  longTerm: ImprovementItem[];
}

export interface FeedbackCluster {
  id: string;
  name: string;
  topic: FeedbackTopic;
  feedbackCount: number;
  dominantSentiment: SentimentType;
  aiConclusion: string;
  sampleQuotes: string[];
}

export interface NotificationAlert {
  id: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
