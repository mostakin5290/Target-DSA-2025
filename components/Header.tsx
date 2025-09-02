import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { UserButton } from '@clerk/clerk-react';
import { useTheme } from '../App';


interface HeaderProps {
    totalSolved: number;
    totalProblems: number;
    onReset: () => void;
    onNavigateToProfile: () => void;
}

const TargetIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3" />
    </svg>
);

const SettingsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ProfileIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const SunIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const toggleTheme = () => {
        setTheme(theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'light' : 'dark');
    };

    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <button
            onClick={toggleTheme}
            className="text-text-secondary hover:text-text-main transition-colors duration-200 p-2 rounded-full hover:bg-card-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Toggle theme"
        >
            {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ totalSolved, totalProblems, onReset, onNavigateToProfile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const progress = totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0;
    
    const handleReset = () => {
        onReset();
        setIsModalOpen(false);
    }

    return (
        <>
            <header className="bg-card/80 dark:backdrop-blur-lg shadow-2xl rounded-2xl p-6 border border-border animate-fade-in-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <TargetIcon />
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold text-text-main tracking-tight">Target DSA 2025</h1>
                            <p className="text-text-secondary mt-1">Your journey to mastering Data Structures & Algorithms.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-auto flex items-center justify-between">
                        <div className="w-full md:w-auto text-left md:text-right pr-4">
                            <p className="text-lg font-semibold text-accent">{`${totalSolved} / ${totalProblems}`}</p>
                            <p className="text-sm text-text-secondary">Problems Solved</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ThemeToggle />
                             <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-text-secondary hover:text-text-main transition-colors duration-200 p-2 rounded-full hover:bg-card-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                aria-label="Open settings"
                            >
                                <SettingsIcon />
                            </button>
                            <button
                                onClick={onNavigateToProfile}
                                className="text-text-secondary hover:text-text-main transition-colors duration-200 p-2 rounded-full hover:bg-card-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                aria-label="View profile"
                            >
                                <ProfileIcon />
                            </button>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="w-full bg-card-secondary/80 rounded-full h-3">
                        <div 
                            className="bg-accent h-3 rounded-full transition-all duration-500 ease-out" 
                            style={{ 
                                width: `${progress}%`,
                                boxShadow: `0 0 12px ${progress > 0 ? 'var(--accent)' : 'transparent'}, 0 0 4px ${progress > 0 ? 'var(--accent)' : 'transparent'}`
                            }}
                        ></div>
                    </div>
                </div>
            </header>
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
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:ring-red-500"
                    >
                        Reset Progress
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default Header;