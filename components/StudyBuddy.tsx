import React, { useState, useCallback } from 'react';
import type { Problem } from '../types';
import { getAIProblemSuggestion } from '../services/gemini';
import Spinner from './Spinner';

interface StudyBuddyProps {
    allProblems: Problem[];
    solvedProblems: Set<number>;
    onSelectProblem: (problemId: number) => void;
}

const LightbulbIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const StudyBuddy: React.FC<StudyBuddyProps> = ({ allProblems, solvedProblems, onSelectProblem }) => {
    const [suggestion, setSuggestion] = useState<{ problem: Problem, reasoning: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetSuggestion = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getAIProblemSuggestion(allProblems, solvedProblems);
            setSuggestion(result);
        } catch (err) {
            setError("Could not get a suggestion. Please try again.");
            console.error(err);
        }
        setIsLoading(false);
    }, [allProblems, solvedProblems]);
    
    const unsolvedCount = allProblems.length - solvedProblems.size;

    return (
        <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="text-base font-semibold text-text-main">AI Study Buddy</h3>
            <p className="text-sm text-text-secondary mt-1">Let's find the perfect problem for you.</p>

            {suggestion && !isLoading && (
                 <div className="mt-4 p-3 bg-card-secondary/50 rounded-lg animate-fade-in-up">
                    <p className="text-sm text-text-secondary italic">"{suggestion.reasoning}"</p>
                    <button 
                        onClick={() => onSelectProblem(suggestion.problem.id)}
                        className="font-semibold text-text-main mt-2 hover:text-accent transition-colors block text-left"
                    >
                        Tackle: {suggestion.problem.title}
                    </button>
                </div>
            )}
            
            {error && (
                <div className="mt-4 text-sm text-difficulty-hard">{error}</div>
            )}

            <button
                onClick={handleGetSuggestion}
                disabled={isLoading || unsolvedCount === 0}
                className="mt-4 w-full flex items-center justify-center bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-white dark:text-black font-medium py-2 px-3 rounded-md transition-colors text-sm"
            >
                {isLoading ? <Spinner /> : <><LightbulbIcon /> {unsolvedCount > 0 ? 'Suggest a Problem' : 'All Solved!'}</>}
            </button>
        </div>
    );
};

export default StudyBuddy;