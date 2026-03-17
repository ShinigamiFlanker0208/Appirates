"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { getProjectBySlug } from "@/lib/projects/service";
import type { Project } from "@/lib/projects/schema";

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        const data = await getProjectBySlug(slug);
        setProject(data);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Unable to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen pt-28 px-4 md:px-6 pb-12">
        <div className="max-w-5xl mx-auto py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-light text-sm">Loading project...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen pt-28 px-4 md:px-6 pb-12">
        <div className="max-w-5xl mx-auto py-20 text-center">
          <p className="text-crimson font-semibold text-sm">{error}</p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen pt-28 px-4 md:px-6 pb-12">
        <div className="max-w-5xl mx-auto py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">Project not found</h1>
          <p className="text-gray-400 mb-8">This project is unavailable or not published yet.</p>
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

  return (
    <main className="min-h-screen pt-28 px-4 md:px-6 pb-12">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center mb-6 text-xs uppercase tracking-widest text-crimson hover:text-white transition"
        >
          ← Back to projects
        </Link>

        <GlassCard className="overflow-hidden !bg-black/25" padding="none" hover={false}>
          <div className="relative h-[280px] md:h-[420px] w-full bg-black">
            <img
              src={project.image.url}
              alt={project.image.alt || project.title}
              className="h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">{project.title}</h1>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{project.content || project.description}</p>

            {(project.liveUrl || project.repoUrl) && (
              <div className="flex flex-wrap gap-3 mt-8">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-5 py-2.5 rounded-full bg-crimson text-white font-semibold uppercase tracking-widest text-xs"
                  >
                    Live demo
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-5 py-2.5 rounded-full border border-white/20 text-white font-semibold uppercase tracking-widest text-xs hover:border-crimson"
                  >
                    Source code
                  </a>
                )}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </main>
  );
}