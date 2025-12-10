import React from 'react';
import { Settings, Zap } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="h-14 border-b border-[#2d2d2d] bg-[#1a1a1a] flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <Zap className="text-white w-5 h-5" fill="currentColor" />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-white font-mono">
          Z-IMAGE<span className="text-indigo-500">.AI</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSettings}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-full transition-colors"
          title="Backend Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};