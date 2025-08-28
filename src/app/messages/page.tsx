// src/app/messages/page.tsx
import AddMessage from '../../components/AddMessage';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 0;            // no caching
export const dynamic = 'force-dynamic'; // always re-render on request

export default async function MessagesPage() {
  // create a fresh client per request to avoid stale data
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data, error } = await supabase
    .from('messages')
    .select('id, content, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-4 text-red-600">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Messages</h1>
      <AddMessage />
      <ul className="list-disc pl-6">
        {data?.map((m) => (
          <li key={m.id} className="mb-2">
            <div>{m.content}</div>
            <div className="text-xs text-gray-500">
              {new Date(m.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}