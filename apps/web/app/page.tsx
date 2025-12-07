// apps/web/app/page.tsx
'use client';

import React from 'react';
import { AlignChat } from '@/src/components/AlignChat';

export default function HomePage() {
    return (
    <main className="min-h-screen bg-[#050816] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">
                ALIGN
          </h1>
          <p className="text-sm md:text-base text-slate-400">
            One place to untangle your thoughts, get a plan, and move.
          </p>
        </div>
        <AlignChat 
          userId={null} // TODO: Get from auth
          userTier="free" // TODO: Get from user profile
          apiBaseUrl="/api/align"
        />
      </div>
    </main>
  );
}
