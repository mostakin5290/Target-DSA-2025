import React, { useState, useCallback } from 'react';
import type { Problem } from '../types';
import { getAIStudyPlan } from '../services/gemini';
import Spinner from './Spinner';

interface StudyPlan {
    plan: {
        topic: string;
        reasoning: string;
        problems: Problem[];
    }[];
}

interface StudyPlanViewProps {
    allProblems: Problem[];
    solvedProblems: Set<number>;
    onSelectProblem: (problemId: number) => void;
}

const MapIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 0l6-3m6 3l-6-3" />
    </svg>
);

const StudyPlanView: React.FC<StudyPlanViewProps> = ({ allProblems, solvedProblems, onSelectProblem }) => {
    const [plan, setPlan] = useState<StudyPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setPlan(null);
        try {
            const result = await getAIStudyPlan(allProblems, solvedProblems);
            setPlan(result);
        } catch (err) {
            setError("Could not generate a study plan. The AI might be busy, please try again later.");
            console.error(err);
        }
        setIsLoading(false);
    }, [allProblems, solvedProblems]);

    const isAllSolved = allProblems.length > 0 && solvedProblems.size === allProblems.length;

    return (
        <div className="bg-card border border-border rounded-lg p-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-text-main">Your Personal AI Study Plan</h2>
            <p className="text-text-secondary mt-1">Get a custom roadmap based on your progress to conquer DSA effectively.</p>
            
            <div className="mt-6">
                {!plan && !isLoading && !error && (
                    <div className="text-center py-8">
                         <button
                            onClick={handleGeneratePlan}
                            disabled={isLoading || isAllSolved}
                            className="bg-accent hover:bg-accent-hover text-white dark:text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                        >
                            <MapIcon />
                            {isAllSolved ? "You've Solved Everything!" : "Generate My Roadmap"}
                        </button>
                    </div>
                )}
                
                {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}

                {error && (
                    <div className="mt-4 p-4 border-l-4 border-difficulty-hard bg-difficulty-hard-bg text-difficulty-hard rounded-r-lg">
                        <p className="font-semibold">Oops!</p>
                        <p>{error}</p>
                    </div>
                )}
                
                {plan && (
                    <div className="mt-6 space-y-6">
                        {plan.plan.map((stage, index) => (
                            <div key={index} className="p-4 border border-border rounded-lg bg-card-secondary/30 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <h3 className="text-lg font-semibold text-accent">{stage.topic}</h3>
                                <p className="text-sm text-text-secondary italic mt-1 mb-3">"{stage.reasoning}"</p>
                                <div className="space-y-2">
                                    {stage.problems.map(problem => (
                                        <button 
                                            key={problem.id}
                                            onClick={() => onSelectProblem(problem.id)}
                                            className="w-full text-left p-2.5 rounded-md hover:bg-accent/10 text-text-main transition-colors text-base font-medium flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-3 text-text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                            {problem.title}
                                        </button>
                                    ))}
                                    {stage.problems.length === 0 && (
                                         <p className="p-2.5 text-text-secondary text-sm">No problems to suggest for this final step. You're done!</p>
                                    )}
                                </div>
                            </div>
                        ))}
                         <button
                            onClick={handleGeneratePlan}
                            disabled={isLoading || isAllSolved}
                            className="w-full mt-6 bg-card-secondary hover:bg-opacity-80 font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Regenerate Plan
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyPlanView;