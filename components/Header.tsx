import React from 'react';

interface HeaderProps {
    totalSolved: number;
    totalProblems: number;
}

const TargetIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ totalSolved, totalProblems }) => {
    const progress = totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0;

    return (
        <header className="bg-primary shadow-lg rounded-xl p-6 border border-secondary">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center gap-4">
                    <TargetIcon />
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-light tracking-tight">Target DSA 2025</h1>
                        <p className="text-dark-text mt-1">Your journey to mastering Data Structures & Algorithms.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/3 text-right">
                    <p className="text-lg font-semibold text-accent">{`${totalSolved} / ${totalProblems}`}</p>
                    <p className="text-sm text-dark-text">Problems Solved</p>
                </div>
            </div>
            <div className="mt-6">
                <div className="w-full bg-secondary rounded-full h-3">
                    <div 
                        className="bg-accent h-3 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </header>
    );
};

export default Header;