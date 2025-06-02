// components/FileTree.tsx
'use client';
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Download } from 'lucide-react';

interface fileItems {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: fileItems[];
  content?: string;
}

interface FileTreeItemProps {
  file: fileItems;
  onSelect: (file: fileItems) => void;
  selectedFile?: fileItems;
  level?: number;
  onDownload?: (file: fileItems) => void;
}

export default function FileTreeItem({ 
  file, 
  onSelect, 
  selectedFile, 
  level = 0,
  onDownload 
}: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selectedFile?.path === file.path;
  const hasChildren = file.children && file.children.length > 0;

  const handleClick = () => {
    if (file.type === 'folder') {
      setIsExpanded(!isExpanded);
    }
    onSelect(file);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(file);
    }
  };

  const getFileIcon = () => {
    if (file.type === 'folder') {
      return <Folder size={16} className="text-blue-400" />;
    }
    
    // Different icons based on file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
        return <File size={16} className="text-orange-400" />;
      case 'css':
        return <File size={16} className="text-blue-500" />;
      case 'js':
      case 'jsx':
        return <File size={16} className="text-yellow-400" />;
      case 'ts':
      case 'tsx':
        return <File size={16} className="text-blue-600" />;
      case 'json':
        return <File size={16} className="text-green-400" />;
      case 'md':
        return <File size={16} className="text-gray-400" />;
      default:
        return <File size={16} className="text-slate-400" />;
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all duration-200 group
          ${isSelected 
            ? 'bg-blue-500/20 border border-blue-400/30 text-blue-100' 
            : 'hover:bg-slate-700/30 text-slate-300 hover:text-slate-100'
          }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Expand/Collapse Icon */}
        {file.type === 'folder' && (
          <button className="flex-shrink-0 p-0.5 hover:bg-slate-600/50 rounded transition-colors">
            {isExpanded ? (
              <ChevronDown size={14} className="text-slate-400" />
            ) : (
              <ChevronRight size={14} className="text-slate-400" />
            )}
          </button>
        )}
        
        {/* File/Folder Icon */}
        <div className="flex-shrink-0">
          {getFileIcon()}
        </div>
        
        {/* File/Folder Name */}
        <span className="flex-1 text-sm font-medium truncate">
          {file.name}
        </span>
        
        {/* Download Button (appears on hover for files) */}
        {/* {file.type === 'file' && onDownload && isHovered && (
          <button
            onClick={handleDownload}
            className="flex-shrink-0 p-1 hover:bg-slate-600/50 rounded transition-colors opacity-0 group-hover:opacity-100"
            title="Download file"
          >
            <Download size={12} className="text-slate-400 hover:text-slate-200" />
          </button>
        )} */}
      </div>
      
      {/* Children (for folders) */}
      {file.type === 'folder' && hasChildren && isExpanded && (
        <div className="ml-2">
          {file.children!.map((child, index) => (
            <FileTreeItem
              key={child.path || `${child.name}-${index}`}
              file={child}
              onSelect={onSelect}
              selectedFile={selectedFile}
              level={level + 1}
              onDownload={onDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}