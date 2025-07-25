import React from 'react';
import { Zap } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
        <Zap className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-bold text-gray-900">Rockdrill</span>
    </div>
  );
};