'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase-browser';

const links = [
  { href: '/', label: 'Home' },
  { href: '/messages', label: 'Messages' },
  { href: '/health', label: 'Health' }, // ← added
];

export default function Navbar() {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Prime current session email
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? null);
    });

    // Keep in sync with auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evt, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
  };

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
        <span className="text-lg font-semibold">AuraFine</span>

        <ul className="flex items-center gap-2 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`rounded-full px-3 py-1 hover:bg-gray-100 ${
                  pathname === l.href ? 'font-semibold' : ''
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3 text-sm">
          {email ? (
            <>
              <span className="hidden sm:inline">{email}</span>
              <button
                onClick={signOut}
                className="rounded-full px-3 py-1 hover:bg-gray-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`rounded-full px-3 py-1 hover:bg-gray-100 ${
                pathname === '/login' ? 'font-semibold' : ''
              }`}
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}