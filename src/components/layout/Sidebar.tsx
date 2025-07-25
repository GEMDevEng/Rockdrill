import React from 'react';
import {
  LayoutDashboard,
  Users,
  Mail,
  BarChart3,
  FileText,
  Settings,
  Search,
  Menu,
  X
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useApp } from '../../contexts/AppContext';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Lead Management', icon: Users },
  { id: 'campaigns', label: 'Campaigns', icon: Mail },
  { id: 'research', label: 'Research', icon: Search },
  { id: 'templates', label: 'Email Templates', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  setCurrentPage,
  isOpen
}) => {
  const { dispatch } = useApp();
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false })}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Logo />
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false })}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
                }}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">john@company.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};