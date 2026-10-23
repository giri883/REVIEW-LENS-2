import React from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { OwnerDashboard } from './components/OwnerDashboard';
import { CustomerDashboard } from './components/CustomerDashboard';

export default function App() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // 1. Loading state while checking persistent session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono tracking-wider">
          Initializing Review Lens Authentication System...
        </p>
      </div>
    );
  }

  // 2. When users open the website, the first page must be the Login Page.
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // 3. When the user logs in as Owner, redirect to the Owner Dashboard.
  // Displays only that particular owner's business information and reviews.
  if (user.role === 'owner') {
    return <OwnerDashboard />;
  }


  // 4. When the user logs in as Customer, redirect to the Customer Dashboard.
  // Displays available businesses, write review, and manage only their own reviews.
  return <CustomerDashboard />;
}
