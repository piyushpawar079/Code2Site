// components/EditorTabs.tsx
'use client';
import React from 'react';
import { Code, Eye } from 'lucide-react';

interface EditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handlePreview: () => void;
}

export default function EditorTabs({ activeTab, setActiveTab, handlePreview }: EditorTabsProps) {
  return (
    <div className="border-b border-gray-800 flex">
      <button
        onClick={() => setActiveTab('code')}
        className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
          activeTab === 'code' ? 'bg-gray-800 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Code size={16} />
        Code
      </button>
      <button
        onClick={() => handlePreview()}
        className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
          activeTab === 'preview' ? 'bg-gray-800 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Eye size={16} />
        Preview
      </button>
    </div>
  );
}