import React from 'react';

type ActiveView = 'library' | 'favorites' | 'study-plan';

interface LeftSidebarProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
}

const LibraryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
);

const StudyPlanIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const FavoriteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; disabled?: boolean; onClick?: () => void }> = ({ icon, label, active, disabled, onClick }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            active 
                ? 'bg-card-secondary text-text-main' 
                : disabled
                ? 'text-text-secondary/50 cursor-not-allowed'
                : 'text-text-secondary hover:bg-card-secondary/70 hover:text-text-main'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeView, setActiveView }) => {
    return (
        <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-1">
                <NavItem icon={<LibraryIcon />} label="Library" active={activeView === 'library'} onClick={() => setActiveView('library')} />
                <NavItem icon={<FavoriteIcon />} label="Favorites" active={activeView === 'favorites'} onClick={() => setActiveView('favorites')} />
                <NavItem icon={<StudyPlanIcon />} label="AI Study Plan" active={activeView === 'study-plan'} onClick={() => setActiveView('study-plan')} />
            </div>
        </aside>
    );
};

export default LeftSidebar;