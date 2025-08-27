// src/app/messages/page.tsx
export const dynamic = 'force-dynamic';

import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default async function MessagesPage() {
  const { data, error } = await supabase
    .from('messages')
    .select('id, content, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return (
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <p className="text-red-600">Failed to load messages: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Link href="/" className="text-sm underline hover:no-underline">Home</Link>
      </div>

      {!data || data.length === 0 ? (
        <p className="text-gray-600">No messages yet.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((m) => (
            <li key={m.id} className="rounded-2xl border p-4 shadow-sm hover:shadow transition">
              <p className="text-base">{m.content}</p>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(m.created_at as string).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}