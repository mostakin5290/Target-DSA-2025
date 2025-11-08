import React, { useCallback, useMemo, useState, useEffect, createContext, useContext } from 'react';
import Header from './components/Header';
import TopicCard from './components/TopicCard';
import SearchFilter from './components/SearchFilter';
import Auth from './components/Auth';
import Spinner from './components/Spinner';
import ProfilePage from './components/ProfilePage';
import Dashboard from './components/Dashboard';
import NoteModal from './components/NoteModal';
import { SignedIn, SignedOut, useUser, ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { sdeSheet, striverSdeSheet } from './data/problems';
import type { Topic, Problem } from './types';
import { getUserData, updateProblemStatus, updateNote, resetUserData } from './services/userData';

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

type SheetKey = 'sde' | 'striver';

const sheets = {
    sde: { key: 'sdeSheet', data: sdeSheet },
    striver: { key: 'striverSdeSheet', data: striverSdeSheet }
};

const TrackerApp: React.FC = () => {
    const { isLoaded, user } = useUser();
    const [dataLoading, setDataLoading] = useState(true);
    const [view, setView] = useState<'tracker' | 'profile'>('tracker');
    const [activeSheetKey, setActiveSheetKey] = useState<SheetKey>('sde');
    
    const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
    const [notes, setNotes] = useState<Map<number, string>>(new Map());
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
    const [openTopic, setOpenTopic] = useState<string | null>(null);

    const activeSheet = sheets[activeSheetKey];
    
    useEffect(() => {
        if (isLoaded && user) {
            setDataLoading(true);
            const userData = getUserData(user, activeSheet.key);
            setSolvedProblems(new Set(userData.solvedProblems));
            setNotes(new Map(Object.entries(userData.notes).map(([key, value]) => [Number(key), value as string])));
            setDataLoading(false);
        }
    }, [isLoaded, user, activeSheetKey]);
    
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
        await updateProblemStatus(user, id, !isSolved, activeSheet.key);
    }, [solvedProblems, user, activeSheet.key]);

    const handleNoteChange = useCallback(async (id: number, text: string) => {
        if (!user) return;
        const newMap = new Map(notes);
        if (text.trim()) newMap.set(id, text);
        else newMap.delete(id);
        setNotes(newMap);
        await updateNote(user, id, text, activeSheet.key);
    }, [notes, user, activeSheet.key]);

    const handleResetProgress = useCallback(async () => {
        if (!user) return;
        setSolvedProblems(new Set());
        setNotes(new Map());
        await resetUserData(user, activeSheet.key);
    }, [user, activeSheet.key]);
    
    const handleSelectProblemFromDashboard = (problemId: number) => {
        const topicForProblem = activeSheet.data.find(t => t.problems.some(p => p.id === problemId));
        if (topicForProblem) {
            setOpenTopic(topicForProblem.title);
        }
    };

    const totalProblems = useMemo(() => activeSheet.data.reduce((acc, topic: Topic) => acc + topic.problems.length, 0), [activeSheet.data]);

    const filteredTopics = useMemo(() => {
        if (!searchQuery.trim()) return activeSheet.data;
        const lowercasedQuery = searchQuery.toLowerCase();
        return activeSheet.data
            .map(topic => ({
                ...topic,
                problems: topic.problems.filter(problem => problem.title.toLowerCase().includes(lowercasedQuery)),
            }))
            .filter(topic => topic.problems.length > 0);
    }, [searchQuery, activeSheet.data]);

    const firstUnsolvedTopicIndex = useMemo(() => {
        if (searchQuery) return -1;
        const index = activeSheet.data.findIndex(topic => topic.problems.some(p => !solvedProblems.has(p.id)));
        return index;
    }, [solvedProblems, searchQuery, activeSheet.data]);

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
                sheet={activeSheet.data}
                solvedProblems={solvedProblems}
                onNavigateBack={() => setView('tracker')}
            />
        )
    }

    return (
        <div className="bg-transparent text-text-main min-h-screen font-sans">
            <div className="container mx-auto max-w-7xl p-4 md:p-8">
                <Header 
                    totalSolved={solvedProblems.size} 
                    totalProblems={totalProblems} 
                    onReset={handleResetProgress}
                    onNavigateToProfile={() => setView('profile')}
                    activeSheetKey={activeSheetKey}
                    onSheetChange={setActiveSheetKey}
                />
                
                <Dashboard 
                    topics={activeSheet.data} 
                    solvedProblems={solvedProblems} 
                    onSelectProblem={handleSelectProblemFromDashboard}
                />
                
                <SearchFilter 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <main className="mt-6 space-y-4">
                    {allProblemsSolved && (
                        <div className="bg-card/80 border border-border rounded-lg p-8 text-center animate-fade-in-up backdrop-blur-lg">
                            <h2 className="text-2xl font-bold text-accent">Congratulations!</h2>
                            <p className="mt-2 text-text-main">You have solved all the problems. Great job!</p>
                        </div>
                    )}

                    {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic: Topic, index) => {
                            const originalIndex = activeSheet.data.findIndex(t => t.title === topic.title);
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
                                <p className="text-text-secondary">No problems found for "{searchQuery}"</p>
                            </div>
                        )
                    )}
                </main>
                 <footer className="text-center py-8 mt-8 text-text-secondary">
                    <p>Track your progress. Master DSA. All data saved to your account.</p>
                    <p className="mt-2 text-sm">Made with ❤️ by Mostakin Mondal</p>
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
              colorPrimary: '#00f5c3',
              colorBackground: '#000000',
              colorText: '#e0e0e0',
              colorInputBackground: '#111111',
              colorInputText: '#e0e0e0',
              fontFamily: 'Inter, sans-serif',
            },
            elements: {
              card: { backgroundColor: '#121212', border: '1px solid #222222', boxShadow: 'none' },
              modalContent: { backgroundColor: '#121212', border: '1px solid #222222', boxShadow: '0 0 20px rgba(0, 245, 195, 0.1)' },
              socialButtonsBlockButton: { borderColor: '#222222', '&:hover': { backgroundColor: '#1c1c1c' } },
              dividerLine: { backgroundColor: '#222222' },
              formFieldInput: { backgroundColor: '#000000', borderColor: '#222222', '&:focus': { borderColor: '#00f5c3' } },
              formButtonPrimary: { backgroundColor: '#00f5c3', color: '#050505', '&:hover': { backgroundColor: '#00d1a7' }, '&:focus': { backgroundColor: '#00d1a7' }, '&:active': { backgroundColor: '#00d1a7' } },
              footerActionLink: { color: '#00f5c3', fontWeight: '500', '&:hover': { color: '#00d1a7', textDecoration: 'none' } },
              userButtonPopoverCard: { backgroundColor: '#121212', border: '1px solid #222222' },
              userButtonPopoverActionButton: { '&:hover': { backgroundColor: '#1c1c1c' } },
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
        <ThemeProvider defaultTheme="system" storageKey="dsa-tracker-theme">
            <ClerkAndApp />
        </ThemeProvider>
    );
};

export default App;
