import React from 'react';
import type { Problem } from '../types';

interface ProblemRowProps {
    problem: Problem;
    isSolved: boolean;
    onToggle: (id: number) => void;
    onEditNote: (problem: Problem) => void;
}

const difficultyConfig = {
    Easy: {
        classes: 'text-difficulty-easy bg-difficulty-easy-bg',
    },
    Medium: {
        classes: 'text-difficulty-medium bg-difficulty-medium-bg',
    },
    Hard: {
        classes: 'text-difficulty-hard bg-difficulty-hard-bg',
    },
};

const CheckIcon: React.FC = () => (
    <svg className="h-4 w-4 text-white dark:text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const LinkIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const NoteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const ProblemRow: React.FC<ProblemRowProps> = ({ problem, isSolved, onToggle, onEditNote }) => {
    return (
        <div className="p-4 flex items-center justify-between transition-colors duration-200 hover:bg-card-secondary/50 group">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
                <button
                    onClick={() => onToggle(problem.id)}
                    className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-accent ${
                        isSolved 
                        ? 'bg-accent border-accent' 
                        : 'bg-transparent border-border group-hover:border-accent'
                    }`}
                    aria-label={`Mark ${problem.title} as ${isSolved ? 'unsolved' : 'solved'}`}
                >
                    <div className={`transform transition-transform duration-200 ease-in-out ${isSolved ? 'scale-100' : 'scale-0'}`}>
                        <CheckIcon />
                    </div>
                </button>
                <div className='min-w-0'>
                    <span className={`text-base transition-colors duration-200 truncate block ${isSolved ? 'text-text-secondary line-through' : 'text-text-main'}`}>
                        {problem.title}
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-3 ml-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full hidden md:inline-block ${difficultyConfig[problem.difficulty].classes}`}>
                    {problem.difficulty}
                </span>
                <button
                    onClick={() => onEditNote(problem)}
                    className="text-text-secondary hover:text-text-main transition-colors duration-200 p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Edit notes"
                >
                    <NoteIcon />
                </button>
                <a 
                    href={problem.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-card-secondary/50 hover:bg-card-secondary text-text-main py-1 px-3 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label={`Solve ${problem.title}`}
                >
                   <span className="hidden sm:inline">Solve</span>
                   <LinkIcon />
                </a>
            </div>
        </div>
    );
};

export default ProblemRow;