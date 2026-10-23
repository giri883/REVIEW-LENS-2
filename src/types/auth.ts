export type UserRole = 'owner' | 'customer' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'customer';
  phone?: string;
  businessId?: string;
  avatar?: string;
  company?: string;
  title?: string;
  createdAt?: string;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  rating: number;
  reviewCount: number;
  image: string;
}

export interface Review {
  id: string;
  businessId: string;
  businessName: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  status: 'New' | 'In Progress' | 'Resolved';
  ownerReply?: {
    text: string;
    repliedAt: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface OwnerAnalytics {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: { [key: number]: number };
  statusBreakdown: { [key: string]: number };
  sentimentBreakdown: { [key: string]: number };
  responseRate: number;
  satisfactionRate: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'owner' | 'customer') => Promise<{ success: boolean; error?: string }>;
  signup: (formData: {
    name: string;
    email: string;
    password: string;
    role: 'owner' | 'customer';
    phone?: string;
    businessName?: string;
    businessCategory?: string;
    businessAddress?: string;
    businessDescription?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: 'owner' | 'customer', specificOwner?: 'alex' | 'sarah' | 'david') => Promise<void>;
}
