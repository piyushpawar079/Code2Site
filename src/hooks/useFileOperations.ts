// hooks/useFileOperations.ts
import { useCallback, useState } from 'react';
import { Step, StepType } from '@/types/steps';

interface fileItems {
  name: string; 
  type: 'file' | 'folder';
  path: string;
  children?: fileItems[];
  content?: string;
}

export const useFileOperations = (initialFileStructure: fileItems) => {
  const [fileStructure, setFileStructure] = useState<fileItems>(initialFileStructure);

  const findNodeByPath = useCallback((structure: any, targetPath: string): any | null => {
    if (structure.path === targetPath) {
      return structure;
    }
    if (structure.children) {
      if(structure.name === targetPath.replace(/^\//, '')) {
        return structure;
      }
      for (const child of structure.children) {
        const found = findNodeByPath(child, targetPath);
        if (found) return found;
      }
    }
    
    return null;
  }, []);

  const findParentAndIndex = useCallback((structure: any, targetPath: string): { parent: any; index: number } | null => {
    if (structure.children) {
      const childIndex = structure.children.findIndex((child: any) => child.path === targetPath);
      if (childIndex !== -1) {
        return { parent: structure, index: childIndex };
      }
      
      for (const child of structure.children) {
        const result = findParentAndIndex(child, targetPath);
        if (result) return result;
      }
    }
    
    return null;
  }, []);

  const ensureDirectoryExists = useCallback((structure: any, dirPath: string, basePath: string = '/my-app') => {
    const pathParts = dirPath.split('/').filter(part => part !== '');
    let currentNode = structure;
    let currentPath = basePath;

    for (const part of pathParts) {
      currentPath = currentPath === '/' ? `/${part}` : `${currentPath}/${part}`;
      
      // Check if directory already exists
      let existingNode = null;
      if (currentNode.children) {
        existingNode = currentNode.children.find((child: any) => 
          child.name === part && child.type === 'folder'
        );
      }

      if (!existingNode) {
        // Create the directory if it doesn't exist
        if (!currentNode.children) {
          currentNode.children = [];
        }
        
        const newFolder = {
          name: part,
          type: 'folder' as const,
          path: currentPath,
          children: []
        };
        
        currentNode.children.push(newFolder);
        currentNode = newFolder;
      } else {
        currentNode = existingNode;
      }
    }
    
    return currentNode;
  }, []);

  const executeFileOperation = useCallback((step: Step) => {
    setFileStructure(prevStructure => {
      const newStructure = JSON.parse(JSON.stringify(prevStructure));
      
      try {
        switch (step.type) {
          case StepType.CreateFile: {
            if (!step.path) break;
            
            const path = step.path;
            const pathParts = path.split('/').filter(part => part !== '');
            
            if (pathParts.length === 0) break;
            
            const fileName = pathParts[pathParts.length - 1];
            const dirPath = pathParts.slice(0, -1).join('/');
            
            let targetNode = newStructure;
            
            // If there are directories in the path, ensure they exist
            if (dirPath) {
              targetNode = ensureDirectoryExists(newStructure, dirPath);
            }
            
            // Check if file already exists and update it
            let fileExists = false;
            if (targetNode.children) {
              for (const child of targetNode.children) {
                if (child.name === fileName && child.type === 'file') {
                  child.content = step.code || '';
                  fileExists = true;
                  break;
                }
              }
            }
            
            // Create new file if it doesn't exist
            if (!fileExists) {
              if (!targetNode.children) {
                targetNode.children = [];
              }
              
              const fullPath = dirPath ? `/my-app/${dirPath}/${fileName}` : `/my-app/${fileName}`;
              
              targetNode.children.push({
                name: fileName,
                type: 'file',
                path: fullPath,
                content: step.code || ''
              });
            }
            break;
          }
          
          case StepType.CreateFolder: {
            if (!step.path) break;
            
            const pathParts = step.path.split('/').filter(part => part !== '');
            if (pathParts.length > 0) {
              // Remove the first part if it's 'my-app' to avoid duplication
              const folderPath = pathParts[0] === 'my-app' ? pathParts.slice(1).join('/') : pathParts.join('/');
              if (folderPath) {
                ensureDirectoryExists(newStructure, folderPath);
              }
            }
            break;
          }
          
          case StepType.EditFile: {
            if (!step.path) break;
            
            const fileNode = findNodeByPath(newStructure, step.path);
            if (fileNode && fileNode.type === 'file') {
              fileNode.content = step.code || '';
            }
            break;
          }
          
          case StepType.DeleteFile: {
            if (!step.path) break;
            
            const result = findParentAndIndex(newStructure, step.path);
            if (result) {
              result.parent.children.splice(result.index, 1);
            }
            break;
          }
          
          case StepType.RunScript: {
            break;
          }
          
          default:
            console.warn('Unknown step type:', step.type);
        }
      } catch (error) {
        console.error('Error executing step:', error);
      }
      
      return newStructure;
    });
  }, [findNodeByPath, findParentAndIndex, ensureDirectoryExists]);

  const resetFileStructure = useCallback(() => {
    setFileStructure(initialFileStructure);
  }, [initialFileStructure]);

  return {
    fileStructure,
    setFileStructure,
    executeFileOperation,
    resetFileStructure
  };
};