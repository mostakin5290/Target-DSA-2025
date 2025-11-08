import React, { useMemo } from 'react';
import DoughnutChart from './DoughnutChart';
import type { Problem } from '../types';

interface OverallProgressProps {
    allProblems: Problem[];
    solvedProblems: Set<number>;
}

const OverallProgress: React.FC<OverallProgressProps> = ({ allProblems, solvedProblems }) => {
    const stats = useMemo(() => {
        const solvedCount = solvedProblems.size;
        const totalCount = allProblems.length;

        const solvedByDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
        const totalByDifficulty = { Easy: 0, Medium: 0, Hard: 0 };

        for (const problem of allProblems) {
            totalByDifficulty[problem.difficulty]++;
            if (solvedProblems.has(problem.id)) {
                solvedByDifficulty[problem.difficulty]++;
            }
        }
        
        return {
            totalProblems: totalCount,
            totalSolved: solvedCount,
            solvedByDifficulty,
            totalByDifficulty,
        };
    }, [allProblems, solvedProblems]);
    
    const chartData = [
        { label: 'Easy', value: stats.solvedByDifficulty.Easy, color: 'var(--difficulty-easy)' },
        { label: 'Medium', value: stats.solvedByDifficulty.Medium, color: 'var(--difficulty-medium)' },
        { label: 'Hard', value: stats.solvedByDifficulty.Hard, color: 'var(--difficulty-hard)' },
    ];
    
    const difficultyStats = [
        { name: 'Easy', solved: stats.solvedByDifficulty.Easy, total: stats.totalByDifficulty.Easy, color: 'text-difficulty-easy' },
        { name: 'Medium', solved: stats.solvedByDifficulty.Medium, total: stats.totalByDifficulty.Medium, color: 'text-difficulty-medium' },
        { name: 'Hard', solved: stats.solvedByDifficulty.Hard, total: stats.totalByDifficulty.Hard, color: 'text-difficulty-hard' },
    ];


    return (
        <div className="bg-card border border-border rounded-lg p-4">
             <h3 className="text-lg font-semibold mb-4 text-text-main">Overall Progress</h3>
             <div className="flex justify-center my-4">
                <DoughnutChart data={chartData} />
             </div>
             <div className="space-y-3 mt-4">
                {difficultyStats.map(stat => (
                    <div key={stat.name}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className={`font-medium ${stat.color}`}>{stat.name}</span>
                            <span className="text-text-secondary">{stat.solved} / {stat.total}</span>
                        </div>
                        <div className="w-full bg-card-secondary rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${stat.name === 'Easy' ? 'bg-difficulty-easy' : stat.name === 'Medium' ? 'bg-difficulty-medium' : 'bg-difficulty-hard'}`} 
                                style={{ width: stat.total > 0 ? `${(stat.solved/stat.total) * 100}%` : '0%'}}
                            ></div>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
}

export default OverallProgress;
