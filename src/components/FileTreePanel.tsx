// components/FileTreePanel.tsx
'use client';
import React from 'react';
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
    <div className="w-[20%] border-r border-gray-800 bg-gray-900/50">
      <div className="p-4 border-b border-gray-800">
        <h3 className="font-semibold text-white">Files</h3>
      </div>
      <div className="p-2 h-[calc(100%-60px)] overflow-auto">
        <FileTreeItem 
          file={fileStructure} 
          onSelect={setSelectedFile}
          selectedFile={selectedFile}
        />
      </div>
    </div>
  );
}