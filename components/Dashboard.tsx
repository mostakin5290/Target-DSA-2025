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
        <div className="my-8 animate-fade-in-up grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-2xl bg-card/80 border border-border dark:backdrop-blur-lg shadow-lg">
                <h3 className="text-sm font-semibold text-accent/80 tracking-widest uppercase">Problem of the Day</h3>
                <h2 className="text-2xl font-bold text-text-main mt-2">{problemOfTheDay.title}</h2>
                <p className="text-text-secondary mt-1">Challenge yourself with today's pick!</p>
                <a 
                    href={problemOfTheDay.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block mt-4 bg-accent hover:bg-accent-hover text-white dark:text-black font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Solve Now
                </a>
            </div>
            <div className="p-6 rounded-2xl bg-card/80 border border-border dark:backdrop-blur-lg shadow-lg flex flex-col justify-center">
                <h3 className="text-lg font-bold text-text-main">Feeling Adventurous?</h3>
                <p className="text-text-secondary mt-1">Let's find a random unsolved problem for you.</p>
                <button
                    onClick={handleRandomProblem}
                    disabled={unsolvedProblems.length === 0}
                    className="mt-4 w-full bg-card-secondary hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-text-main font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    {unsolvedProblems.length > 0 ? 'Pick a Random Problem' : 'All Solved!'}
                </button>
            </div>
        </div>
    );
};

export default Dashboard;