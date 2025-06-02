// components/Header.tsx
'use client';
import React from 'react';
import { Zap, Cpu } from 'lucide-react';

interface HeaderProps {
  onBackHome: () => void;
  isExecutingSteps: boolean;
}

export default function Header({ onBackHome, isExecutingSteps }: HeaderProps) {
  return (
    <div className="border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBackHome}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Zap size={24} />
          <span className="text-xl font-bold">Code2Site</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Cpu size={16} />
            <span className="text-sm">AI Builder</span>
          </div>
          {isExecutingSteps && (
            <div className="flex items-center gap-2 text-yellow-400">
              <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Executing Steps...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}