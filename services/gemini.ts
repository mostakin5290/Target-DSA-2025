import { GoogleGenAI, Type } from "@google/genai";
import type { Problem } from '../types';

const getAIHint = async (problemTitle: string, userNotes: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey:"AIzaSyA0xeekABROM7nmbuAfvNBBWeeQpe4RU3M" });

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
        const ai = new GoogleGenAI({ apiKey:"AIzaSyA0xeekABROM7nmbuAfvNBBWeeQpe4RU3M" });

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
        const ai = new GoogleGenAI({ apiKey:"AIzaSyA0xeekABROM7nmbuAfvNBBWeeQpe4RU3M" });
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

export const getAIStudyPlan = async (allProblems: Problem[], solvedProblemIds: Set<number>): Promise<{ plan: { topic: string; reasoning: string; problems: Problem[] }[] }> => {
    const unsolvedProblems = allProblems.filter(p => !solvedProblemIds.has(p.id));
    const solvedProblems = allProblems.filter(p => solvedProblemIds.has(p.id));

    if (unsolvedProblems.length === 0) {
        return { plan: [{ topic: "Congratulations!", reasoning: "You've solved every problem on the list. Great job!", problems: [] }] };
    }

    const ai = new GoogleGenAI({ apiKey:"AIzaSyA0xeekABROM7nmbuAfvNBBWeeQpe4RU3M" });

    const prompt = `
        You are an expert DSA tutor creating a personalized study plan.
        The user has solved these problems: ${JSON.stringify(solvedProblems.map(p => p.title).slice(0, 30))}
        They have these unsolved problems remaining: ${JSON.stringify(unsolvedProblems.map(p => ({id: p.id, title: p.title})).slice(0, 100))}
        
        Create a study plan with 3-4 topics. For each topic:
        1. Provide a brief, encouraging "reasoning" for why the user should study this topic next, based on their progress.
        2. Suggest 2-3 specific "problemIds" from the unsolved list for that topic.
        
        Structure your response to build on what they know. Start with a foundational topic they haven't mastered, then move to more advanced ones.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    plan: {
                        type: Type.ARRAY,
                        description: "An array of topics for the study plan.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                topic: { type: Type.STRING, description: "Name of the topic, e.g., 'Two Pointers' or 'Dynamic Programming'." },
                                reasoning: { type: Type.STRING, description: "A short reason for suggesting this topic." },
                                problemIds: {
                                    type: Type.ARRAY,
                                    description: "An array of problem IDs for this topic from the unsolved list.",
                                    items: { type: Type.NUMBER }
                                }
                            },
                            required: ["topic", "reasoning", "problemIds"]
                        }
                    }
                },
                required: ["plan"]
            }
        }
    });

    const parsed = JSON.parse(response.text);
    // Hydrate problem objects from IDs
    const hydratedPlan = parsed.plan.map((stage: any) => ({
        ...stage,
        problems: stage.problemIds.map((id: number) => allProblems.find(p => p.id === id)).filter(Boolean) as Problem[]
    }));

    return { plan: hydratedPlan };
}


export { getAIHint, getAIProblemSuggestion, getRelatedProblems };