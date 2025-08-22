'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Daily = {
  sleep_minutes: number;
  steps: number;
  hrv_ms: number;
  resting_hr_bpm: number;
  active_energy_kcal: number;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function Home() {
  const [userId, setUserId] = useState<string>('');
  const [date, setDate] = useState<string>(todayISO());
  const [data, setData] = useState<Daily>({
    sleep_minutes: 420,
    steps: 6000,
    hrv_ms: 40,
    resting_hr_bpm: 65,
    active_energy_kcal: 200,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      const { data: rows } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date);
      if (rows && rows.length > 0) setData(rows[0] as Daily);
    };
    fetchData();
  }, [userId, date]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daily Coach</h1>
      <p>Date: {date}</p>
      <p>Sleep: {data.sleep_minutes} minutes</p>
      <p>Steps: {data.steps}</p>
      <p>HRV: {data.hrv_ms} ms</p>
      <p>Resting HR: {data.resting_hr_bpm} bpm</p>
      <p>Active Energy: {data.active_energy_kcal} kcal</p>
    </main>
  );
}
