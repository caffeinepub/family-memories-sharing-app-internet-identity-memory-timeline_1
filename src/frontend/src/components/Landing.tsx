import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Heart, Image, Lock, Users } from 'lucide-react';

export default function Landing() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center mb-20">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Preserve Your Family's
            <span className="block text-primary mt-2">Precious Moments</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            Create a beautiful timeline of memories with your loved ones. Share photos, stories, and
            special moments in a secure, private space designed for families.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={login} disabled={isLoggingIn} size="lg" className="text-lg px-8">
              {isLoggingIn ? 'Signing in...' : 'Get Started'}
            </Button>
          </div>
        </div>

        <div className="relative">
          <img
            src="/assets/generated/family-memories-hero.dim_1600x900.png"
            alt="Family memories illustration"
            className="w-full rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-20">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">Share Memories</h3>
          <p className="text-sm text-muted-foreground">
            Create and share meaningful moments with your family members
          </p>
        </div>

        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Image className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">Photo Albums</h3>
          <p className="text-sm text-muted-foreground">
            Attach photos to your memories and build a visual timeline
          </p>
        </div>

        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">Secure & Private</h3>
          <p className="text-sm text-muted-foreground">
            Your memories are protected with blockchain-based authentication
          </p>
        </div>

        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">Family Friendly</h3>
          <p className="text-sm text-muted-foreground">
            Simple interface designed for all ages to use and enjoy
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-2xl bg-primary/5 p-8 text-center border border-primary/10">
        <h3 className="text-2xl font-bold mb-4">Ready to Start Sharing?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Sign in with Internet Identity to create your first memory. It's secure, private, and takes
          just seconds.
        </p>
        <Button onClick={login} disabled={isLoggingIn} size="lg">
          {isLoggingIn ? 'Signing in...' : 'Sign in to Continue'}
        </Button>
      </section>
    </div>
  );
}
