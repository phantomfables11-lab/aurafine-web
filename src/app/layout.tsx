// src/app/layout.tsx
import '../styles/globals.css'; // if yours is already '../styles/globals.css', keep it
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'AuraFine',
  description: 'Next.js + Tailwind + Supabase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="min-h-dvh text-gray-900 antialiased">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}