import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useApp, useNotifications } from '../../contexts/AppContext';
import { api } from '../../services/api';

export const Header: React.FC = () => {
  const { state, dispatch } = useApp();
  const { showNotification } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      showNotification('You have been logged out successfully', 'info');
    }
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-500" />
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads, campaigns..."
            className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-md hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {state.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{state.user?.name}</p>
              <p className="text-xs text-gray-500">{state.user?.email}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{state.user?.name}</p>
                <p className="text-sm text-gray-500">{state.user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {state.user?.subscription} plan • {state.user?.role}
                </p>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  // Navigate to profile/settings
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="w-4 h-4 mr-3" />
                Profile
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  // Navigate to settings
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </button>

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};