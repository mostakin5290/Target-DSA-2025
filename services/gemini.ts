import { GoogleGenAI } from "@google/genai";

const getAIHint = async (problemTitle: string, userNotes: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `
            You are an expert programming tutor specializing in Data Structures and Algorithms.
            A user is stuck on the LeetCode-style problem: "${problemTitle}".
            Here are their current notes: "${userNotes || 'No notes provided.'}"

            Your task is to provide a single, concise, and helpful hint to guide them in the right direction.
            - DO NOT give away the solution or write any code.
            - The hint should be a question or a suggestion about an approach, data structure, or algorithm to consider.
            - Keep it short and to the point (1-2 sentences).
            - If the user's notes seem on the right track, affirm their thinking and gently nudge them forward.
            - If their notes are empty or seem incorrect, suggest a foundational concept to explore.

            Example Hint: "Have you considered using a hash map to keep track of the elements you've already seen?"
            Example Hint: "What if you tried iterating from both ends of the array simultaneously?"
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching AI hint:", error);
        return "Sorry, I couldn't fetch a hint at the moment. Please check your API key and try again.";
    }
};

export { getAIHint };
