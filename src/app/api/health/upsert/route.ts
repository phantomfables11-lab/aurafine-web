// src/app/api/health/upsert/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: Request) {
  // Create a *server* client that carries the user's auth cookie
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  const user = userData?.user;

  if (userErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  // Always write the authenticated user's id
  const row = {
    user_id: user.id,
    date: body.date,
    sleep_minutes: body.sleep_minutes,
    sleep_efficiency: body.sleep_efficiency,
    resting_hr: body.resting_hr,
    steps: body.steps,
  };

  const { error } = await supabase
    .from('health_daily')
    .upsert(row, { onConflict: 'user_id,date' }); // prevents duplicates per day

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}