// components/PromptInputPanel.tsx
'use client';
import React from 'react';
import { Play } from 'lucide-react';
import StepsList from '@/components/ProgressSteps';
import { Step } from '@/types/steps';

interface PromptInputPanelProps {
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
  isExecutingSteps: boolean;
  hasGenerated: boolean;
  steps: Step[];
  currentStep: number;
}

export default function PromptInputPanel({
  userPrompt,
  setUserPrompt,
  handleGenerate,
  isGenerating,
  isExecutingSteps,
  hasGenerated,
  steps,
  currentStep
}: PromptInputPanelProps) {
  return (
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
  );
}