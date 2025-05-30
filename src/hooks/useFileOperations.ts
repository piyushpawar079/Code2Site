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

  const findNodeByPath = useCallback((structure: any, targetPath: string) => {
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

    if(!targetPath.startsWith('/')) {
      const pathParts = targetPath.split('/')[0]
      if (pathParts.length > 0) {
        const parentFolder = createNestedFolders(structure, pathParts, '/my-app');
        return parentFolder
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

  const createNestedFolders = useCallback((structure: any, pathParts: string, basePath: string) => {
    let currentNode = structure;
    let currentPath = basePath;

    currentPath = currentPath === '/' ? `/${pathParts}` : `${currentPath}/${pathParts}`;
    currentNode.children.push({
      name: pathParts,
      type: 'folder',
      path: currentPath,
      children: []
    })
    
    return currentNode.children[currentNode.children.length - 1];
  }, []);

  const executeFileOperation = useCallback((step: Step) => {
    setFileStructure(prevStructure => {
      const newStructure = JSON.parse(JSON.stringify(prevStructure));
      
      try {
        switch (step.type) {
          case StepType.CreateFile: {
            if (!step.path) break;
            
            let flag = false
            const path = step.path;
            if(path.includes('/')) {
              const components = path.split('/')
              const folderName = components[0];
              const fileName = components[1];
              const folderNode = findNodeByPath(newStructure, `/${folderName}`);
              if (folderNode) {
                folderNode.children.map((ch) => {
                  if(ch.name == fileName){
                    flag = true
                    ch.content = step.code
                  }
                })

                if(!flag){
                  folderNode.children.push({ 
                    name: fileName, 
                    type: 'file', 
                    path: `/my-app/${path}`, 
                    content: step.code || '' 
                  });
                }
              }
              else{
                const newFolder = createNestedFolders(newStructure, folderName, '/my-app');
                newFolder.children.push({ 
                  name: fileName, 
                  type: 'file',
                  path: `/my-app/${path}`, 
                  content: step.code || '' 
                });
              }
            }
            else {
              let flag = false
              newStructure.children.map((ch) => {
                if(ch.name == path){
                  flag = true
                  ch.content = step.code
                }
              })

              if(flag) break;
              newStructure.children.push({ 
                name: path, 
                type: 'file',
                path: `/my-app/${path}`,
                content: step.code || ''
              });
            }
            break;
          }
          
          case StepType.CreateFolder: {
            if (!step.path) break;
            
            const pathParts = step.path.split('/').filter(part => part !== '');
            createNestedFolders(newStructure, pathParts.slice(1), '/my-app');
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
  }, [findNodeByPath, findParentAndIndex, createNestedFolders]);

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