import React from 'react';
import type { Problem } from '../types';

interface ProblemRowProps {
    problem: Problem;
    isSolved: boolean;
    isFavorite: boolean;
    onToggle: (id: number) => void;
    onToggleFavorite: (id: number) => void;
    onEditNote: (problem: Problem) => void;
}

const difficultyConfig = {
    Easy: {
        classes: 'text-difficulty-easy',
        bgClasses: 'bg-difficulty-easy-bg',
    },
    Medium: {
        classes: 'text-difficulty-medium',
        bgClasses: 'bg-difficulty-medium-bg',
    },
    Hard: {
        classes: 'text-difficulty-hard',
        bgClasses: 'bg-difficulty-hard-bg',
    },
};

const CheckIcon: React.FC = () => (
    <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const NoteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const StarIcon: React.FC<{ isFavorite: boolean }> = ({ isFavorite }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors duration-200 ${isFavorite ? 'text-difficulty-medium' : 'text-text-secondary group-hover:text-difficulty-medium/70'}`} viewBox="0 0 20 20" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isFavorite ? 0 : 1.5}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const ProblemRow: React.FC<ProblemRowProps> = ({ problem, isSolved, isFavorite, onToggle, onToggleFavorite, onEditNote }) => {
    return (
        <div className="p-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-colors duration-200 hover:bg-card-secondary/50 group">
            <div className="flex items-center">
                <button
                    onClick={() => onToggle(problem.id)}
                    className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-accent ${
                        isSolved 
                        ? 'bg-accent/10 border-accent' 
                        : 'bg-transparent border-border group-hover:border-text-secondary'
                    }`}
                    aria-label={`Mark ${problem.title} as ${isSolved ? 'unsolved' : 'solved'}`}
                >
                    <div className={`transform transition-transform duration-200 ease-in-out ${isSolved ? 'scale-100' : 'scale-0'}`}>
                        <CheckIcon />
                    </div>
                </button>
            </div>
            
            <div className="min-w-0">
                <a href={problem.url} target="_blank" rel="noopener noreferrer" className={`text-base transition-colors duration-200 truncate block hover:text-accent ${isSolved ? 'text-text-secondary' : 'text-text-main'}`}>
                    {problem.title}
                </a>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4 ml-4">
                 <button
                    onClick={() => onToggleFavorite(problem.id)}
                    className="p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label={`Mark ${problem.title} as favorite`}
                >
                    <StarIcon isFavorite={isFavorite} />
                </button>
                <button
                    onClick={() => onEditNote(problem)}
                    className="text-text-secondary hover:text-text-main transition-colors duration-200 p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Edit notes"
                >
                    <NoteIcon />
                </button>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full hidden md:inline-block ${difficultyConfig[problem.difficulty].classes} ${difficultyConfig[problem.difficulty].bgClasses}`}>
                    {problem.difficulty}
                </span>
            </div>
        </div>
    );
};

export default ProblemRow;