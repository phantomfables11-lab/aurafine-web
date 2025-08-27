// src/app/login/page.tsx
'use client';
import { useState } from 'react';
import { createClient } from '../../lib/supabase-browser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined'
          ? window.location.origin  // redirects back to your site
          : undefined,
      },
    });
    if (error) alert(error.message);
    else setSent(true);
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Log in</h1>
      {sent ? (
        <p>Check your email for the magic link.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border p-2"
            required
          />
          <button className="rounded-lg border px-4 py-2 hover:bg-gray-100">
            Send magic link
          </button>
        </form>
      )}
    </div>
  );
}