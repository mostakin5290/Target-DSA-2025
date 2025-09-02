import React, { useMemo, useRef, useEffect } from 'react';
import type { Topic, Problem } from '../types';
import ProblemRow from './ProblemRow';

interface TopicCardProps {
    topic: Topic;
    solvedProblems: Set<number>;
    onToggleProblem: (id: number) => void;
    onEditNote: (problem: Problem) => void;
    initiallyOpen: boolean;
    animationDelay: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, solvedProblems, onToggleProblem, onEditNote, initiallyOpen, animationDelay }) => {
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
            id={`topic-${topic.title}`}
            className="bg-card/80 rounded-2xl shadow-lg border border-border overflow-hidden group animate-fade-in-up dark:backdrop-blur-lg"
            style={{ animationDelay }}
        >
            <summary className="p-5 cursor-pointer list-none flex justify-between items-center transition-colors duration-200 group-hover:bg-card-secondary/50 relative border-l-4 border-transparent group-open:border-accent">
                <div>
                    <h2 className="text-xl font-semibold text-text-main">{topic.title}</h2>
                    <p className="text-sm text-text-secondary mt-1">{`Completed: ${solvedInTopic} of ${topic.problems.length}`}</p>
                </div>
                <div className="flex items-center space-x-4">
                     <div className="w-24 bg-card-secondary rounded-full h-2.5 hidden sm:block">
                        <div className="bg-accent h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
                    </div>
                    <svg className="w-6 h-6 text-text-secondary group-open:rotate-180 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                            onEditNote={onEditNote}
                        />
                    ))}
                </div>
            </div>
        </details>
    );
};

export default TopicCard;