import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Header from './components/Header';
import TopicCard from './components/TopicCard';
import SearchFilter from './components/SearchFilter';
import Auth from './components/Auth';
import Spinner from './components/Spinner';
import ProfilePage from './components/ProfilePage';
import Dashboard from './components/Dashboard';
import NoteModal from './components/NoteModal';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { sdeSheet } from './data/problems';
import type { Topic, Problem } from './types';
import { getUserData, updateProblemStatus, updateNote, resetUserData } from './services/userData';

const MainApp: React.FC = () => {
    const { isLoaded, user } = useUser();
    const [dataLoading, setDataLoading] = useState(true);
    const [view, setView] = useState<'tracker' | 'profile'>('tracker');
    const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
    const [notes, setNotes] = useState<Map<number, string>>(new Map());
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
    const [openTopic, setOpenTopic] = useState<string | null>(null);

    useEffect(() => {
        if (isLoaded && user) {
            setDataLoading(true);
            const userData = getUserData(user);
            setSolvedProblems(new Set(userData.solvedProblems));
            setNotes(new Map(Object.entries(userData.notes).map(([key, value]) => [Number(key), value as string])));
            setDataLoading(false);
        }
    }, [isLoaded, user]);
    
    useEffect(() => {
        if (openTopic) {
            const element = document.getElementById(`topic-${openTopic}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [openTopic]);

    const handleToggleProblem = useCallback(async (id: number) => {
        if (!user) return;
        const newSet = new Set(solvedProblems);
        const isSolved = newSet.has(id);
        if (isSolved) newSet.delete(id);
        else newSet.add(id);
        setSolvedProblems(newSet);
        await updateProblemStatus(user, id, !isSolved);
    }, [solvedProblems, user]);

    const handleNoteChange = useCallback(async (id: number, text: string) => {
        if (!user) return;
        const newMap = new Map(notes);
        if (text.trim()) newMap.set(id, text);
        else newMap.delete(id);
        setNotes(newMap);
        await updateNote(user, id, text);
    }, [notes, user]);

    const handleResetProgress = useCallback(async () => {
        if (!user) return;
        setSolvedProblems(new Set());
        setNotes(new Map());
        await resetUserData(user);
    }, [user]);
    
    const handleSelectProblemFromDashboard = (problemId: number) => {
        const topicForProblem = sdeSheet.find(t => t.problems.some(p => p.id === problemId));
        if (topicForProblem) {
            setOpenTopic(topicForProblem.title);
        }
    };

    const totalProblems = useMemo(() => sdeSheet.reduce((acc, topic: Topic) => acc + topic.problems.length, 0), []);

    const filteredTopics = useMemo(() => {
        if (!searchQuery.trim()) return sdeSheet;
        const lowercasedQuery = searchQuery.toLowerCase();
        return sdeSheet
            .map(topic => ({
                ...topic,
                problems: topic.problems.filter(problem => problem.title.toLowerCase().includes(lowercasedQuery)),
            }))
            .filter(topic => topic.problems.length > 0);
    }, [searchQuery]);

    const firstUnsolvedTopicIndex = useMemo(() => {
        if (searchQuery) return -1;
        const index = sdeSheet.findIndex(topic => topic.problems.some(p => !solvedProblems.has(p.id)));
        return index;
    }, [solvedProblems, searchQuery]);

    const allProblemsSolved = solvedProblems.size === totalProblems && totalProblems > 0;

    if (!isLoaded || dataLoading) {
        return (
             <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }
    
    if (view === 'profile') {
        return (
            <ProfilePage
                user={user}
                sdeSheet={sdeSheet}
                solvedProblems={solvedProblems}
                onNavigateBack={() => setView('tracker')}
            />
        )
    }

    return (
        <div className="bg-transparent text-light min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <Header 
                    totalSolved={solvedProblems.size} 
                    totalProblems={totalProblems} 
                    onReset={handleResetProgress}
                    onNavigateToProfile={() => setView('profile')}
                />
                
                <Dashboard 
                    topics={sdeSheet} 
                    solvedProblems={solvedProblems} 
                    onSelectProblem={handleSelectProblemFromDashboard}
                />
                
                <SearchFilter 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <main className="mt-6 space-y-4">
                    {allProblemsSolved && (
                        <div className="bg-primary/80 border border-border rounded-lg p-8 text-center animate-fade-in-up backdrop-blur-lg">
                            <h2 className="text-2xl font-bold text-accent">Congratulations!</h2>
                            <p className="mt-2 text-light">You have solved all the problems. Great job!</p>
                        </div>
                    )}

                    {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic: Topic, index) => {
                            const originalIndex = sdeSheet.findIndex(t => t.title === topic.title);
                            const isInitiallyOpen = !searchQuery && (topic.title === openTopic || originalIndex === firstUnsolvedTopicIndex);
                            return (
                                <TopicCard 
                                    key={topic.title}
                                    topic={topic}
                                    solvedProblems={solvedProblems}
                                    onToggleProblem={handleToggleProblem}
                                    onEditNote={setEditingProblem}
                                    initiallyOpen={isInitiallyOpen}
                                    animationDelay={`${index * 50}ms`}
                                />
                            );
                        })
                    ) : (
                        !allProblemsSolved && (
                            <div className="text-center py-10 animate-fade-in-up">
                                <p className="text-dark-text">No problems found for "{searchQuery}"</p>
                            </div>
                        )
                    )}
                </main>
                 <footer className="text-center py-8 mt-8 text-dark-text">
                    <p>Track your progress. Master DSA. All data saved to your account.</p>
                </footer>
            </div>
            <NoteModal 
                problem={editingProblem}
                note={editingProblem ? notes.get(editingProblem.id) : undefined}
                isOpen={!!editingProblem}
                onClose={() => setEditingProblem(null)}
                onSave={handleNoteChange}
            />
        </div>
    );
};


const App: React.FC = () => {
    return (
        <>
            <SignedIn>
                <MainApp />
            </SignedIn>
            <SignedOut>
                <Auth />
            </SignedOut>
        </>
    );
};

export default App;