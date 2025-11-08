import React, { useMemo, useState } from 'react';
import type { UserResource } from '@clerk/types';
import type { Topic } from '../types';
import DoughnutChart from './DoughnutChart';
import Modal from './Modal';
import Footer from './Footer';

interface ProfilePageProps {
    user: UserResource | null | undefined;
    sheet: Topic[];
    solvedProblems: Set<number>;
    onNavigateBack: () => void;
    onReset: () => void;
}

const BackIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ user, sheet, solvedProblems, onNavigateBack, onReset }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReset = () => {
        onReset();
        setIsModalOpen(false);
    };

    const allProblems = useMemo(() => sheet.flatMap(topic => topic.problems), [sheet]);

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
        return sheet.map(topic => {
            const solvedInTopic = topic.problems.filter(p => solvedProblems.has(p.id)).length;
            const totalInTopic = topic.problems.length;
            const progress = totalInTopic > 0 ? (solvedInTopic / totalInTopic) * 100 : 0;
            return {
                title: topic.title,
                progress: progress
            };
        }).sort((a, b) => b.progress - a.progress);
    }, [sheet, solvedProblems]);
    
    const strongestTopics = topicsWithProgress.filter(t => t.progress > 0).slice(0, 3);
    const weakestTopics = topicsWithProgress.filter(t => t.progress < 100).slice(-3).reverse();

    const chartData = [
        { label: 'Easy', value: stats.solvedByDifficulty.Easy, color: '#2ea043' },
        { label: 'Medium', value: stats.solvedByDifficulty.Medium, color: '#f0b429' },
        { label: 'Hard', value: stats.solvedByDifficulty.Hard, color: '#f85149' },
    ];

    return (
        <>
            <div className="bg-background text-text-main min-h-screen font-sans flex flex-col">
                <div className="flex-grow">
                    <div className="container mx-auto max-w-7xl p-4 md:p-8">
                        <header className="flex items-center justify-between mb-8 animate-fade-in-up">
                            <h1 className="text-3xl font-bold text-text-main tracking-tight">Profile & Progress</h1>
                            <button
                                onClick={onNavigateBack}
                                className="flex items-center bg-card hover:bg-card-secondary transition-colors duration-200 text-text-main font-medium py-2 px-4 rounded-lg border border-border"
                            >
                                <BackIcon />
                                Back to Tracker
                            </button>
                        </header>

                        <main className="space-y-8">
                            <section className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                <img src={user?.imageUrl} alt="User avatar" className="w-24 h-24 rounded-full border-2 border-accent" />
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-bold">{user?.fullName}</h2>
                                    <p className="text-text-secondary">{user?.primaryEmailAddress?.emailAddress}</p>
                                </div>
                            </section>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <section className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                    <h3 className="text-xl font-semibold mb-4">Overall Progress</h3>
                                    <DoughnutChart data={chartData} />
                                    <p className="mt-4 text-lg font-semibold text-accent">{`${stats.totalSolved} / ${stats.totalProblems}`}</p>
                                    <div className="flex space-x-4 mt-2">
                                        {chartData.map(d => (
                                            <div key={d.label} className="flex items-center text-sm">
                                                <span className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: d.color }}></span>
                                                <span className="text-text-secondary">{d.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                                    <h3 className="text-xl font-semibold mb-6">Topic Performance</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-accent mb-3">Strongest Topics</h4>
                                            <div className="space-y-3">
                                                {strongestTopics.length > 0 ? strongestTopics.map(topic => (
                                                    <div key={topic.title} className="p-3 bg-card-secondary rounded-lg">
                                                        <div className="flex justify-between items-baseline mb-1">
                                                            <span className="font-medium text-sm">{topic.title}</span>
                                                            <span className="text-sm font-bold">{Math.round(topic.progress)}%</span>
                                                        </div>
                                                        <div className="w-full bg-border rounded-full h-1.5"><div className="bg-accent h-1.5 rounded-full" style={{ width: `${topic.progress}%` }}></div></div>
                                                    </div>
                                                )) : <p className="text-text-secondary text-sm p-3">Start solving problems to see your strengths!</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-red-400 mb-3">Weakest Topics</h4>
                                            <div className="space-y-3">
                                                {weakestTopics.length > 0 ? weakestTopics.map(topic => (
                                                    <div key={topic.title} className="p-3 bg-card-secondary rounded-lg">
                                                        <div className="flex justify-between items-baseline mb-1">
                                                            <span className="font-medium text-sm">{topic.title}</span>
                                                            <span className="text-sm font-bold">{Math.round(topic.progress)}%</span>
                                                        </div>
                                                        <div className="w-full bg-border rounded-full h-1.5"><div className="bg-red-400 h-1.5 rounded-full" style={{ width: `${topic.progress}%` }}></div></div>
                                                    </div>
                                                )) : <p className="text-text-secondary text-sm p-3">Nothing to improve. Keep going!</p>}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <section className="bg-card border border-border rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                                <h3 className="text-xl font-semibold mb-4 text-difficulty-hard">Danger Zone</h3>
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div>
                                        <p className="font-medium">Reset All Progress</p>
                                        <p className="text-sm text-text-secondary">This will permanently delete all your solved problems and notes.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-4 py-2 bg-difficulty-hard hover:opacity-90 rounded-md font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:ring-red-500 flex-shrink-0"
                                    >
                                        Reset Progress...
                                    </button>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
                <div className="container mx-auto max-w-7xl px-4 md:px-8">
                    <Footer />
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Reset Progress">
                 <p className="text-text-secondary my-4">
                    Are you sure you want to reset all your progress? This will clear all solved problems and notes for your account. This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-card-secondary hover:bg-opacity-80 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-difficulty-hard hover:opacity-90 rounded-md font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:ring-red-500"
                    >
                        Reset Progress
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default ProfilePage;