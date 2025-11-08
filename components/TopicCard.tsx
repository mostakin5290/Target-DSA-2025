import React, { useRef, useEffect, useMemo } from 'react';
import type { Topic, Problem } from '../types';
import ProblemRow from './ProblemRow';

interface TopicCardProps {
    topic: Topic;
    solvedProblems: Set<number>;
    favoriteProblems: Set<number>;
    onToggleProblem: (id: number) => void;
    onToggleFavorite: (id: number) => void;
    onEditNote: (problem: Problem) => void;
    initiallyOpen: boolean;
    animationDelay: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, solvedProblems, favoriteProblems, onToggleProblem, onToggleFavorite, onEditNote, initiallyOpen, animationDelay }) => {
    const detailsRef = useRef<HTMLDetailsElement>(null);
    
    useEffect(() => {
        if (detailsRef.current) {
            detailsRef.current.open = initiallyOpen;
        }
    }, [initiallyOpen]);
    
    const solvedInTopic = useMemo(() => {
        return topic.problems.filter(p => solvedProblems.has(p.id)).length;
    }, [topic.problems, solvedProblems]);


    return (
        <details 
            ref={detailsRef} 
            id={`topic-${topic.title}`}
            className="bg-card rounded-lg border border-border overflow-hidden group animate-fade-in-up"
            style={{ animationDelay }}
        >
            <summary className="p-4 cursor-pointer list-none flex justify-between items-center transition-colors duration-200 hover:bg-card-secondary/50">
                <div className="flex items-center gap-4">
                    <svg className="w-5 h-5 text-text-secondary group-open:rotate-90 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <h2 className="text-lg font-medium text-text-main">{topic.title}</h2>
                </div>
                <div className="flex items-center space-x-4">
                    <p className="text-sm text-text-secondary">{`${solvedInTopic} / ${topic.problems.length}`}</p>
                </div>
            </summary>
            <div className="border-t border-border">
                <div className="divide-y divide-border">
                    {topic.problems.map(problem => (
                        <ProblemRow
                            key={problem.id}
                            problem={problem}
                            isSolved={solvedProblems.has(problem.id)}
                            isFavorite={favoriteProblems.has(problem.id)}
                            onToggle={onToggleProblem}
                            onToggleFavorite={onToggleFavorite}
                            onEditNote={onEditNote}
                        />
                    ))}
                </div>
            </div>
        </details>
    );
};

export default TopicCard;