import React, { useMemo } from 'react';
import type { UserResource } from '@clerk/types';
import type { Topic } from '../types';

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

const ProgressCircle: React.FC<{ progress: number }> = ({ progress }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-secondary"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className="text-accent"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-light">{`${Math.round(progress)}%`}</span>
            </div>
        </div>
    );
};


const ProfilePage: React.FC<ProfilePageProps> = ({ user, sdeSheet, solvedProblems, onNavigateBack }) => {

    const stats = useMemo(() => {
        const allProblems = sdeSheet.flatMap(topic => topic.problems);
        const solvedCount = solvedProblems.size;
        const totalCount = allProblems.length;

        const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
        for (const problem of allProblems) {
            if (solvedProblems.has(problem.id)) {
                difficultyCounts[problem.difficulty]++;
            }
        }
        
        return {
            totalProblems: totalCount,
            totalSolved: solvedCount,
            progress: totalCount > 0 ? (solvedCount / totalCount) * 100 : 0,
            solvedByDifficulty: difficultyCounts
        };
    }, [sdeSheet, solvedProblems]);

    const topicsWithProgress = useMemo(() => {
        return sdeSheet.map(topic => {
            const solvedInTopic = topic.problems.filter(p => solvedProblems.has(p.id)).length;
            const totalInTopic = topic.problems.length;
            const progress = totalInTopic > 0 ? (solvedInTopic / totalInTopic) * 100 : 0;
            return {
                ...topic,
                solvedCount: solvedInTopic,
                totalCount: totalInTopic,
                progress: progress
            };
        });
    }, [sdeSheet, solvedProblems]);

    return (
        <div className="bg-transparent text-light min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <header className="flex items-center justify-between mb-8 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-light tracking-tight">Profile & Progress</h1>
                    <button
                        onClick={onNavigateBack}
                        className="flex items-center bg-primary hover:bg-secondary transition-colors duration-200 text-light font-medium py-2 px-4 rounded-lg border border-border"
                    >
                        <BackIcon />
                        Back to Tracker
                    </button>
                </header>

                <main className="space-y-8">
                    <section className="bg-primary border border-border rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <img src={user?.imageUrl} alt="User avatar" className="w-24 h-24 rounded-full border-2 border-accent" />
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold">{user?.fullName}</h2>
                            <p className="text-dark-text">{user?.primaryEmailAddress?.emailAddress}</p>
                        </div>
                    </section>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <section className="lg:col-span-1 bg-primary border border-border rounded-xl p-6 flex flex-col items-center justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <h3 className="text-xl font-semibold mb-4">Overall Progress</h3>
                            <ProgressCircle progress={stats.progress} />
                            <p className="mt-4 text-lg font-semibold text-accent">{`${stats.totalSolved} / ${stats.totalProblems}`}</p>
                            <p className="text-sm text-dark-text">Problems Solved</p>
                        </section>

                        <section className="lg:col-span-2 bg-primary border border-border rounded-xl p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <h3 className="text-xl font-semibold mb-4">Stats at a Glance</h3>
                            <div className="space-y-4">
                               <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                                    <span className="font-medium text-difficulty-easy">Easy</span>
                                    <span className="font-bold text-lg">{stats.solvedByDifficulty.Easy} Solved</span>
                               </div>
                               <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                                    <span className="font-medium text-difficulty-medium">Medium</span>
                                    <span className="font-bold text-lg">{stats.solvedByDifficulty.Medium} Solved</span>
                               </div>
                               <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                                    <span className="font-medium text-difficulty-hard">Hard</span>
                                    <span className="font-bold text-lg">{stats.solvedByDifficulty.Hard} Solved</span>
                               </div>
                            </div>
                        </section>
                    </div>

                    <section className="bg-primary border border-border rounded-xl p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <h3 className="text-xl font-semibold mb-6">Progress by Topic</h3>
                        <div className="space-y-5">
                            {topicsWithProgress.map(topic => (
                                <div key={topic.title}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-medium">{topic.title}</span>
                                        <span className="text-sm text-dark-text">{`${topic.solvedCount} / ${topic.totalCount}`}</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2.5">
                                        <div className="bg-accent h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${topic.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;