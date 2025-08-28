// src/components/AddMessage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../lib/supabase-browser';

export default function AddMessage() {
  const [content, setContent] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, [supabase]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('messages').insert({
      content: content.trim(),
    });
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    setContent('');
    router.refresh(); // reloads the server-rendered list
  };

  if (!email) {
    return (
      <div className="mb-4 text-sm">
        <Link href="/login" className="underline">
          Log in
        </Link>{' '}
        to add a message.
      </div>
    );
  }

  return (
    <form onSubmit={add} className="mb-6 flex gap-2">
      <input
        className="flex-1 rounded border px-3 py-2"
        placeholder="Write a message…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />
      <button
        className="rounded border px-3 py-2 hover:bg-gray-100"
        disabled={loading}
      >
        {loading ? 'Adding…' : 'Add'}
      </button>
    </form>
  );
}