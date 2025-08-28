'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase-browser';

const links = [
  { href: '/', label: 'Home' },
  { href: '/messages', label: 'Messages' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // initial load
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    // keep in sync with auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  setEmail(null); // force UI to show "Login" immediately
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

        <div className="ml-auto flex items-center gap-3">
          {email ? (
            <>
              <span className="text-sm text-gray-600">{email}</span>
              <button
                onClick={signOut}
                className="rounded-full border px-3 py-1 text-sm hover:bg-gray-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-3 py-1 text-sm hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}