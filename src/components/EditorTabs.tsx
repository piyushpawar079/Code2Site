// components/EditorTabs.tsx
'use client';
import React from 'react';

interface EditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handlePreview: () => void;
  isPreviewLoading?: boolean;
}

export default function EditorTabs({ 
  activeTab, 
  setActiveTab, 
  handlePreview,
  isPreviewLoading = false 
}: EditorTabsProps) {
  const tabs = [
    { id: 'code', label: 'Code', icon: '💻' },
    { id: 'preview', label: 'Preview', icon: '👁️' }
  ];

  return (
    <div className="flex items-center justify-between bg-gray-900 border-b border-gray-700 px-4 py-2">
      {/* Tab Navigation */}
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'preview') {
                handlePreview();
              } else {
                setActiveTab(tab.id);
              }
            }}
            disabled={isPreviewLoading && tab.id === 'preview'}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }
              ${isPreviewLoading && tab.id === 'preview' 
                ? 'opacity-75 cursor-not-allowed' 
                : 'cursor-pointer'
              }
            `}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
            
            {/* Loading indicator for preview tab */}
            {isPreviewLoading && tab.id === 'preview' && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-1"></div>
            )}
          </button>
        ))}
      </div>

      {/* Preview Status Indicator */}
      {isPreviewLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Setting up preview...</span>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        {activeTab === 'code' && (
          <button
            onClick={handlePreview}
            disabled={isPreviewLoading}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200
              ${isPreviewLoading
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'
              }
            `}
          >
            {isPreviewLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                <span>▶️</span>
                Preview
              </>
            )}
          </button>
        )}
        
        {activeTab === 'preview' && !isPreviewLoading && (
          <button
            onClick={() => setActiveTab('code')}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-md text-sm transition-all duration-200"
          >
            <span>📝</span>
            Back to Code
          </button>
        )}
      </div>
    </div>
  );
}