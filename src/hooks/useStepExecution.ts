// hooks/useStepExecution.ts
import { useCallback, useEffect, useState } from 'react';
import { Step } from '@/types/steps';

interface UseStepExecutionProps {
  steps: Step[];
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  setCurrentStep: (step: number) => void;
  executeFileOperation: (step: Step) => void;
}

export const useStepExecution = ({
  steps,
  setSteps,
  setCurrentStep,
  executeFileOperation
}: UseStepExecutionProps) => {
  const [isExecutingSteps, setIsExecutingSteps] = useState(false);

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

    // Execute the file operation
    executeFileOperation(step);

    // Update step status to completed
    setSteps(prev => {
      const newSteps = [...prev];
      newSteps[stepIndex].status = 'completed';
      return newSteps;
    });
  }, [setSteps, setCurrentStep, executeFileOperation]);

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

  return {
    isExecutingSteps,
    executeStep
  };
};