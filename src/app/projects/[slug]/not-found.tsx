import Link from "next/link";

export default function ProjectSlugNotFound() {
  return (
    <main className="min-h-screen pt-28 px-4 md:px-6 pb-12">
      <div className="max-w-5xl mx-auto py-20 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">Project not found</h1>
        <p className="text-gray-400 mb-8">This project may be unpublished, archived, or removed.</p>
        <Link
          href="/projects"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-crimson text-white font-semibold uppercase tracking-widest text-xs"
        >
          Back to projects
        </Link>
      </div>
    </main>
  );
}