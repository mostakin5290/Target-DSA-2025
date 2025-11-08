import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useTheme } from '../App';


interface HeaderProps {
    progressPercent: number;
    onNavigateToProfile: () => void;
}

const TargetIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-text-main" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z"></path>
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
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

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


const Header: React.FC<HeaderProps> = ({ progressPercent, onNavigateToProfile }) => {
    return (
        <header className="bg-card shadow-sm sticky top-0 z-40 border-b border-border">
            <div className="container mx-auto max-w-screen-2xl px-4 md:px-6">
                <div className="flex justify-between items-center h-14">
                    <div className="flex items-center gap-4">
                        <TargetIcon />
                        <h1 className="text-xl font-bold text-text-main tracking-tight hidden sm:block">Target DSA</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ThemeToggle />
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
            <div className="w-full bg-card-secondary h-1">
                <div 
                    className="bg-accent h-1 rounded-r-full transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </header>
    );
};

export default Header;