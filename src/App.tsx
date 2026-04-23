import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { onAuthStateChanged, signOutUser } from './firebase';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { ChatView } from './components/ChatView';
import { UploadView } from './components/UploadView';
import { RepositoryView } from './components/RepositoryView';
import type { View, UserProfile } from './types';

export default function App() {
  const [view, setView] = React.useState<View>('login');
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        });
        if (view === 'login') {
          setView('chat');
        }
      } else {
        setUser(null);
        setView('login');
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    setView('login');
  };

  // Loading state while checking auth
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-slate-200 border-t-black rounded-full animate-spin" />
          <p className="text-on-surface-variant font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Login page
  if (view === 'login' || !user) {
    return <LandingPage onLogin={() => setView('chat')} />;
  }

  const getTitle = () => {
    switch (view) {
      case 'chat':
        return 'Legal Assistant Chat';
      case 'upload':
        return 'Document Ingestion';
      case 'repository':
        return 'Indian Legal Repository';
      default:
        return 'Legal Assistant';
    }
  };

  return (
    <div className="flex h-screen bg-surface">
      <Sidebar
        currentView={view}
        setView={setView}
        user={user}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 md:ml-[280px] h-screen flex flex-col overflow-hidden relative">
        <TopNav title={getTitle()} user={user} />

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {view === 'chat' && <ChatView user={user} />}
              {view === 'upload' && <UploadView user={user} />}
              {view === 'repository' && <RepositoryView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
