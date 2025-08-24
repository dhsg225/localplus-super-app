import { useState, useEffect } from 'react';
import { ToastProvider } from '../../shared/components/Toast';
import Navigation from './components/Navigation';
import { LoginForm } from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import BookingDashboard from './pages/BookingDashboard';
import AvailabilitySettings from './pages/AvailabilitySettings';
import Analytics from './pages/Analytics';
import StaffManagement from './pages/StaffManagement';
import NotificationSettings from './pages/NotificationSettings';
import AdminPartnerLinker from './pages/AdminPartnerLinker';
import { authService } from '../../shared/services/authService';
import type { UnifiedUser } from '../../shared/services/authService';
import { supabase } from '../../shared/services/supabase';
import { bookingService } from '../../shared/services/bookingService'; // [2024-07-08] - For partner restaurant check
import './styles/App.css';
import { Session } from '@supabase/supabase-js';

type Page = 'dashboard' | 'bookings' | 'availability' | 'analytics' | 'settings' | 'staff' | 'notifications' | 'admin-linker';

function App() {
  const [user, setUser] = useState<UnifiedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [noPartnerAccess, setNoPartnerAccess] = useState(false); // [2024-07-08] - Track if user is unlinked

  useEffect(() => {
    // Check current auth state
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const currentUser = await authService.getUserProfile(session.user);
          setUser(currentUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // [DEV BYPASS] Only allow in development
    if ((import.meta as any).env.DEV) {
      const devUserRaw = typeof window !== 'undefined' ? localStorage.getItem('partner_dev_user') : null;
      if (devUserRaw) {
        try {
          const devUser = JSON.parse(devUserRaw);
          setUser({
            id: devUser.id,
            email: devUser.email,
            firstName: devUser.firstName,
            lastName: devUser.lastName,
            phone: devUser.phone || '',
            avatar: '',
            roles: ['partner'],
            isEmailVerified: true,
            isActive: true,
            createdAt: new Date(),
            lastLoginAt: new Date(),
            loginProvider: 'email',
            partnerProfile: {
              businessIds: [devUser.businessId],
              permissions: ['all'],
              role: 'owner',
            },
          });
          setLoading(false);
          return;
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log('Current user:', user);
    }
  }, [user]);

  useEffect(() => {
    if (user && (user.roles?.includes('partner') || user.roles?.includes('admin'))) {
      // [2024-07-08] - Check if user is linked to any business
      bookingService.getPartnerRestaurants()
        .then(() => setNoPartnerAccess(false))
        .catch((err) => {
          if (err.message && err.message.includes('No restaurants found')) {
            setNoPartnerAccess(true);
          } else {
            setNoPartnerAccess(false);
          }
        });
    }
  }, [user]);

  const handleLoginSuccess = async () => {
    // Refresh user data after login
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // [2024-07-08] - Show friendly message for unlinked users
  if (noPartnerAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded shadow">
          <div className="mx-auto h-12 w-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">🔗</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Linked to a Business</h2>
          <p className="text-gray-600 mb-4">Your account is not yet linked to any restaurant or business. You will not see any dashboard data until an admin links you.</p>
          <a
            href="mailto:support@localplus.com?subject=Request%20Business%20Access"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            Request Access
          </a>
          <p className="text-xs text-gray-500 mt-4">If you believe this is an error, please contact support or your admin.</p>
        </div>
      </div>
    );
  }

  // Check if user has partner access
  const hasPartnerAccess = user.roles?.includes('partner') || user.roles?.includes('admin');
  if (!hasPartnerAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">This account does not have partner privileges.</p>
          <p className="text-sm text-gray-500">
            Current roles: {user.roles?.join(', ') || 'none'}
          </p>
          <button 
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={(page: string) => setCurrentPage(page as Page)} />;
      case 'bookings':
        return <BookingDashboard />;
      case 'availability':
        return <AvailabilitySettings />;
      case 'analytics':
        return <Analytics />;
      case 'staff':
        return <StaffManagement />;
      case 'notifications':
        return <NotificationSettings user={user} />;
      case 'admin-linker':
        return <AdminPartnerLinker />;
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-gray-600">Settings page coming soon...</p>
          </div>
        );
      default:
        return <Dashboard onNavigate={(page: string) => setCurrentPage(page as Page)} />;
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          currentPage={currentPage} 
          onPageChange={(page: string) => setCurrentPage(page as Page)}
          user={user}
          onLogout={handleLogout}
          showAdminLink={user.roles?.includes('admin')}
        />
        <main className="ml-64">
          {renderPage()}
        </main>
      </div>
    </ToastProvider>
  );
}

export default App; 