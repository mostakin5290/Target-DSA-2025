import React from 'react';

interface SearchFilterProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-dark-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const SearchFilter: React.FC<SearchFilterProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="my-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a problem..."
                    className="w-full bg-primary/80 border border-border backdrop-blur-lg text-light rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/80 focus:border-accent transition-colors"
                />
            </div>
        </div>
    );
};

export default SearchFilter;