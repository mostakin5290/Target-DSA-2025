import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { UserButton } from '@clerk/clerk-react';
import { useTheme } from '../App';


interface HeaderProps {
    onReset: () => void;
    onNavigateToProfile: () => void;
}

const TargetIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-text-main" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z"></path>
    </svg>
);

const SettingsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ProfileIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const SunIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            className="text-text-secondary hover:text-text-main transition-colors duration-200 p-2 rounded-full hover:bg-card-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Toggle theme"
        >
            {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ onReset, onNavigateToProfile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleReset = () => {
        onReset();
        setIsModalOpen(false);
    }

    return (
        <>
            <header className="bg-card shadow-sm sticky top-0 z-40 border-b border-border">
                <div className="container mx-auto max-w-screen-2xl px-4 md:px-6">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center gap-4">
                            <TargetIcon />
                            <h1 className="text-xl font-bold text-text-main tracking-tight hidden sm:block">DSA Patterns Tracker</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ThemeToggle />
                             <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-text-secondary hover:text-text-main transition-colors duration-200 p-2 rounded-full hover:bg-card-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                aria-label="Open settings"
                            >
                                <SettingsIcon />
                            </button>
                            <button
                                onClick={onNavigateToProfile}
                                className="text-text-secondary hover:text-text-main transition-colors duration-200 p-2 rounded-full hover:bg-card-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                aria-label="View profile"
                            >
                                <ProfileIcon />
                            </button>
                            <UserButton afterSignOutUrl="/" />
                        </div>
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
                        className="px-4 py-2 bg-difficulty-hard hover:opacity-90 rounded-md font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:ring-red-500"
                    >
                        Reset Progress
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default Header;
