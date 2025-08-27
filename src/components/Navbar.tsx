// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/messages', label: 'Messages' },
  { href: '/login', label: 'Login' }, // Auth page we'll add next
];

export default function Navbar() {
  const pathname = usePathname();
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
      </nav>
    </header>
  );
}