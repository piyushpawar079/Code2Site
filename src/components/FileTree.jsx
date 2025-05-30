'use client';
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Code, 
  Eye, 
  Play, 
  FileText, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  ArrowRight,
  Globe,
  Rocket,
  Cpu
} from 'lucide-react';


export default function FileTreeItem ({ file, onSelect, selectedFile, level = 0 }) {
  const [isOpen, setIsOpen] = useState(true);
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
    <div>
      <div 
        className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-800 text-sm ${
          isSelected ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {isFolder ? (
          <>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
          </>
        ) : (
          <FileText size={16} className="ml-4" />
        )}
        <span>{file.name}</span>
      </div>
      
      {isFolder && isOpen && file.children && (
        <div>
          {file.children.map((child, index) => (
            <FileTreeItem 
              key={index} 
              file={child} 
              onSelect={onSelect} 
              selectedFile={selectedFile}
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};