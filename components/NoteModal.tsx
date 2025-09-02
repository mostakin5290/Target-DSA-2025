import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { Problem } from '../types';
import { getAIHint } from '../services/gemini';
import Spinner from './Spinner';

interface NoteModalProps {
    problem: Problem | null;
    note?: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (problemId: number, newText: string) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ problem, note, isOpen, onClose, onSave }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [currentNote, setCurrentNote] = useState(note || '');
    const [aiHint, setAiHint] = useState<string | null>(null);
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [hintError, setHintError] = useState<string | null>(null);

    useEffect(() => {
        if (problem) {
            setCurrentNote(note || '');
            setAiHint(null);
            setHintError(null);
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

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={modalRef}
                className="bg-primary/80 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="border-b border-white/10 pb-3 mb-4">
                    <h2 className="text-xl font-bold text-light">Notes for: <span className="text-accent">{problem.title}</span></h2>
                    <p className="text-sm text-dark-text">Your thoughts, approaches, and learnings.</p>
                </header>
                
                <textarea
                    ref={textareaRef}
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-lg p-3 text-light placeholder-dark-text focus:ring-2 focus:ring-accent/50 focus:border-accent transition resize-none"
                    placeholder="Jot down your notes here... What's the brute force? Can you optimize it?"
                    rows={8}
                />

                <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-semibold text-light mb-2">Stuck? Get a little help.</h3>
                     <button 
                        onClick={handleGetHint}
                        disabled={isHintLoading}
                        className="w-full sm:w-auto px-4 py-2 bg-secondary hover:bg-opacity-80 rounded-md text-sm font-medium text-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                    >
                       {isHintLoading ? 'Thinking...' : 'Get AI Hint'}
                    </button>
                    {isHintLoading && <div className="mt-4"><Spinner /></div>}
                    {aiHint && (
                        <blockquote className="mt-4 p-3 border-l-4 border-accent bg-accent/10 text-accent-light rounded-r-lg">
                            <p className="italic">{aiHint}</p>
                        </blockquote>
                    )}
                    {hintError && (
                         <div className="mt-4 p-3 border-l-4 border-red-500 bg-red-500/10 text-red-400 rounded-r-lg">
                            <p>{hintError}</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-secondary hover:bg-opacity-80 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg font-medium text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-accent-hover"
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
