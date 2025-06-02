// Here we will decide the type of the project user needs and return inital template for the same. 

import { nodeBasePrompt } from '@/utils/nodePrompt';
import { reactBasePrompt } from '@/utils/reactPrompt';
import { GoogleGenAI } from '@google/genai';
import { nextBasePrompt } from '@/utils/nextPrompt';
import { basePrompt } from '@/utils/basePrompt';

export async function POST(request: Request) {
    try {
        
        let { userPrompt } = await request.json();

        if (!userPrompt) {
            return Response.json(
                { error: 'User prompt is required' },
                { status: 400 }
            );
        }

        userPrompt = userPrompt + "\n\n Based on the above prompt, please tell me which type of project I should create. If it is a React project, return 'react', if it is a Node.js project, return 'node' or if it is a Nextjs project, return 'next'. Do not return any other type of project. Do not return any other text. Just return 'react' or 'node'.";

        // Here we can add logic to determine the type of project based on userPrompt
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: userPrompt,
        });
        
        const projectType = response.text?.trim().toLowerCase();

        if( projectType == 'react' ) {
            return Response.json({
                uiPrompt: [reactBasePrompt],
                prompt1: reactBasePrompt,
                prompt2: basePrompt
            });
        }
        else if( projectType == 'node' ) {
            return Response.json({
                uiPrompt: [nodeBasePrompt],
                prompt1: nodeBasePrompt
            });
        }
        else if( projectType == 'next' ) {
            return Response.json({
                uiPrompt: [nextBasePrompt],
                prompt1: nextBasePrompt,
                prompt2: basePrompt
            });
        }
        else {
            return Response.json(
                { error: 'Invalid project type. Please specify either "react" or "node".' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error generating template:', error);
        return Response.json(
        { error: 'Failed to generate template' },
        { status: 500 }
        );
    }
}