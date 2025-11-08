import React, { useCallback, useMemo, useState, useEffect, createContext, useContext } from 'react';
import Header from './components/Header';
import TopicCard from './components/TopicCard';
import SearchFilter from './components/SearchFilter';
import Auth from './components/Auth';
import Spinner from './components/Spinner';
import ProfilePage from './components/ProfilePage';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import NoteModal from './components/NoteModal';
import StudyPlanView from './components/StudyPlanView';
import Footer from './components/Footer';
import { SignedIn, SignedOut, useUser, ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { problemSheet } from './data/problems';
import type { Topic, Problem } from './types';
import { getUserData, updateProblemStatus, updateNote, resetUserData, updateProblemFavoriteStatus } from './services/userData';

// --- THEME PROVIDER START ---
type Theme = 'dark' | 'light' | 'system';
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

const ThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}> = ({ children, defaultTheme = 'system', storageKey = 'vite-ui-theme' }) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
// --- THEME PROVIDER END ---

type ActiveView = 'library' | 'favorites' | 'study-plan';
const SHEET_STORAGE_KEY = 'dsaPatternsSheet';

const TrackerApp: React.FC = () => {
    const { isLoaded, user } = useUser();
    const [dataLoading, setDataLoading] = useState(true);
    const [view, setView] = useState<'tracker' | 'profile'>('tracker');
    
    const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
    const [favoriteProblems, setFavoriteProblems] = useState<Set<number>>(new Set());
    const [notes, setNotes] = useState<Map<number, string>>(new Map());
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
    const [openTopic, setOpenTopic] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<ActiveView>('library');

    useEffect(() => {
        if (isLoaded && user) {
            setDataLoading(true);
            const userData = getUserData(user, SHEET_STORAGE_KEY);
            setSolvedProblems(new Set(userData.solvedProblems));
            setFavoriteProblems(new Set(userData.favoriteProblems));
            setNotes(new Map(Object.entries(userData.notes).map(([key, value]) => [Number(key), value as string])));
            setDataLoading(false);
        }
    }, [isLoaded, user]);
    
    useEffect(() => {
        if (openTopic) {
            const element = document.getElementById(`topic-${openTopic}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        await updateProblemStatus(user, id, !isSolved, SHEET_STORAGE_KEY);
    }, [solvedProblems, user]);

    const handleToggleFavorite = useCallback(async (id: number) => {
        if (!user) return;
        const newSet = new Set(favoriteProblems);
        const isFavorite = newSet.has(id);
        if (isFavorite) newSet.delete(id);
        else newSet.add(id);
        setFavoriteProblems(newSet);
        await updateProblemFavoriteStatus(user, id, !isFavorite, SHEET_STORAGE_KEY);
    }, [favoriteProblems, user]);

    const handleNoteChange = useCallback(async (id: number, text: string) => {
        if (!user) return;
        const newMap = new Map(notes);
        if (text.trim()) newMap.set(id, text);
        else newMap.delete(id);
        setNotes(newMap);
        await updateNote(user, id, text, SHEET_STORAGE_KEY);
    }, [notes, user]);

    const handleResetProgress = useCallback(async () => {
        if (!user) return;
        setSolvedProblems(new Set());
        setNotes(new Map());
        setFavoriteProblems(new Set());
        await resetUserData(user, SHEET_STORAGE_KEY);
    }, [user]);
    
    const handleSelectProblem = (problemId: number) => {
        const topicForProblem = problemSheet.find(t => t.problems.some(p => p.id === problemId));
        if (topicForProblem) {
            setOpenTopic(topicForProblem.title);
        }
    };
    
    const handleSelectProblemFromModal = (problemId: number) => {
        setEditingProblem(null);
        // Timeout to allow modal to close before scrolling
        setTimeout(() => handleSelectProblem(problemId), 100);
    };

    const allProblemsList = useMemo(() => problemSheet.flatMap(t => t.problems), []);
    const totalProblems = allProblemsList.length;
    const progressPercent = totalProblems > 0 ? (solvedProblems.size / totalProblems) * 100 : 0;

    const filteredTopics = useMemo(() => {
        let baseTopics = problemSheet;

        if (activeView === 'favorites') {
            baseTopics = problemSheet
                .map(topic => ({
                    ...topic,
                    problems: topic.problems.filter(problem => favoriteProblems.has(problem.id)),
                }))
                .filter(topic => topic.problems.length > 0);
        }

        if (!searchQuery.trim()) return baseTopics;

        const lowercasedQuery = searchQuery.toLowerCase();
        return baseTopics
            .map(topic => ({
                ...topic,
                problems: topic.problems.filter(problem => problem.title.toLowerCase().includes(lowercasedQuery)),
            }))
            .filter(topic => topic.problems.length > 0);
    }, [searchQuery, activeView, favoriteProblems]);

    const firstUnsolvedTopicIndex = useMemo(() => {
        if (searchQuery || activeView === 'favorites' || activeView === 'study-plan') return -1;
        const index = problemSheet.findIndex(topic => topic.problems.some(p => !solvedProblems.has(p.id)));
        return index;
    }, [solvedProblems, searchQuery, activeView]);

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
                sheet={problemSheet}
                solvedProblems={solvedProblems}
                onNavigateBack={() => setView('tracker')}
                onReset={handleResetProgress}
            />
        )
    }

    return (
        <div className="bg-background text-text-main min-h-screen font-sans flex flex-col">
            <Header 
                progressPercent={progressPercent}
                onNavigateToProfile={() => setView('profile')}
            />
            <div className="container mx-auto max-w-screen-2xl p-4 md:p-6 flex-grow">
                 <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-6">
                    <LeftSidebar activeView={activeView} setActiveView={setActiveView} />

                    <main>
                        {['library', 'favorites'].includes(activeView) && (
                            <SearchFilter 
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />
                        )}
                        <div className="mt-4">
                           {activeView === 'study-plan' ? (
                                <StudyPlanView
                                    allProblems={allProblemsList}
                                    solvedProblems={solvedProblems}
                                    onSelectProblem={(problemId) => {
                                        setActiveView('library');
                                        setTimeout(() => handleSelectProblem(problemId), 100);
                                    }}
                                />
                           ) : (
                                <div className="space-y-2">
                                    {allProblemsSolved && (
                                        <div className="bg-card border border-border rounded-lg p-8 text-center animate-fade-in-up">
                                            <h2 className="text-2xl font-bold text-accent">Congratulations!</h2>
                                            <p className="mt-2 text-text-main">You have solved all the problems. Great job!</p>
                                        </div>
                                    )}

                                    {filteredTopics.length > 0 ? (
                                        filteredTopics.map((topic: Topic, index) => {
                                            const originalIndex = problemSheet.findIndex(t => t.title === topic.title);
                                            const isInitiallyOpen = !searchQuery && (topic.title === openTopic || originalIndex === firstUnsolvedTopicIndex);
                                            return (
                                                <TopicCard 
                                                    key={topic.title}
                                                    topic={topic}
                                                    solvedProblems={solvedProblems}
                                                    favoriteProblems={favoriteProblems}
                                                    onToggleProblem={handleToggleProblem}
                                                    onToggleFavorite={handleToggleFavorite}
                                                    onEditNote={setEditingProblem}
                                                    initiallyOpen={isInitiallyOpen}
                                                    animationDelay={`${index * 50}ms`}
                                                />
                                            );
                                        })
                                    ) : (
                                        !allProblemsSolved && (
                                            <div className="text-center py-10 animate-fade-in-up">
                                                <p className="text-text-secondary">
                                                    {activeView === 'favorites' ? 'You have no favorite problems yet.' : `No problems found for "${searchQuery}"`}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                           )}
                        </div>
                    </main>

                    <RightSidebar 
                        topics={problemSheet}
                        solvedProblems={solvedProblems}
                        onSelectProblem={handleSelectProblem}
                    />
                </div>
            </div>
            <NoteModal 
                problem={editingProblem}
                allProblems={problemSheet.flatMap(t => t.problems)}
                note={editingProblem ? notes.get(editingProblem.id) : undefined}
                isOpen={!!editingProblem}
                onClose={() => setEditingProblem(null)}
                onSave={handleNoteChange}
                onSelectProblem={handleSelectProblemFromModal}
            />
            <div className="container mx-auto max-w-screen-2xl px-4 md:px-6">
                <Footer />
            </div>
        </div>
    );
};


const ClerkAndApp: React.FC = () => {
    const { theme } = useTheme();

    const PUBLISHABLE_KEY = 'pk_test_bWlnaHR5LXNwYXJyb3ctNjQuY2xlcmsuYWNjb3VudHMuZGV2JA';
    if (!PUBLISHABLE_KEY) {
      throw new Error("Missing Clerk Publishable Key.");
    }

    const effectiveTheme = theme === 'system' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') 
        : theme;

    const clerkAppearance = 
        effectiveTheme === 'dark' 
        ? {
            baseTheme: dark,
            variables: {
              colorPrimary: '#00af9b',
              colorBackground: '#0a0a0a',
              colorText: '#e0e0e0',
              colorInputBackground: '#111111',
              colorInputText: '#e0e0e0',
              fontFamily: 'Inter, sans-serif',
            },
            elements: {
              card: { backgroundColor: '#1a1a1a', border: '1px solid var(--border)', boxShadow: 'none' },
              modalContent: { backgroundColor: '#1a1a1a', border: '1px solid var(--border)', boxShadow: '0 0 20px rgba(0, 175, 155, 0.1)' },
              socialButtonsBlockButton: { borderColor: 'var(--border)', '&:hover': { backgroundColor: '#282828' } },
              dividerLine: { backgroundColor: 'var(--border)' },
              formFieldInput: { backgroundColor: '#0a0a0a', borderColor: 'var(--border)', '&:focus': { borderColor: 'var(--accent)' } },
              formButtonPrimary: { backgroundColor: 'var(--accent)', color: '#050505', '&:hover': { backgroundColor: 'var(--accent-hover)' }, '&:focus': { backgroundColor: 'var(--accent-hover)' }, '&:active': { backgroundColor: 'var(--accent-hover)' } },
              footerActionLink: { color: 'var(--accent)', fontWeight: '500', '&:hover': { color: 'var(--accent-hover)', textDecoration: 'none' } },
              userButtonPopoverCard: { backgroundColor: '#1a1a1a', border: '1px solid var(--border)' },
              userButtonPopoverActionButton: { '&:hover': { backgroundColor: '#282828' } },
              userButtonPopoverActionButtonText: { color: '#e0e0e0' }
            },
          }
        : {
            variables: {
              colorPrimary: 'var(--accent)',
              fontFamily: 'Inter, sans-serif',
            }
        };

    return (
        <ClerkProvider 
            publishableKey={PUBLISHABLE_KEY} 
            afterSignOutUrl="/"
            appearance={clerkAppearance}
        >
            <SignedIn>
                <TrackerApp />
            </SignedIn>
            <SignedOut>
                <Auth />
            </SignedOut>
        </ClerkProvider>
    );
}

const App: React.FC = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="dsa-tracker-theme">
            <ClerkAndApp />
        </ThemeProvider>
    );
};

export default App;