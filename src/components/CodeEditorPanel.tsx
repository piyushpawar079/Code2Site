// components/CodeEditorPanel.tsx
'use client';
import React, { useState, useEffect } from 'react';
import MonacoEditor from '@/components/MonacoEditor';
import EditorTabs from './EditorTabs';

interface fileItems {
  name: string; 
  type: 'file' | 'folder';
  path: string;
  children?: fileItems[];
  content?: string;
}

interface CodeEditorPanelProps {
  hasGenerated: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handlePreview: () => void;
  selectedFile: any;
  url: string;
  fileStructure: fileItems;
}

interface PreviewProgress {
  stage: 'mounting' | 'installing' | 'starting' | 'ready' | 'error';
  message: string;
  progress: number;
  estimatedTime?: number;
}

export default function CodeEditorPanel({
  hasGenerated,
  activeTab,
  setActiveTab,
  handlePreview,
  selectedFile,
  url,
  fileStructure
}: CodeEditorPanelProps) {
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewProgress, setPreviewProgress] = useState<PreviewProgress>({
    stage: 'ready',
    message: '',
    progress: 0
  });
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPreviewLoading && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPreviewLoading, startTime]);

  // Reset progress when preview completes
  useEffect(() => {
    if (url && isPreviewLoading) {
      setPreviewProgress({
        stage: 'ready',
        message: 'Preview ready!',
        progress: 100
      });
      setTimeout(() => {
        setIsPreviewLoading(false);
        setElapsedTime(0);
      }, 1000);
    }
  }, [url, isPreviewLoading]);

  if (!hasGenerated) return null;

  // Function to simulate preview progress stages
  const simulatePreviewProgress = async () => {
    const stages = [
      {
        stage: 'mounting' as const,
        message: 'Mounting files to container...',
        duration: 2000,
        progress: 25,
        estimatedTime: 15
      },
      {
        stage: 'installing' as const,
        message: 'Installing dependencies...',
        duration: 8000,
        progress: 60,
        estimatedTime: 10
      },
      {
        stage: 'starting' as const,
        message: 'Starting development server...',
        duration: 3000,
        progress: 85,
        estimatedTime: 5
      }
    ];

    for (const stage of stages) {
      setPreviewProgress({
        stage: stage.stage,
        message: stage.message,
        progress: stage.progress,
        estimatedTime: stage.estimatedTime
      });
      
      // Wait for the stage duration
      await new Promise(resolve => setTimeout(resolve, stage.duration));
    }
  };

  // Function to handle preview with enhanced feedback
  const handlePreviewClick = async () => {
    setIsPreviewLoading(true);
    setStartTime(Date.now());
    setElapsedTime(0);
    setActiveTab('preview');
    
    // Start progress simulation
    simulatePreviewProgress();
    
    try {
      await handlePreview();
    } catch (error) {
      setPreviewProgress({
        stage: 'error',
        message: 'Failed to start preview server',
        progress: 0
      });
      setTimeout(() => {
        setIsPreviewLoading(false);
        setElapsedTime(0);
      }, 3000);
    }
  };

  // Format time in seconds
  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(1);
  };

  // Generate a simple HTML preview if no URL is available
  const generateSimplePreview = () => {
    // Look for HTML files in the file structure
    const findHtmlContent = (structure: fileItems): string => {
      if (structure.type === 'file' && 
          (structure.name.endsWith('.html') || structure.name === 'index.html')) {
        return structure.content || '';
      }
      if (structure.children) {
        for (const child of structure.children) {
          const content = findHtmlContent(child);
          if (content) return content;
        }
      }
      return '';
    };

    const htmlContent = findHtmlContent(fileStructure);
    
    if (htmlContent) {
      return htmlContent;
    }

    // Default preview if no HTML found
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Website</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .status {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #2196f3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Website Generated!</h1>
          <p>Your AI-generated website is ready. The preview will show here once the development server starts.</p>
          <div class="status">
            <strong>Status:</strong> Setting up development environment...
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Render progress overlay
  const renderProgressOverlay = () => {
    if (!isPreviewLoading) return null;

    const getStageIcon = (stage: string) => {
      switch (stage) {
        case 'mounting':
          return '📁';
        case 'installing':
          return '📦';
        case 'starting':
          return '🚀';
        case 'ready':
          return '✅';
        case 'error':
          return '❌';
        default:
          return '⏳';
      }
    };

    const getProgressColor = () => {
      if (previewProgress.stage === 'error') return 'bg-red-500';
      if (previewProgress.stage === 'ready') return 'bg-green-500';
      return 'bg-blue-500';
    };

    return (
      <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">
              {getStageIcon(previewProgress.stage)}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Setting up Preview
            </h3>
            <p className="text-gray-600 text-sm">
              {previewProgress.message}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{previewProgress.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full ${getProgressColor()} transition-all duration-500 ease-out`}
                style={{ width: `${previewProgress.progress}%` }}
              />
            </div>
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500 mb-1">Elapsed Time</div>
              <div className="font-semibold text-gray-800">
                {formatTime(elapsedTime)}s
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-500 mb-1">Est. Remaining</div>
              <div className="font-semibold text-gray-800">
                {previewProgress.estimatedTime ? `${previewProgress.estimatedTime}s` : '--'}
              </div>
            </div>
          </div>

          {/* Stage Indicators */}
          <div className="mt-6">
            <div className="flex justify-between items-center text-xs">
              {['mounting', 'installing', 'starting', 'ready'].map((stage, index) => {
                const isActive = previewProgress.stage === stage;
                const isCompleted = ['mounting', 'installing', 'starting', 'ready'].indexOf(previewProgress.stage) > index;
                
                return (
                  <div key={stage} className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mb-1 transition-colors ${
                      isCompleted ? 'bg-green-500' : 
                      isActive ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <span className={`capitalize ${
                      isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}>
                      {stage === 'mounting' ? 'Mount' :
                       stage === 'installing' ? 'Install' :
                       stage === 'starting' ? 'Start' : 'Ready'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error state */}
          {previewProgress.stage === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm text-center">
                Preview failed to load. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <EditorTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handlePreview={handlePreviewClick}
        isPreviewLoading={isPreviewLoading}
      />

      {/* Editor Content */}
      <div className="flex-1 p-4 relative">
        {activeTab === 'code' ? (
          <MonacoEditor
            file={selectedFile || '// Select a file to view its content'}
          />
        ) : (
          <div className="w-full h-full bg-white rounded-lg border border-gray-700 overflow-hidden relative">
            {/* Progress Overlay */}
            {renderProgressOverlay()}
            
            {/* Simple loading indicator for immediate feedback */}
            {isPreviewLoading && !url && !renderProgressOverlay() && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-700">Initializing preview...</span>
                </div>
              </div>
            )}
            
            <iframe
              src={url || `data:text/html;charset=utf-8,${encodeURIComponent(generateSimplePreview())}`}
              className="w-full h-full border-none"
              title="Preview"
              onLoad={() => {
                if (url) {
                  setIsPreviewLoading(false);
                  setElapsedTime(0);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}