import React, { useMemo } from 'react';
import type { Topic, Problem } from '../types';

interface DashboardProps {
    topics: Topic[];
    solvedProblems: Set<number>;
    onSelectProblem: (problemId: number) => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const Dashboard: React.FC<DashboardProps> = ({ topics, solvedProblems, onSelectProblem }) => {
    const allProblems: Problem[] = useMemo(() => topics.flatMap(t => t.problems), [topics]);

    const problemOfTheDay = useMemo(() => {
        if (allProblems.length === 0) return null;
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        return allProblems[dayOfYear % allProblems.length];
    }, [allProblems]);

    const unsolvedProblems = useMemo(() => {
        return allProblems.filter(p => !solvedProblems.has(p.id));
    }, [allProblems, solvedProblems]);

    const handleRandomProblem = () => {
        if (unsolvedProblems.length > 0) {
            const randomProblem = shuffleArray(unsolvedProblems)[0];
            onSelectProblem(randomProblem.id);
        }
    };
    
    if (!problemOfTheDay) return null;

    return (
        <div className="space-y-6">
            <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="text-sm font-semibold text-accent/80 tracking-widest uppercase">Problem of the Day</h3>
                <h4 className="font-semibold text-text-main mt-2 truncate">{problemOfTheDay.title}</h4>
                <a 
                    href={problemOfTheDay.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block mt-3 text-sm bg-card-secondary hover:bg-opacity-80 text-text-main font-medium py-1.5 px-3 rounded-md transition-colors"
                >
                    Solve Now
                </a>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="text-base font-semibold text-text-main">Feeling Adventurous?</h3>
                <p className="text-sm text-text-secondary mt-1">Pick a random problem.</p>
                <button
                    onClick={handleRandomProblem}
                    disabled={unsolvedProblems.length === 0}
                    className="mt-3 w-full bg-card-secondary hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-text-main font-medium py-1.5 px-3 rounded-md transition-colors text-sm"
                >
                    {unsolvedProblems.length > 0 ? 'Pick Problem' : 'All Solved!'}
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
