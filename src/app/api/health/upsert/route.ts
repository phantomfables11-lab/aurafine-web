// src/app/api/health/upsert/route.ts
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function POST(req: Request) {
  // Bridge Supabase auth to the server using Next.js cookies
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Must be logged in (uses the cookie above)
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Read body
  const {
    date,
    sleep_minutes,
    sleep_efficiency,
    resting_hr,
    steps,
  } = await req.json()

  // Upsert on (user_id, date)
  const { error } = await supabase
    .from('health_daily')
    .upsert(
      {
        user_id: user.id,
        date,
        sleep_minutes,
        sleep_efficiency,
        resting_hr,
        steps,
      },
      { onConflict: 'user_id,date' }
    )

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  return Response.json({ ok: true })
}