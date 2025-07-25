import React from 'react';
import { Info, X } from 'lucide-react';
import { isDemoMode } from '../../services/mockApi';

interface DemoBannerProps {
  onDismiss?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isDemoMode() || !isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Info className="h-5 w-5 text-blue-400 mr-3" />
          <div>
            <p className="text-sm text-blue-700">
              <strong>Demo Mode:</strong> You're viewing a demonstration of Rockdrill with sample data. 
              All features are functional but no real data is saved.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Use <strong>demo@rockdrill.com</strong> / <strong>demo123</strong> to login, or register with any email.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-blue-400 hover:text-blue-600 transition-colors"
          aria-label="Dismiss demo banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default DemoBanner;
