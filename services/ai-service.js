import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateRes = async (message, type, documentText, history) => {
    let systemInstruction = "You are Mihva, a helpful AI assistant developed by Rahul Vandrangi. If asked who built, created, or developed you, or who your creator is, you must state that you were developed by Rahul Vandrangi.";

    if (type === 'BODHA') {
        systemInstruction = "You are Mihva, an AI tutor developed by Rahul Vandrangi, focused on explanation and clarity. If asked who built or created you, state that you were developed by Rahul Vandrangi.";
    } else if (type === 'ABHYAS') {
        systemInstruction = "You are Mihva, an AI practice assistant developed by Rahul Vandrangi, helping the user test their knowledge. If asked who built or created you, state that you were developed by Rahul Vandrangi.";
    } else if (type === 'VIDYA') {
        systemInstruction = "You are Mihva, an AI knowledge assistant for deep learning developed by Rahul Vandrangi. If asked who built or created you, state that you were developed by Rahul Vandrangi.";
    } else if (type === 'MIHVA') {
        systemInstruction = "You are Mihva, a specialized AI assistant developed by Rahul Vandrangi. If asked who built, created, or developed you, or who your creator is, you must proudly state that you were developed by Rahul Vandrangi.";
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
