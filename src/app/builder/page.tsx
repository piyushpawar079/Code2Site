'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { 
  Zap, 
  Code, 
  Eye, 
  Play, 
  Cpu
} from 'lucide-react';
import MonacoEditor from '@/components/MonacoEditor';
import StepsList from '@/components/ProgressSteps';
import FileTreeItem from '@/components/FileTree';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Step, StepType } from '@/types/steps';
import { parseXml } from '@/utils/parseSteps';

export default function BuilderPage(){
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([])
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('code');
  const [isExecutingSteps, setIsExecutingSteps] = useState(false);
  const router = useRouter();

  let initialFileStructure = {
    name: 'my-app',
    type: 'folder',
    path: '/my-app',
    children: [
      {
        name: 'src',
        type: 'folder',
        path: '/my-app/src',
        children: []
      }
    ]
  };

  const [fileStructure, setFileStructure] = useState(initialFileStructure);

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
    
    return currentNode.children[currentNode.children.length - 1]; // Return the last created folder node
  }, []);

  // Execute a single step
  const executeStep = useCallback(async (step: Step, stepIndex: number) => {
    
    // Update step status to in-progress
    setSteps(prev => {
      const newSteps = [...prev];
      newSteps[stepIndex].status = 'in-progress';
      return newSteps;
    });

    setCurrentStep(stepIndex);

    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, 1000));

    setFileStructure(prevStructure => {
      const newStructure = JSON.parse(JSON.stringify(prevStructure)); // Deep clone
      
      try {
        switch (step.type) {
          case StepType.CreateFile: {
            if (!step.path) break;
            
            const path = step.path;
            if(path.includes('/')) {
              const folderName = path.split('/')[0];
              const fileName = path.split('/')[1];
              const folderNode = findNodeByPath(newStructure, `/${folderName}`);
              if (folderNode) {
                // folderNode.children.push({ 
                //   name: fileName, 
                //   type: 'file', 
                //   path: `/my-app/${path}`, 
                //   content: step.code || '' 
                // });
                
              }
              else{
                // If folder doesn't exist, create it
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
            createNestedFolders(newStructure, pathParts.slice(1), '/my-app'); // Skip root 'my-app'
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
            // For scripts, we might want to show output or logs
            // This could be extended to actually execute certain types of scripts
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

    // Update step status to completed
    setSteps(prev => {
      const newSteps = [...prev];
      newSteps[stepIndex].status = 'completed';
      return newSteps;
    });
    
  }, [findNodeByPath, findParentAndIndex, createNestedFolders]);

  // Execute all pending steps
  useEffect(() => {
    const executePendingSteps = async () => {
      if (isExecutingSteps || steps.length === 0) return;
      
      const pendingSteps = steps.filter(step => step.status === 'pending');
      if (pendingSteps.length === 0) return;

      
      setIsExecutingSteps(true);
      
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.status === 'pending') {
          await executeStep(step, i);
        }
      }
      
      setIsExecutingSteps(false);
    };

    executePendingSteps();
  }, [steps, executeStep, isExecutingSteps]);

  const onBackHome = () => {
    setUserPrompt('');
    setIsGenerating(false);
    setHasGenerated(false);
    setCurrentStep(0);
    setSteps([]);
    setSelectedFile(null);
    setActiveTab('code');
    setIsExecutingSteps(false);
    setFileStructure(initialFileStructure);
    router.push('/');
  };

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;
    
    setIsGenerating(true);    
    setCurrentStep(0);

    try {
      const response = await axios.post('/api/template', { userPrompt: userPrompt });
      const { uiPrompt, prompt1 } = response.data;
      const prompt2 = response.data?.promtp2;
      

      const parsedSteps = parseXml(uiPrompt[0]).map(step => ({
          ...step,
          status: "pending" as const
      }));
      
      setSteps(parsedSteps);
      setCurrentStep(0);

      const messages = [
          {
            role: "user",
            parts: [
              {
                text: prompt1
              },
              {
                text: userPrompt
              }
            ]
          }
        ]

        if(prompt2){
          messages[0].parts.push({
            text: prompt2
          })
        }
      
      const nextSteps = await axios.post('/api/chat', {
        messages
      });

      const nextStepsText = nextSteps.data.text;
      console.log("NextSteps are: ", nextStepsText)
      const nextStepsParsed = parseXml(nextStepsText).map(step => ({
        ...step,
        status: "pending" as const
      }));
      setSteps(prevSteps => [...prevSteps, ...nextStepsParsed]);
      console.log('Generated steps:', nextStepsParsed);

      setHasGenerated(true);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating steps:', error);
      setIsGenerating(false);
    }
  };

  const previewContent = `
    <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: white; color: black; height: 100%;">
      <h1 style="text-align: center; color: #333;">Hello World!</h1>
      <p style="text-align: center; color: #666;">Your generated website preview will appear here</p>
    </div>
  `;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBackHome}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Zap size={24} />
            <span className="text-xl font-bold">Bolt Clone</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Cpu size={16} />
              <span className="text-sm">AI Builder</span>
            </div>
            {isExecutingSteps && (
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Executing Steps...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Prompt Input */}
        <div className={`${hasGenerated ? 'w-[30%]' : 'w-full'} border-r border-gray-800 p-6 transition-all duration-500`}>
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Describe your website</h2>
              <p className="text-gray-400">Tell our AI what kind of website you want to build</p>
            </div>
            
            <div className="">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="E.g., Create a modern landing page for a tech startup with a hero section, features, and contact form..."
                className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                disabled={isGenerating || isExecutingSteps}
                rows={6}
              />
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating || isExecutingSteps || !userPrompt.trim()}
                className="mt-4 w-30 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Generate Website
                  </>
                )}
              </button>
            </div>

            {/* Progress Steps */}
            {hasGenerated && (
              <div className="mt-6">
                <StepsList steps={steps} currentStep={currentStep} />
              </div>
            )}
          </div>
        </div>

        {/* File Tree - Only show when generated */}
        {hasGenerated && (
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
        )}

        {/* Right Panel - Monaco Editor */}
        {hasGenerated && (
          <div className="flex-1 flex flex-col">
            {/* Tab Bar */}
            <div className="border-b border-gray-800 flex">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'code' ? 'bg-gray-800 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Code size={16} />
                Code
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'preview' ? 'bg-gray-800 text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye size={16} />
                Preview
              </button>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-4">
              {activeTab === 'code' ? (
                <MonacoEditor
                  value={selectedFile?.content || '// Select a file to view its content'}
                  language="typescript"
                  theme="vs-dark"
                />
              ) : (
                <div className="w-full h-full bg-white rounded-lg border border-gray-700 overflow-hidden">
                  <iframe
                    srcDoc={previewContent}
                    className="w-full h-full border-none"
                    title="Preview"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};