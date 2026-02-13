import { useInternetIdentity } from './hooks/useInternetIdentity';
import Landing from './components/Landing';
import AppHeader from './components/AppHeader';
import MemoriesLayout from './components/memories/MemoriesLayout';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        {isAuthenticated ? <MemoriesLayout /> : <Landing />}
      </main>
      <footer className="border-t border-border bg-card py-6 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Family Memories. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'family-memories'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
