import React from 'react';
import type { Topic, Problem } from '../types';
import StudyBuddy from './StudyBuddy';
import OverallProgress from './OverallProgress';

interface RightSidebarProps {
    topics: Topic[];
    solvedProblems: Set<number>;
    onSelectProblem: (problemId: number) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ topics, solvedProblems, onSelectProblem }) => {
    const allProblems: Problem[] = React.useMemo(() => topics.flatMap(t => t.problems), [topics]);
    
    return (
        <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
                <OverallProgress allProblems={allProblems} solvedProblems={solvedProblems} />
                <StudyBuddy 
                    allProblems={allProblems}
                    solvedProblems={solvedProblems}
                    onSelectProblem={onSelectProblem}
                />
            </div>
        </aside>
    );
};

export default RightSidebar;