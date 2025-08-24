// [2024-12-19 10:39] - Enhanced partner app navigation with improved design
// [2024-12-19 22:30] - Navigation component with unified auth support
import React, { useState, useRef } from 'react';
import { Button } from '../../shared/components';
import type { UnifiedUser } from '../../shared/services/authService';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  user: UnifiedUser;
  onLogout: () => Promise<void>;
  showAdminLink?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange, user, onLogout, showAdminLink }) => {
  // Main and more items split
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'availability', label: 'Availability', icon: '⏰' },
  ];
  const moreNavItems = [
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'staff', label: 'Staff', icon: '👥' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];
  if (showAdminLink) {
    moreNavItems.push({ id: 'admin-linker', label: 'Admin Tools', icon: '🛠️' });
  }

  const isActive = (pageId: string) => currentPage === pageId;

  // Dropdown state
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreOpen]);

  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button 
              onClick={() => onPageChange('dashboard')}
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-lg">LP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  LocalPlus
                </h1>
                <p className="text-xs text-gray-500 font-medium">Partner Portal</p>
              </div>
            </button>
          </div>

          {/* Main Navigation + More Dropdown */}
          <nav className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.id)
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            {/* More Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((v) => !v)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  moreNavItems.some(item => isActive(item.id))
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                aria-haspopup="true"
                aria-expanded={moreOpen}
              >
                <span className="text-base">⋯</span>
                <span>More</span>
                <svg className={`w-4 h-4 ml-1 transition-transform ${moreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {moreOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {moreNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setMoreOpen(false); onPageChange(item.id); }}
                      className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium text-left rounded-lg transition-all duration-150 ${
                        isActive(item.id)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {user.email} • Online
                </p>
              </div>
            </div>
            <Button variant="outline" theme="blue" size="sm" className="hidden sm:block">
              Settings
            </Button>
            <Button 
              variant="primary" 
              theme="red" 
              size="sm"
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (unchanged) */}
      <div className="md:hidden border-t border-gray-100 bg-gray-50">
        <div className="px-4 py-3">
          <div className="grid grid-cols-4 gap-1">
            {[...mainNavItems, ...moreNavItems].map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive(item.id)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
