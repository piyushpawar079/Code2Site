// components/FileTreePanel.tsx
'use client';
import React from 'react';
import { Files, Search, MoreVertical } from 'lucide-react';
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
  if (!hasGenerated) return null;

  return (
    <div className="w-[20%] border-r border-slate-700/50 bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-sm">
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
            <button className="p-1.5 rounded-md hover:bg-slate-700/50 transition-colors">
              <Search size={14} className="text-slate-400 hover:text-slate-300" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-slate-700/50 transition-colors">
              <MoreVertical size={14} className="text-slate-400 hover:text-slate-300" />
            </button>
          </div>
        </div>
      </div>
      
      {/* File tree content with custom scrollbar */}
      <div className="p-2 h-[calc(100%-70px)] overflow-auto scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-slate-600/50 hover:scrollbar-thumb-slate-500/70">
        <FileTreeItem 
          file={fileStructure} 
          onSelect={setSelectedFile}
          selectedFile={selectedFile}
        />
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
    </div>
  );
}
