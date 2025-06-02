// components/FileTree.tsx
'use client';
import React, { useState } from 'react';
import { 
  FileText, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  FileCode,
  FileImage,
  Settings,
  Database,
  Globe,
  Palette
} from 'lucide-react';

// File type icon mapping for better visual distinction
const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode size={16} className="text-yellow-400" />;
    case 'css':
    case 'scss':
    case 'sass':
      return <Palette size={16} className="text-pink-400" />;
    case 'html':
      return <Globe size={16} className="text-orange-400" />;
    case 'json':
      return <Settings size={16} className="text-green-400" />;
    case 'md':
      return <FileText size={16} className="text-blue-400" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <FileImage size={16} className="text-purple-400" />;
    case 'sql':
      return <Database size={16} className="text-cyan-400" />;
    default:
      return <FileText size={16} className="text-slate-400" />;
  }
};

export default function FileTreeItem({ file, onSelect, selectedFile, level = 0 }) {
  const [isOpen, setIsOpen] = useState(level < 2); // Auto-expand first 2 levels
  const [isHovered, setIsHovered] = useState(false);
  
  const isFolder = file.type === 'folder';
  const isSelected = selectedFile?.path === file.path;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onSelect(file);
    }
  };

  return (
    <div className="relative">
      {/* Indentation guide lines */}
      {level > 0 && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-px bg-slate-700/30"
          style={{ left: `${level * 16 - 8}px` }}
        />
      )}
      
      <div 
        className={`
          flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-lg text-sm transition-all duration-200 ease-in-out
          ${isSelected 
            ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-300 border-l-2 border-blue-400 shadow-lg shadow-blue-500/10' 
            : isHovered 
              ? 'bg-slate-700/40 text-slate-200' 
              : 'text-slate-300 hover:text-slate-200'
          }
          ${isFolder ? 'font-medium' : 'font-normal'}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Folder/File icons with animations */}
        {isFolder ? (
          <div className="flex items-center gap-1">
            <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
              <ChevronRight size={12} className={isSelected ? 'text-blue-400' : 'text-slate-400'} />
            </div>
            <div className={`transition-all duration-200 ${isHovered ? 'scale-110' : ''}`}>
              {isOpen ? 
                <FolderOpen size={16} className="text-blue-400" /> : 
                <Folder size={16} className="text-slate-400" />
              }
            </div>
          </div>
        ) : (
          <div className={`ml-4 transition-all duration-200 ${isHovered ? 'scale-110' : ''}`}>
            {getFileIcon(file.name)}
          </div>
        )}
        
        {/* File/Folder name */}
        <span className="truncate flex-1 select-none">
          {file.name}
        </span>
        
        {/* Badge for file count in folders */}
        {isFolder && file.children && file.children.length > 0 && (
          <span className={`
            px-1.5 py-0.5 text-xs rounded-full font-medium transition-colors
            ${isSelected 
              ? 'bg-blue-400/20 text-blue-300' 
              : 'bg-slate-600/50 text-slate-400'
            }
          `}>
            {file.children.length}
          </span>
        )}
      </div>
      
      {/* Children with smooth expand/collapse animation */}
      {isFolder && file.children && (
        <div className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="space-y-0.5 mt-0.5">
            {file.children.map((child, index) => (
              <FileTreeItem 
                key={`${child.path}-${index}`}
                file={child} 
                onSelect={onSelect} 
                selectedFile={selectedFile}
                level={level + 1} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}