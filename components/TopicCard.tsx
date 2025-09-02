import React, { useMemo, useRef, useEffect } from 'react';
import type { Topic } from '../types';
import ProblemRow from './ProblemRow';

interface TopicCardProps {
    topic: Topic;
    solvedProblems: Set<number>;
    onToggleProblem: (id: number) => void;
    notes: Map<number, string>;
    onNoteChange: (id: number, text: string) => void;
    initiallyOpen: boolean;
    animationDelay: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, solvedProblems, onToggleProblem, notes, onNoteChange, initiallyOpen, animationDelay }) => {
    const detailsRef = useRef<HTMLDetailsElement>(null);
    
    useEffect(() => {
        if (detailsRef.current) {
            detailsRef.current.open = initiallyOpen;
        }
    }, [initiallyOpen]);

    const solvedInTopic = useMemo(() => {
        return topic.problems.filter(p => solvedProblems.has(p.id)).length;
    }, [topic.problems, solvedProblems]);

    const progress = topic.problems.length > 0 ? (solvedInTopic / topic.problems.length) * 100 : 0;

    return (
        <details 
            ref={detailsRef} 
            className="bg-primary rounded-lg shadow-md border border-border overflow-hidden group animate-fade-in-up"
            style={{ animationDelay }}
        >
            <summary className="p-5 cursor-pointer list-none flex justify-between items-center transition-colors duration-200 group-hover:bg-secondary/50 relative border-l-4 border-transparent group-open:border-accent">
                <div>
                    <h2 className="text-xl font-semibold text-light">{topic.title}</h2>
                    <p className="text-sm text-dark-text mt-1">{`Completed: ${solvedInTopic} of ${topic.problems.length}`}</p>
                </div>
                <div className="flex items-center space-x-4">
                     <div className="w-24 bg-secondary rounded-full h-2.5 hidden sm:block">
                        <div className="bg-accent h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
                    </div>
                    <svg className="w-6 h-6 text-dark-text group-open:rotate-180 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </summary>
            <div className="border-t border-border bg-background/50">
                <div className="divide-y divide-border">
                    {topic.problems.map(problem => (
                        <ProblemRow
                            key={problem.id}
                            problem={problem}
                            isSolved={solvedProblems.has(problem.id)}
                            onToggle={onToggleProblem}
                            note={notes.get(problem.id)}
                            onNoteChange={onNoteChange}
                        />
                    ))}
                </div>
            </div>
        </details>
    );
};

export default TopicCard;