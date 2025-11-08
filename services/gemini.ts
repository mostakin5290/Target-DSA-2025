import { GoogleGenAI, Type } from "@google/genai";
import type { Problem } from '../types';

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

const getAIProblemSuggestion = async (allProblems: Problem[], solvedProblemIds: Set<number>): Promise<{ problem: Problem, reasoning: string }> => {
    const unsolvedProblems = allProblems.filter(p => !solvedProblemIds.has(p.id));

    if (unsolvedProblems.length === 0) {
        throw new Error("All problems have been solved!");
    }
    
    // To keep the prompt small, let's just send problem titles and IDs
    const unsolvedProblemData = unsolvedProblems.map(p => ({ id: p.id, title: p.title, difficulty: p.difficulty }));
    const solvedProblemData = allProblems
        .filter(p => solvedProblemIds.has(p.id))
        .map(p => ({ id: p.id, title: p.title, difficulty: p.difficulty }));

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `
            You are an expert DSA tutor. A user needs a recommendation for the next problem to solve.
            
            Here's a list of problems they have already solved:
            ${JSON.stringify(solvedProblemData.slice(0, 50))} 
            
            Here are the problems they have NOT solved yet:
            ${JSON.stringify(unsolvedProblemData.slice(0, 100))}

            Based on what they've solved, identify a topic or difficulty level they should focus on. 
            Then, pick ONE single problem from the unsolved list that would be a good challenge for them.
            Provide a brief, encouraging reason for your choice.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        problemId: { type: Type.NUMBER, description: "The ID of the suggested problem." },
                        reasoning: { type: Type.STRING, description: "A short, encouraging reason for suggesting this problem." }
                    },
                    required: ["problemId", "reasoning"],
                }
            }
        });
        
        const jsonResponse = JSON.parse(response.text);
        const suggestedProblem = allProblems.find(p => p.id === jsonResponse.problemId);

        if (!suggestedProblem) {
            // Fallback if the model hallucinates an ID
            return { problem: unsolvedProblems[0], reasoning: "Here's a great problem to get started with." };
        }
        
        return {
            problem: suggestedProblem,
            reasoning: jsonResponse.reasoning,
        };

    } catch (error) {
        console.error("Error fetching AI suggestion:", error);
        // Fallback to a random problem on error
        const randomProblem = unsolvedProblems[Math.floor(Math.random() * unsolvedProblems.length)];
        return {
            problem: randomProblem,
            reasoning: "The AI is thinking... In the meantime, why not try this interesting problem?"
        };
    }
};

const getRelatedProblems = async (currentProblem: Problem, allProblems: Problem[]): Promise<number[]> => {
     try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const otherProblems = allProblems.filter(p => p.id !== currentProblem.id).map(p => ({id: p.id, title: p.title}));

        const prompt = `
            A user is currently viewing the problem: "${currentProblem.title}".
            From the following list of other problems, find 2-3 that are conceptually similar or use the same core algorithm or data structure.
            
            List of available problems:
            ${JSON.stringify(otherProblems.slice(0,150))}
        `;
        
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        relatedProblemIds: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.NUMBER
                            }
                        }
                    },
                    required: ["relatedProblemIds"],
                }
            }
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.relatedProblemIds || [];

    } catch (error) {
        console.error("Error fetching related problems:", error);
        throw error;
    }
}


export { getAIHint, getAIProblemSuggestion, getRelatedProblems };