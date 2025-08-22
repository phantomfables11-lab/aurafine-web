'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Daily = {
  sleep_minutes: number;
  steps: number;
  hrv_ms: number;
  resting_hr_bpm: number;
  active_energy_kcal: number;
};

const todayISO = () => new Date().toISOString().slice(0,10);

export default function Home() {
  const [userId, setUserId] = useState<string>('');
  const [date, setDate] = useState<string>(todayISO());
  const [data, setData] = useState<Daily>({
    sleep_minutes: 420, steps: 6000, hrv_ms: 40, resting_hr_bpm: 65, active_energy_kcal: 200
  });
  const [score, setScore] = useState<number|null>(null);
  const [actions, setActions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('aurafine_user');
    if (stored) { setUserId(stored); return; }
    (async () => {
      const { data, error } = await supabase.from('app_users').insert({}).select('id').single();
      if (!error && data?.id) { localStorage.setItem('aurafine_user', data.id); setUserId(data.id); }
    })();
  }, []);

  const setField = (k: keyof Daily) => (e: any) =>
    setData(prev => ({ ...prev, [k]: Number(e.target.value) }));

  const saveAndScore = async () => {
    if (!userId) return;
    setSaving(true);

    await supabase.from('health_daily').insert({
      user_id: userId, date, ...data
    }).select().single().catch(() => {});

    const res = await fetch(process.env.NEXT_PUBLIC_COACH_FUNCTION_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, date, ...data })
    });
    const out = await res.json();
    setScore(out.wellness_score || 0);
    setActions(out.plan || []);
    setSaving(false);
  };

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">AuraFine — Daily Check-in (Pilot)</h1>

      <label className="block mb-2">Date
        <input type="date" className="border p-2 w-full" value={date} onChange={e=>setDate(e.target.value)} />
      </label>

      <div className="grid grid-cols-1 gap-3">
        <label>Sleep Minutes
          <input type="number" className="border p-2 w-full" value={data.sleep_minutes} onChange={setField('sleep_minutes')}/>
        </label>
        <label>Steps
          <input type="number" className="border p-2 w-full" value={data.steps} onChange={setField('steps')}/>
        </label>
        <label>HRV (ms)
          <input type="number" className="border p-2 w-full" value={data.hrv_ms} onChange={setField('hrv_ms')}/>
        </label>
        <label>Resting HR (bpm)
          <input type="number" className="border p-2 w-full" value={data.resting_hr_bpm} onChange={setField('resting_hr_bpm')}/>
        </label>
        <label>Active Energy (kcal)
          <input type="number" className="border p-2 w-full" value={data.active_energy_kcal} onChange={setField('active_ene_
