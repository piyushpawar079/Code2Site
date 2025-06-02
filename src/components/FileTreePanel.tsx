// components/FileTreePanel.tsx
'use client';
import React, { useState } from 'react';
import { Files, Search, MoreVertical, Download, FolderDown, Archive } from 'lucide-react';
import FileTreeItem from '@/components/FileTree';

interface fileItems {
  name: string; 
  type: 'file' | 'folder';
  path: string;
  children?: fileItems[];
  content?: string;
}

interface FileTreePanelProps {
  hasGenerated: boolean;
  fileStructure: fileItems;
  selectedFile: any;
  setSelectedFile: (file: any) => void;
}

export default function FileTreePanel({
  hasGenerated,
  fileStructure,
  selectedFile,
  setSelectedFile
}: FileTreePanelProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  if (!hasGenerated) return null;

  // Function to download a single file
  const downloadFile = (file: fileItems) => {
    if (file.type === 'file' && file.content) {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Function to collect all files recursively
  const collectAllFiles = (structure: fileItems): { path: string; content: string; name: string }[] => {
    const files: { path: string; content: string; name: string }[] = [];
    
    const traverse = (item: fileItems, currentPath: string = '') => {
      const fullPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      
      if (item.type === 'file' && item.content) {
        files.push({
          path: fullPath,
          content: item.content,
          name: item.name
        });
      } else if (item.type === 'folder' && item.children) {
        item.children.forEach(child => traverse(child, fullPath));
      }
    };
    
    if (structure.type === 'folder' && structure.children) {
      structure.children.forEach(child => traverse(child));
    } else {
      traverse(structure);
    }
    
    return files;
  };

  // Function to create and download ZIP file
  const downloadAsZip = async () => {
    try {
      // Dynamic import of JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      const allFiles = collectAllFiles(fileStructure);
      
      allFiles.forEach(file => {
        zip.file(file.path, file.content);
      });
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileStructure.name || 'website'}-project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      // Fallback to individual file downloads
      downloadAllFiles();
    }
  };

  // Function to download all files individually
  const downloadAllFiles = () => {
    const allFiles = collectAllFiles(fileStructure);
    
    allFiles.forEach((file, index) => {
      setTimeout(() => {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, index * 100); // Stagger downloads to avoid browser blocking
    });
  };

  // Function to copy project structure as JSON
  const copyProjectStructure = () => {
    const projectData = JSON.stringify(fileStructure, null, 2);
    navigator.clipboard.writeText(projectData).then(() => {
      // You can add a toast notification here
      console.log('Project structure copied to clipboard');
    });
  };

  return (
    <div className="w-[20%] border-r border-slate-700/50 bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-sm relative">
      {/* Header with gradient and icons */}
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-400/30">
              <Files size={16} className="text-blue-400" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm">Explorer</h3>
          </div>
          <div className="flex items-center gap-1">
            
            {/* Export Menu Button */}
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-1.5 rounded-md hover:bg-slate-700/50 transition-colors"
              >
                <Download size={14} className="text-slate-400 hover:text-slate-300" />
              </button>
              
              {/* Export Dropdown Menu */}
              {showExportMenu && (
                <div className="absolute right-0 top-8 mt-1 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        downloadAsZip();
                        setShowExportMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Archive size={14} />
                      Download as ZIP
                    </button>
                    <button
                      onClick={() => {
                        downloadAllFiles();
                        setShowExportMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <FolderDown size={14} />
                      Download All Files
                    </button>
                    <button
                      onClick={() => {
                        copyProjectStructure();
                        setShowExportMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Files size={14} />
                      Copy Structure
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* File tree content with custom scrollbar */}
      <div className="p-2 h-[calc(100%-70px)] overflow-auto scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-slate-600/50 hover:scrollbar-thumb-slate-500/70">
        <FileTreeItem 
          file={fileStructure} 
          onSelect={setSelectedFile}
          selectedFile={selectedFile}
          onDownload={downloadFile} // Pass download function to FileTreeItem
        />
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      
      {/* Click outside to close menu */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
}