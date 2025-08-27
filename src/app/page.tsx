'use client';

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-xl w-full px-6 py-12">
        <h1 className="text-5xl font-extrabold mb-6">🚀 Hello AuraFine!</h1>

        <p className="text-gray-600 mb-8">
          Hot reload is working. Tailwind is too. Let’s test interactivity:
        </p>

        <button
          onClick={() => setCount((c) => c + 1)}
          className="rounded-xl px-5 py-3 bg-black text-white font-medium hover:bg-gray-800 transition"
        >
          Clicked {count} time{count === 1 ? '' : 's'}
        </button>
      </div>
    </main>
  );
}