// components/PromptInputPanel.tsx
'use client';
import React from 'react';
import { Play, Sparkles } from 'lucide-react';
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
    <div className={`${hasGenerated ? 'w-[30%]' : 'w-full'} border-r border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-800/30 transition-all duration-500 flex flex-col`}>
      {/* Progress Steps - Move to top when generated */}
      {hasGenerated && (
        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full">
            <StepsList steps={steps} currentStep={currentStep} />
          </div>
        </div>
      )}

      <div className={`${hasGenerated ? 'border-t border-gray-700' : 'flex-1 justify-center items-center flex'} p-6`}>
        <div className={`${hasGenerated ? '' : 'max-w-2xl mx-auto text-center'} w-full`}>
          {/* Header */}
          <div className={`mb-6 ${hasGenerated ? '' : 'text-center'}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className={`${hasGenerated ? 'text-lg' : 'text-3xl'} font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent transition-all duration-500`}>
                {hasGenerated ? 'New Request' : 'AI Website Builder'}
              </h2>
            </div>
            <p className={`text-gray-400 ${hasGenerated ? 'text-sm' : 'text-lg'} transition-all duration-500`}>
              {hasGenerated ? 'Describe another website to build' : 'Transform your ideas into stunning websites with AI'}
            </p>
          </div>
          
          {/* Input Area */}
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="E.g., Create a modern landing page for a tech startup with a hero section, features, and contact form..."
                className={`w-full p-4 bg-gray-900/80 backdrop-blur-sm border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none ${hasGenerated ? 'h-20' : 'h-32'}`}
                disabled={isGenerating || isExecutingSteps}
                rows={hasGenerated ? 3 : 6}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 pointer-events-none opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || isExecutingSteps || !userPrompt.trim()}
              className={`${hasGenerated ? 'w-full' : 'w-60 mx-auto'} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100 group`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Magic...</span>
                </>
              ) : (
                <>
                  <Play size={20} className="group-hover:animate-pulse" />
                  <span>{hasGenerated ? 'Generate New Website' : 'Generate Website'}</span>
                </>
              )}
            </button>
          </div>

          {/* Feature hints for first time users */}
          {!hasGenerated && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-200 mb-2">AI-Powered</h3>
                <p className="text-sm text-gray-400">Advanced AI understands your vision and builds accordingly</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-200 mb-2">Live Preview</h3>
                <p className="text-sm text-gray-400">See your website come to life with real-time preview</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-200 mb-2">Full Control</h3>
                <p className="text-sm text-gray-400">Edit code and customize every aspect of your site</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}