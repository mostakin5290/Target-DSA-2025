import React from 'react';

interface SearchFilterProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const FilterPill: React.FC<{ children: React.ReactNode; active?: boolean }> = ({ children, active }) => (
    <button className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${active ? 'bg-card-secondary text-text-main' : 'text-text-secondary hover:bg-card-secondary/70 hover:text-text-main'}`}>
        {children}
    </button>
);

const SearchFilter: React.FC<SearchFilterProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <FilterPill active>All Topics</FilterPill>
                <FilterPill>Algorithms</FilterPill>
                <FilterPill>Database</FilterPill>
                <FilterPill>JavaScript</FilterPill>
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full bg-card-secondary border border-transparent text-text-main rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/80 focus:border-accent/80 transition-colors"
                />
            </div>
        </div>
    );
};

export default SearchFilter;
