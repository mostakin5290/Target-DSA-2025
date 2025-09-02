import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Header from './components/Header';
import TopicCard from './components/TopicCard';
import SearchFilter from './components/SearchFilter';
import Auth from './components/Auth';
import Spinner from './components/Spinner';
import { useAuth } from './hooks/useAuth';
import { db } from './firebase/config';
// FIX: Update Firebase imports to v8 syntax for FieldValue.
// Fix: Corrected Firebase imports to use the v9 compatibility layer. This provides the v8 namespaced API and resolves errors where `firebase.firestore` was not found.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { sdeSheet } from './data/problems';
import type { Topic } from './types';

const TrackerApp: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [dataLoading, setDataLoading] = useState(true);
    const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
    const [notes, setNotes] = useState<Map<number, string>>(new Map());
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) {
            setDataLoading(false);
            setSolvedProblems(new Set());
            setNotes(new Map());
            return;
        }

        const fetchData = async () => {
            setDataLoading(true);
            // FIX: Use v8 syntax for document reference.
            const userDocRef = db.collection('users').doc(user.uid);
            try {
                // FIX: Use v8 syntax for getting a document.
                const docSnap = await userDocRef.get();
                if (docSnap.exists) {
                    const data = docSnap.data()!;
                    setSolvedProblems(new Set(data.solvedProblems || []));
                    // FIX: Convert Firestore object keys (string) to numbers for the notes Map.
                    setNotes(new Map(Object.entries(data.notes || {}).map(([key, value]) => [Number(key), value as string])));
                } else {
                    // New user, create document
                    // FIX: Use v8 syntax for setting a document.
                    await userDocRef.set({ solvedProblems: [], notes: {} });
                    setSolvedProblems(new Set());
                    setNotes(new Map());
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setDataLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleToggleProblem = useCallback(async (id: number) => {
        if (!user) return;

        const newSet = new Set(solvedProblems);
        // FIX: Use v8 syntax for document reference.
        const userDocRef = db.collection('users').doc(user.uid);

        if (newSet.has(id)) {
            newSet.delete(id);
            setSolvedProblems(newSet); // optimistic update
            // FIX: Use v8 syntax for updating a document with arrayRemove.
            await userDocRef.update({ solvedProblems: firebase.firestore.FieldValue.arrayRemove(id) });
        } else {
            newSet.add(id);
            setSolvedProblems(newSet); // optimistic update
            // FIX: Use v8 syntax for updating a document with arrayUnion.
            await userDocRef.update({ solvedProblems: firebase.firestore.FieldValue.arrayUnion(id) });
        }
    }, [solvedProblems, user]);

    const handleNoteChange = useCallback(async (id: number, text: string) => {
        if (!user) return;
        
        const newMap = new Map(notes);
        if (text.trim()) {
            newMap.set(id, text);
        } else {
            newMap.delete(id);
        }
        setNotes(newMap);

        // FIX: Use v8 syntax for document reference.
        const userDocRef = db.collection('users').doc(user.uid);
        if (text.trim()) {
            // FIX: Use v8 syntax for updating a document.
            await userDocRef.update({ [`notes.${id}`]: text });
        } else {
            // FIX: Use v8 syntax for updating a document with deleteField.
            await userDocRef.update({ [`notes.${id}`]: firebase.firestore.FieldValue.delete() });
        }
    }, [notes, user]);

    const handleResetProgress = useCallback(async () => {
        if (!user) return;

        setSolvedProblems(new Set());
        setNotes(new Map());
        
        // FIX: Use v8 syntax for document reference.
        const userDocRef = db.collection('users').doc(user.uid);
        // FIX: Use v8 syntax for setting a document.
        await userDocRef.set({ solvedProblems: [], notes: {} });
    }, [user]);

    const totalProblems = useMemo(() => sdeSheet.reduce((acc, topic: Topic) => acc + topic.problems.length, 0), []);

    const filteredTopics = useMemo(() => {
        if (!searchQuery.trim()) {
            return sdeSheet;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return sdeSheet
            .map(topic => ({
                ...topic,
                problems: topic.problems.filter(problem =>
                    problem.title.toLowerCase().includes(lowercasedQuery)
                ),
            }))
            .filter(topic => topic.problems.length > 0);
    }, [searchQuery]);

    const firstUnsolvedTopicIndex = useMemo(() => {
        const index = sdeSheet.findIndex(topic => {
            const solvedCount = topic.problems.filter(p => solvedProblems.has(p.id)).length;
            return solvedCount < topic.problems.length;
        });
        return index;
    }, [solvedProblems]);

    const allProblemsSolved = solvedProblems.size === totalProblems && totalProblems > 0;

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!user) {
        return <Auth />;
    }

    if (dataLoading) {
        return (
             <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="bg-transparent text-light min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <Header 
                    totalSolved={solvedProblems.size} 
                    totalProblems={totalProblems} 
                    onReset={handleResetProgress}
                />
                
                <SearchFilter 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <main className="mt-6 space-y-4">
                    {allProblemsSolved && (
                        <div className="bg-primary border border-border rounded-lg p-8 text-center animate-fade-in-up">
                            <h2 className="text-2xl font-bold text-accent">Congratulations!</h2>
                            <p className="mt-2 text-light">You have solved all the problems. Great job!</p>
                        </div>
                    )}

                    {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic: Topic, index) => {
                            const originalIndex = sdeSheet.findIndex(t => t.title === topic.title);
                            return (
                                <TopicCard 
                                    key={topic.title}
                                    topic={topic}
                                    solvedProblems={solvedProblems}
                                    onToggleProblem={handleToggleProblem}
                                    notes={notes}
                                    onNoteChange={handleNoteChange}
                                    initiallyOpen={!searchQuery && originalIndex === firstUnsolvedTopicIndex}
                                    animationDelay={`${index * 100}ms`}
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
        </div>
    );
};


const App: React.FC = () => {
    return <TrackerApp />;
};

export default App;
