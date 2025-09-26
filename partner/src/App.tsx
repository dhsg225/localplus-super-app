import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@shared/services/supabase';
import { authService } from '@shared/services/authService';
import { Button } from '@shared/components';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import BookingDashboard from './pages/BookingDashboard';
import NotificationSettings from './pages/NotificationSettings';
import Navigation from './components/Navigation';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user as User);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user as User);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={(user) => setUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage="dashboard"
        onPageChange={() => {}}
        user={user}
        onLogout={handleLogout}
        showAdminLink={true}
      />
      
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<BookingDashboard />} />
          <Route path="/notifications" element={<NotificationSettings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
