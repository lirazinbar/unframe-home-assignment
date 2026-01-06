import { GoogleGenAI } from '@google/genai';
import { fetchFilesByModifiedDate } from '../app';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function askAi(question: string) {
    const files = await fetchFilesByModifiedDate();

    const systemInstruction = `You are a helpful and highly knowledgeable File System Analyst AI. 
    Your role is to answer questions about file metadata, ownership, size, and modification dates. 
    Please provide clear, concise, and structured answers.
    Here is the list of files in JSON:
    ${JSON.stringify(files)}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: question,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.2,
        }
    });
    return response.text;
}
