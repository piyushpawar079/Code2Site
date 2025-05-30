// components/CodeEditorPanel.tsx
'use client';
import React, { useState } from 'react';
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

  if (!hasGenerated) return null;

  // Function to handle preview with loading state
  const handlePreviewClick = async () => {
    setIsPreviewLoading(true);
    setActiveTab('preview');
    await handlePreview();
    // Loading state will be managed by the parent component
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

  return (
    <div className="flex-1 flex flex-col">
      <EditorTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handlePreview={handlePreviewClick}
      />

      {/* Editor Content */}
      <div className="flex-1 p-4">
        {activeTab === 'code' ? (
          <MonacoEditor
            value={selectedFile?.content || '// Select a file to view its content'}
            language="typescript"
            theme="vs-dark"
          />
        ) : (
          <div className="w-full h-full bg-white rounded-lg border border-gray-700 overflow-hidden relative">
            {isPreviewLoading && !url && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-700">Starting preview server...</span>
                </div>
              </div>
            )}
            <iframe
              src={url || `data:text/html;charset=utf-8,${encodeURIComponent(generateSimplePreview())}`}
              className="w-full h-full border-none"
              title="Preview"
              onLoad={() => setIsPreviewLoading(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}