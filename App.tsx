
import React, { useCallback, useMemo } from 'react';
import Header from './components/Header';
import TopicCard from './components/TopicCard';
import useLocalStorage from './hooks/useLocalStorage';
import { sdeSheet } from './data/problems';
import type { Topic } from './types';

const App: React.FC = () => {
    const [solvedProblems, setSolvedProblems] = useLocalStorage<Set<number>>('solvedProblems', new Set());
    const [notes, setNotes] = useLocalStorage<Map<number, string>>('problemNotes', new Map());

    const handleToggleProblem = useCallback((id: number) => {
        setSolvedProblems(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, [setSolvedProblems]);

    const handleNoteChange = useCallback((id: number, text: string) => {
        setNotes(prevMap => {
            const newMap = new Map(prevMap);
            if (text.trim()) {
                newMap.set(id, text);
            } else {
                newMap.delete(id);
            }
            return newMap;
        });
    }, [setNotes]);

    const totalProblems = useMemo(() => sdeSheet.reduce((acc, topic: Topic) => acc + topic.problems.length, 0), []);

    const firstUnsolvedTopicIndex = useMemo(() => {
        // Find the index of the first topic that is not fully completed.
        const index = sdeSheet.findIndex(topic => {
            const solvedCount = topic.problems.filter(p => solvedProblems.has(p.id)).length;
            return solvedCount < topic.problems.length;
        });
        // If all topics are solved, index will be -1, and no topic will be open.
        // If the user is just starting, index will be 0.
        return index;
    }, [solvedProblems]);

    return (
        <div className="bg-background text-light min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <Header 
                    totalSolved={solvedProblems.size} 
                    totalProblems={totalProblems} 
                />
                <main className="mt-8 space-y-6">
                    {sdeSheet.map((topic: Topic, index: number) => (
                        <TopicCard 
                            key={topic.title}
                            topic={topic}
                            solvedProblems={solvedProblems}
                            onToggleProblem={handleToggleProblem}
                            notes={notes}
                            onNoteChange={handleNoteChange}
                            initiallyOpen={index === firstUnsolvedTopicIndex}
                        />
                    ))}
                </main>
                 <footer className="text-center py-8 mt-8 text-dark-text">
                    <p>Made with ❤️ by Mostakin Mondal</p>
                </footer>
            </div>
        </div>
    );
};

export default App;