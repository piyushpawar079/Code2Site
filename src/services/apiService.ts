// services/apiService.ts
import axios from 'axios';
import { parseXml } from '@/utils/parseSteps';

let generatedWebsite = '';

export const generateWebsiteSteps = async (userPrompt: string) => {
  try {
    const response = await axios.post('/api/template', { userPrompt });
    const { uiPrompt, prompt1, promtp2: prompt2 } = response.data;
    
    const parsedSteps = parseXml(uiPrompt[0]).map(step => ({
      ...step,
      status: "pending" as const
    }));
    
    const messages = [
      {
        role: "user",
        parts: [
          { text: prompt1 },
          { text: userPrompt }
        ]
      }
    ];

    if (prompt2) {
      messages[0].parts.push({ text: prompt2 });
    }
    
    const nextSteps = await axios.post('/api/chat', { messages });
    const nextStepsText = nextSteps.data.text;
    
    generatedWebsite = nextStepsText;
    
    const nextStepsParsed = parseXml(nextStepsText).map(step => ({
      ...step,
      status: "pending" as const
    }));

    return {
      initialSteps: parsedSteps,
      additionalSteps: nextStepsParsed
    };
  } catch (error) {
    console.error('Error generating steps:', error);
    throw error;
  }
};


export const addNewFeatures = async (userPrompt: string) => {
  try {    
    
    const messages = [
      {
        role: "user",
        parts: [
          { text: generatedWebsite },
          { text: userPrompt }
        ]
      }
    ];

    
    const nextSteps = await axios.post('/api/chat', { messages });
    const nextStepsText = nextSteps.data.text;

    generatedWebsite = nextStepsText;
    
    const nextStepsParsed = parseXml(nextStepsText).map(step => ({
      ...step,
      status: "pending" as const
    }));

    return {
      newSteps: nextStepsParsed
    };
  } catch (error) {
    console.error('Error generating steps:', error);
    throw error;
  }
};

