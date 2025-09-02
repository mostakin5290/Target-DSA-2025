import React, { useMemo } from 'react';
import type { UserResource } from '@clerk/types';
import type { Topic } from '../types';
import DoughnutChart from './DoughnutChart';

interface ProfilePageProps {
    user: UserResource | null | undefined;
    sdeSheet: Topic[];
    solvedProblems: Set<number>;
    onNavigateBack: () => void;
}

const BackIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ user, sdeSheet, solvedProblems, onNavigateBack }) => {

    const allProblems = useMemo(() => sdeSheet.flatMap(topic => topic.problems), [sdeSheet]);

    const stats = useMemo(() => {
        const solvedCount = solvedProblems.size;
        const totalCount = allProblems.length;

        const solvedByDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
        for (const problem of allProblems) {
            if (solvedProblems.has(problem.id)) {
                solvedByDifficulty[problem.difficulty]++;
            }
        }
        
        return {
            totalProblems: totalCount,
            totalSolved: solvedCount,
            progress: totalCount > 0 ? (solvedCount / totalCount) * 100 : 0,
            solvedByDifficulty,
        };
    }, [allProblems, solvedProblems]);

    const topicsWithProgress = useMemo(() => {
        return sdeSheet.map(topic => {
            const solvedInTopic = topic.problems.filter(p => solvedProblems.has(p.id)).length;
            const totalInTopic = topic.problems.length;
            const progress = totalInTopic > 0 ? (solvedInTopic / totalInTopic) * 100 : 0;
            return {
                title: topic.title,
                progress: progress
            };
        }).sort((a, b) => b.progress - a.progress);
    }, [sdeSheet, solvedProblems]);
    
    const strongestTopics = topicsWithProgress.slice(0, 3);
    const weakestTopics = topicsWithProgress.filter(t => t.progress < 100).slice(-3).reverse();

    const chartData = [
        { label: 'Easy', value: stats.solvedByDifficulty.Easy, color: '#2ea043' },
        { label: 'Medium', value: stats.solvedByDifficulty.Medium, color: '#f0b429' },
        { label: 'Hard', value: stats.solvedByDifficulty.Hard, color: '#f85149' },
    ];

    return (
        <div className="bg-transparent text-light min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <header className="flex items-center justify-between mb-8 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-light tracking-tight">Profile & Progress</h1>
                    <button
                        onClick={onNavigateBack}
                        className="flex items-center bg-primary/80 hover:bg-secondary/80 backdrop-blur-lg transition-colors duration-200 text-light font-medium py-2 px-4 rounded-lg border border-border"
                    >
                        <BackIcon />
                        Back to Tracker
                    </button>
                </header>

                <main className="space-y-8">
                    <section className="bg-primary/80 border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 animate-fade-in-up backdrop-blur-lg" style={{ animationDelay: '100ms' }}>
                        <img src={user?.imageUrl} alt="User avatar" className="w-24 h-24 rounded-full border-2 border-accent" />
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold">{user?.fullName}</h2>
                            <p className="text-dark-text">{user?.primaryEmailAddress?.emailAddress}</p>
                        </div>
                    </section>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <section className="lg:col-span-1 bg-primary/80 border border-border rounded-2xl p-6 flex flex-col items-center justify-center animate-fade-in-up backdrop-blur-lg" style={{ animationDelay: '200ms' }}>
                            <h3 className="text-xl font-semibold mb-4">Overall Progress</h3>
                            <DoughnutChart data={chartData} />
                            <p className="mt-4 text-lg font-semibold text-accent">{`${stats.totalSolved} / ${stats.totalProblems}`}</p>
                             <div className="flex space-x-4 mt-2">
                                {chartData.map(d => (
                                    <div key={d.label} className="flex items-center text-sm">
                                        <span className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: d.color }}></span>
                                        <span className="text-dark-text">{d.label}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="lg:col-span-2 bg-primary/80 border border-border rounded-2xl p-6 animate-fade-in-up backdrop-blur-lg" style={{ animationDelay: '300ms' }}>
                            <h3 className="text-xl font-semibold mb-6">Topic Performance</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-accent mb-3">Strongest Topics</h4>
                                    <div className="space-y-3">
                                        {strongestTopics.map(topic => (
                                            <div key={topic.title} className="p-3 bg-secondary/50 rounded-lg">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className="font-medium text-sm">{topic.title}</span>
                                                    <span className="text-sm font-bold">{Math.round(topic.progress)}%</span>
                                                </div>
                                                <div className="w-full bg-secondary rounded-full h-1.5"><div className="bg-accent h-1.5 rounded-full" style={{ width: `${topic.progress}%` }}></div></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                     <h4 className="font-semibold text-red-400 mb-3">Weakest Topics</h4>
                                     <div className="space-y-3">
                                        {weakestTopics.length > 0 ? weakestTopics.map(topic => (
                                            <div key={topic.title} className="p-3 bg-secondary/50 rounded-lg">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className="font-medium text-sm">{topic.title}</span>
                                                    <span className="text-sm font-bold">{Math.round(topic.progress)}%</span>
                                                </div>
                                                <div className="w-full bg-secondary rounded-full h-1.5"><div className="bg-red-400 h-1.5 rounded-full" style={{ width: `${topic.progress}%` }}></div></div>
                                            </div>
                                        )) : <p className="text-dark-text text-sm p-3">Nothing to improve. Keep going!</p>}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;