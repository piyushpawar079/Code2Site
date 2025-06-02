import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt } from "@/utils/prompt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {

    try {

        let { messages } = await request.json();
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Messages array is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // messages.push({"role": "system", "content": getSystemPrompt()});

        const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});
        // const response = await ai.models.generateContentStream({
        //     model: "gemini-2.0-flash",
        //     contents: messages,
        //     config: {
        //         systemInstruction: getSystemPrompt(),
        //         temperature: 0.1,
        //     },
        // });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: messages,
            config:{
                systemInstruction: getSystemPrompt(),
                temperature: 0.3
            }
        })

        // for await (const chunk of response) {
        //     console.log(chunk.candidates[0].content?.parts[0].text);
        // }


        return new Response(
            JSON.stringify({ text: response.text }),
        );
        
    } catch (error) {
        console.error('Error in chat route:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to process request' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
        
    }

}