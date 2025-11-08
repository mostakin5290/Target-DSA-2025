import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { Problem } from '../types';
import { getAIHint, getRelatedProblems } from '../services/gemini';
import Spinner from './Spinner';

interface NoteModalProps {
    problem: Problem | null;
    allProblems: Problem[];
    note?: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (problemId: number, newText: string) => void;
    onSelectProblem: (problemId: number) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ problem, allProblems, note, isOpen, onClose, onSave, onSelectProblem }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [currentNote, setCurrentNote] = useState(note || '');
    
    const [aiHint, setAiHint] = useState<string | null>(null);
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [hintError, setHintError] = useState<string | null>(null);

    const [relatedProblems, setRelatedProblems] = useState<Problem[]>([]);
    const [isRelatedLoading, setIsRelatedLoading] = useState(false);
    const [relatedError, setRelatedError] = useState<string | null>(null);

    useEffect(() => {
        if (problem) {
            setCurrentNote(note || '');
            setAiHint(null);
            setHintError(null);
            setRelatedProblems([]);
            setRelatedError(null);
        }
    }, [problem, note]);
    
    useEffect(() => {
        if (isOpen && textareaRef.current) {
             textareaRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen || !problem) return null;

    const handleSave = () => {
        onSave(problem.id, currentNote);
        onClose();
    };
    
    const handleGetHint = async () => {
        setIsHintLoading(true);
        setHintError(null);
        setAiHint(null);
        const hint = await getAIHint(problem.title, currentNote);
        if (hint.startsWith("Sorry")) {
            setHintError(hint);
        } else {
            setAiHint(hint);
        }
        setIsHintLoading(false);
    };
    
    const handleGetRelated = async () => {
        setIsRelatedLoading(true);
        setRelatedError(null);
        setRelatedProblems([]);
        try {
            const relatedIds = await getRelatedProblems(problem, allProblems);
            const foundProblems = allProblems.filter(p => relatedIds.includes(p.id));
            setRelatedProblems(foundProblems);
        } catch (error) {
            setRelatedError("Could not fetch related problems. Please try again.");
            console.error(error);
        }
        setIsRelatedLoading(false);
    }

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={modalRef}
                className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-2xl p-6 animate-fade-in-up flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="border-b border-border pb-3 mb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold text-text-main">Notes for: <span className="text-accent">{problem.title}</span></h2>
                    <p className="text-sm text-text-secondary">Your thoughts, approaches, and learnings.</p>
                </header>
                
                <div className="overflow-y-auto pr-2 -mr-2 flex-grow">
                    <textarea
                        ref={textareaRef}
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                        className="w-full bg-card-secondary border border-border rounded-lg p-3 text-text-main placeholder-text-secondary focus:ring-2 focus:ring-accent/50 focus:border-accent/80 transition resize-none"
                        placeholder="Jot down your notes here... What's the brute force? Can you optimize it?"
                        rows={8}
                    />

                    <div className="mt-4 p-4 bg-card-secondary/30 rounded-lg">
                        <h3 className="font-semibold text-text-main mb-2">Stuck? Get a little help.</h3>
                        <button 
                            onClick={handleGetHint}
                            disabled={isHintLoading}
                            className="w-full sm:w-auto px-4 py-2 bg-card-secondary hover:bg-opacity-80 rounded-md text-sm font-medium text-text-main transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                        >
                        {isHintLoading ? 'Thinking...' : 'Get AI Hint'}
                        </button>
                        {isHintLoading && <div className="mt-4"><Spinner /></div>}
                        {aiHint && (
                            <blockquote className="mt-4 p-3 border-l-4 border-accent bg-accent/10 text-accent-light dark:text-accent-light rounded-r-lg">
                                <p className="italic text-text-main">{aiHint}</p>
                            </blockquote>
                        )}
                        {hintError && (
                            <div className="mt-4 p-3 border-l-4 border-difficulty-hard bg-difficulty-hard-bg text-difficulty-hard rounded-r-lg">
                                <p>{hintError}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4 p-4 bg-card-secondary/30 rounded-lg">
                        <h3 className="font-semibold text-text-main mb-2">Practice Similar Concepts</h3>
                        <button 
                            onClick={handleGetRelated}
                            disabled={isRelatedLoading}
                            className="w-full sm:w-auto px-4 py-2 bg-card-secondary hover:bg-opacity-80 rounded-md text-sm font-medium text-text-main transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                        >
                        {isRelatedLoading ? 'Searching...' : 'Find Related Problems'}
                        </button>
                        {isRelatedLoading && <div className="mt-4"><Spinner /></div>}
                        {relatedProblems.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {relatedProblems.map(p => (
                                    <button 
                                        key={p.id} 
                                        onClick={() => onSelectProblem(p.id)}
                                        className="w-full text-left p-2 rounded-md hover:bg-accent/10 text-text-main transition-colors"
                                    >
                                        › {p.title}
                                    </button>
                                ))}
                            </div>
                        )}
                        {relatedError && (
                            <div className="mt-4 p-3 border-l-4 border-difficulty-hard bg-difficulty-hard-bg text-difficulty-hard rounded-r-lg">
                                <p>{relatedError}</p>
                            </div>
                        )}
                    </div>
                </div>


                <div className="flex justify-end space-x-3 mt-6 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-card-secondary hover:bg-opacity-80 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg font-medium text-white dark:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-accent-hover"
                    >
                        Save Note
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default NoteModal;