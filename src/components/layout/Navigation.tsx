'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import Button from '@/components/ui/Button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/subscribe', label: 'Subscribe' }
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  return (
    <header className="border-b border-border bg-white">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4" aria-label="Main navigation">
        <Link href="/" className="text-lg font-semibold">DataPulse</Link>
        <button
          aria-label="Toggle navigation"
          className="rounded-md border border-border p-2 md:hidden"
          onClick={() => setOpen(prev => !prev)}
        >
          ☰
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-secondary hover:text-foreground">
              {link.label}
            </Link>
          ))}
          {loading ? (
            <span className="text-sm text-secondary">Loading...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{user.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/subscribe" className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
      {open && (
        <div className="flex flex-col gap-4 border-t border-border px-6 py-4 md:hidden">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-secondary">
              {link.label}
            </Link>
          ))}
          {user ? (
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          ) : (
            <Link href="/subscribe" className="text-sm font-medium text-secondary">
              Sign up
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navigation;
