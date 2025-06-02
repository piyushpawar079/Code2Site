// pages/BuilderPage.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import userWebContainer from '@/hooks/useWebContainer';

// Components
import Header from '@/components/Header';
import PromptInputPanel from '@/components/PromptInputPanel';
import FileTreePanel from '@/components/FileTreePanel';
import CodeEditorPanel from '@/components/CodeEditorPanel';

// Hooks
import { useFileOperations } from '@/hooks/useFileOperations';
import { useStepExecution } from '@/hooks/useStepExecution';

// Services and Utils
import { addNewFeatures, generateWebsiteSteps } from '@/services/apiService';
import { setupWebContainer } from '@/utils/webContainerUtils';
import { Step } from '@/types/steps';

// Types
interface fileItems {
  name: string; 
  type: 'file' | 'folder';
  path: string;
  children?: fileItems[];
  content?: string;
}

const initialFileStructure: fileItems = {
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

export default function BuilderPage() {
  // State
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('code');
  const [url, setUrl] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [webContainerReady, setWebContainerReady] = useState(false);

  // Hooks
  const router = useRouter();
  const webContainer = userWebContainer();
  const { fileStructure, executeFileOperation, resetFileStructure } = useFileOperations(initialFileStructure);
  const { isExecutingSteps } = useStepExecution({
    steps,
    setSteps,
    setCurrentStep,
    executeFileOperation
  });

  // WebContainer initialization
  useEffect(() => {
    if (webContainer && !webContainerReady) {
      setWebContainerReady(true);
    }
  }, [webContainer, webContainerReady]);

  // Auto-mount files when file structure changes (but don't start server)
  useEffect(() => {
    if (!webContainer || !webContainerReady) return;
    
    // Only mount files, don't start the server automatically
    const mountFiles = async () => {
      try {
        const { convertToWebContainerMount } = await import('@/utils/webContainerUtils');
        const mountStructure = convertToWebContainerMount(fileStructure);
        await webContainer.mount(mountStructure as any);
      } catch (error) {
        console.error('Error auto-mounting files:', error);
      }
    };

    // Only mount if we have generated content
    if (hasGenerated) {
      mountFiles();
    }
  }, [fileStructure, webContainer, webContainerReady, hasGenerated]);

  // Handlers
  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;
    
    setIsGenerating(true);    
    setCurrentStep(0);

    try {
      const { initialSteps, additionalSteps } = await generateWebsiteSteps(userPrompt);
      
      setSteps(initialSteps);
      setCurrentStep(0);
      
      // Add additional steps
      setSteps(prevSteps => [...prevSteps, ...additionalSteps]);

      setUserPrompt('');
      setHasGenerated(true);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating steps:', error);
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    if (!webContainer || !webContainerReady) {
      console.error('WebContainer not ready');
      return;
    }

    try {
      setIsPreviewLoading(true);
      
      await setupWebContainer(
        webContainer, 
        fileStructure, 
        setUrl, 
        setIsPreviewLoading
      );
    } catch (error) {
      console.error('Error setting up preview:', error);
      setIsPreviewLoading(false);
    }
  };

  const handleNewRequest = async (newPrompt: string) => {
    if (!newPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const { newSteps } = await addNewFeatures(newPrompt);
      
      // Append new steps to existing ones
      setSteps([...newSteps]);
      
      setCurrentStep(0);

      setUserPrompt('');
      setHasGenerated(true);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error adding new features:', error);
      setIsGenerating(false);
    }
  }

  const onBackHome = () => {
    // Clean up WebContainer
    if (webContainer) {
      try {
        // Kill any running processes
        webContainer.teardown?.();
      } catch (error) {
        console.error('Error cleaning up WebContainer:', error);
      }
    }

    // Reset all state
    setUserPrompt('');
    setIsGenerating(false);
    setHasGenerated(false);
    setCurrentStep(0);
    setSteps([]);
    setSelectedFile(null);
    setActiveTab('code');
    setUrl('');
    setIsPreviewLoading(false);
    setWebContainerReady(false);
    resetFileStructure();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onBackHome={onBackHome} isExecutingSteps={isExecutingSteps} />

      <div className="flex h-[calc(100vh-73px)]">
        <PromptInputPanel
          userPrompt={userPrompt}
          setUserPrompt={setUserPrompt}
          handleGenerate={handleGenerate}
          addNewFeatures={handleNewRequest}
          isGenerating={isGenerating}
          isExecutingSteps={isExecutingSteps}
          hasGenerated={hasGenerated}
          steps={steps}
          currentStep={currentStep}
        />

        <FileTreePanel
          hasGenerated={hasGenerated}
          fileStructure={fileStructure}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />

        <CodeEditorPanel
          hasGenerated={hasGenerated}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handlePreview={handlePreview}
          selectedFile={selectedFile}
          url={url}
          fileStructure={fileStructure}
        />
      </div>
    </div>
  );
}