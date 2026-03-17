"use client";

import Link from "next/link";

export default function ProjectSlugError({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen pt-28 px-4 md:px-6 pb-12">
      <div className="max-w-5xl mx-auto py-20 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">Something went wrong</h1>
        <p className="text-gray-400 mb-8">We couldn't load this project right now.</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-crimson text-white font-semibold uppercase tracking-widest text-xs"
          >
            Retry
          </button>
          <Link
            href="/projects"
            className="inline-flex items-center px-5 py-2.5 rounded-full border border-white/20 text-white font-semibold uppercase tracking-widest text-xs"
          >
            Back to projects
          </Link>
        </div>
      </div>
    </main>
  );
}