import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateRes = async (message, type, documentText, history) => {
    let systemInstruction = "You are a helpful AI assistant.";

    if (type === 'BODHA') {
        systemInstruction = "You are an AI tutor focused on explanation and clarity.";
    } else if (type === 'ABHYAS') {
        systemInstruction = "You are an AI practice assistant, helping the user test their knowledge.";
    } else if (type === 'VIDYA') {
        systemInstruction = "You are an AI knowledge assistant for deep learning.";
    } else if (type === 'MIHVA') {
        systemInstruction = "You are a specialized AI assistant.";
    }

    if (documentText) {
        systemInstruction += `\n\nReference Document Context:\n${documentText}`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                ...history,
                { role: 'user', parts: [{ text: message }] }
            ],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            }
        });

        return response.text;
    } catch (error) {
        console.error("AI Service Error:", error);
        throw new Error("Failed to generate AI response");
    }
};

export default { generateRes };
