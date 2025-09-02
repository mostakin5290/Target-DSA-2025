import React, { useState, useRef, useEffect } from 'react';
import type { Problem } from '../types';

interface ProblemRowProps {
    problem: Problem;
    isSolved: boolean;
    onToggle: (id: number) => void;
    note?: string;
    onNoteChange: (id: number, text: string) => void;
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
    <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const LinkIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const NoteIcon: React.FC<{ hasNote: boolean }> = ({ hasNote }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        {hasNote && <circle cx="18.5" cy="5.5" r="3.5" className="text-accent" fill="currentColor" stroke="#111" strokeWidth={2} />}
    </svg>
);

const ProblemRow: React.FC<ProblemRowProps> = ({ problem, isSolved, onToggle, note, onNoteChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const noteTextareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && noteTextareaRef.current) {
            noteTextareaRef.current.focus();
            const textarea = noteTextareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [isEditing]);

    const handleSaveNote = () => {
        if (noteTextareaRef.current) {
            onNoteChange(problem.id, noteTextareaRef.current.value);
            setIsEditing(false);
        }
    };
    
    const handleTextareaInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const textarea = event.currentTarget;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    return (
        <div>
            <div className="p-4 flex items-center justify-between transition-all duration-200 hover:bg-secondary/50 hover:scale-[1.02] group">
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
                        <span className={`text-base transition-colors duration-200 truncate block ${isSolved ? 'text-dark-text line-through' : 'text-light'}`}>
                            {problem.title}
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full hidden md:inline-block ${difficultyConfig[problem.difficulty].classes}`}>
                        {problem.difficulty}
                    </span>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-dark-text hover:text-light transition-colors duration-200 p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        aria-label="Edit notes"
                    >
                        <NoteIcon hasNote={!!note} />
                    </button>
                    <a 
                        href={problem.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-secondary/50 hover:bg-secondary text-light py-1 px-3 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        aria-label={`Solve ${problem.title}`}
                    >
                       <span className="hidden sm:inline">Solve</span>
                       <LinkIcon />
                    </a>
                </div>
            </div>
            <div className={`grid transition-all duration-300 ease-in-out ${isEditing ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="px-4 pb-4 pt-2 bg-secondary/20">
                        <label htmlFor={`note-${problem.id}`} className="sr-only">Note for {problem.title}</label>
                        <textarea
                            id={`note-${problem.id}`}
                            ref={noteTextareaRef}
                            defaultValue={note}
                            onInput={handleTextareaInput}
                            className="w-full bg-secondary/50 border border-border rounded-md p-2 text-light placeholder-dark-text focus:ring-2 focus:ring-accent/50 focus:border-accent transition resize-none overflow-hidden"
                            placeholder="Add your notes here..."
                            rows={3}
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1 bg-secondary hover:bg-opacity-80 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveNote}
                                className="px-3 py-1 bg-accent hover:bg-accent-hover rounded-md text-sm font-medium text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-hover"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemRow;