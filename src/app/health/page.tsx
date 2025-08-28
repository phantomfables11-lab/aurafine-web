'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase-browser';

type Row = {
  id: number;
  date: string;
  sleep_minutes: number;
  sleep_efficiency: number;
  resting_hr: number | null;
  steps: number | null;
};

export default function HealthPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [sleepMinutes, setSleepMinutes] = useState<number>(420);
  const [sleepEff, setSleepEff] = useState<number>(88);
  const [restingHr, setRestingHr] = useState<number>(59);
  const [steps, setSteps] = useState<number>(6500);

  const [rows, setRows] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);

  // fetch recent entries for this user
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('health_daily')
      .select('*')
      .order('date', { ascending: false })
      .limit(14)
      .then(({ data, error }) => {
        if (!error && data) setRows(data as Row[]);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/health/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          sleep_minutes: Number(sleepMinutes),
          sleep_efficiency: Number(sleepEff),
          resting_hr: Number(restingHr),
          steps: Number(steps),
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        alert(body.error || 'Save failed');
      } else {
        // re-fetch list
        const supabase = createClient();
        const { data } = await supabase
          .from('health_daily')
          .select('*')
          .order('date', { ascending: false })
          .limit(14);
        setRows((data as Row[]) ?? []);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Health — Add a Day</h1>

      <form onSubmit={save} className="space-y-5">
        <label className="block">
          <div className="mb-1 font-medium">Date</div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="mb-1 font-medium">Sleep minutes</div>
          <input
            type="number"
            value={sleepMinutes}
            onChange={(e) => setSleepMinutes(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="mb-1 font-medium">Sleep efficiency</div>
          <input
            type="number"
            value={sleepEff}
            onChange={(e) => setSleepEff(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="mb-1 font-medium">Resting HR</div>
          <input
            type="number"
            value={restingHr}
            onChange={(e) => setRestingHr(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <div className="mb-1 font-medium">Steps</div>
          <input
            type="number"
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </label>

        <button
          disabled={saving}
          className="bg-black text-white rounded px-4 py-2 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mb-4">Recent entries</h2>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="border rounded p-3">
            <div className="font-medium">{r.date}</div>
            <div className="text-sm text-gray-600">
              Sleep: {r.sleep_minutes} min, Eff: {r.sleep_efficiency}%, Resting HR: {r.resting_hr ?? '-'}
              , Steps: {r.steps ?? '-'}
            </div>
          </li>
        ))}
        {rows.length === 0 && <div className="text-gray-500">No entries yet.</div>}
      </ul>
    </div>
  );
}