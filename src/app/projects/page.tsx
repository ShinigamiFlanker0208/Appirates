"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';
import { getPublishedProjects } from '@/lib/projects/service';
import type { Project } from '@/lib/projects/schema';

// Clean, minimalist arrow icon for micro-interactions
const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
);

// Tailwind classes mapping for CSS Grid spans. Added responsive scaling.
const sizeClasses = {
    large: "col-span-1 md:col-span-2 row-span-1 md:row-span-2",
    tall: "col-span-1 md:col-span-1 row-span-1 md:row-span-2",
    wide: "col-span-1 md:col-span-2 row-span-1",
    medium: "col-span-1 md:col-span-1 row-span-1",
    small: "col-span-1 md:col-span-1 row-span-1",
};

const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
    return (
        <Link
            href={`/projects/${project.slug}`}
            className={cn("group relative w-full h-full flex", sizeClasses[project.size as keyof typeof sizeClasses] ?? sizeClasses.small)}
        >
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="w-full h-full flex"
        >
            <GlassCard hover={false} padding="none" className="flex flex-col h-full w-full relative overflow-hidden rounded-2xl md:rounded-3xl !bg-black/20 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(220,38,38,0.1)] hover:border-white/20">
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0 bg-black">
                    <img
                        src={project.image.url}
                        alt={project.image.alt || project.title}
                        className="w-full h-full object-cover opacity-50 transition-transform duration-1000 ease-[cubic-bezier(0.21,0.47,0.32,0.98)] group-hover:scale-110 group-hover:opacity-60"
                    />
                    {/* Gradient Overlays for perfect text readability regardless of the image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10 opacity-70" />
                </div>

                {/* Content Section */}
                <div className="relative z-20 flex flex-col h-full justify-between p-5 md:p-6 lg:p-8">
                    
                    {/* Top Row: Tags & Interactive Arrow */}
                    <div className="flex justify-between items-start w-full">
                        <div className="flex flex-wrap gap-1.5 md:gap-2 pr-4">
                            {project.tags.map((tag: string, i: number) => (
                                <span
                                    key={i}
                                    className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider md:tracking-widest px-2.5 py-1 md:px-3 md:py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white/90 shadow-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:bg-crimson group-hover:border-crimson group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-500 shadow-sm">
                            <ArrowIcon />
                        </div>
                    </div>

                    {/* Bottom Row: Text content */}
                    <div className="mt-6 md:mt-8">
                        <h3 className={cn(
                            "font-bold md:font-black text-white uppercase tracking-tight mb-2 md:mb-3 transition-colors duration-300 group-hover:text-crimson",
                            project.size === 'large' ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl md:text-2xl"
                        )}>
                            {project.title}
                        </h3>
                        <p className={cn(
                            "text-gray-300 font-light leading-relaxed",
                            project.size === 'large' ? "text-sm md:text-base max-w-xl" : "text-xs md:text-sm line-clamp-2 md:line-clamp-3",
                            project.size === 'tall' && "line-clamp-4 md:line-clamp-5"
                        )}>
                            {project.description}
                        </p>
                    </div>

                </div>
            </GlassCard>
            </motion.div>
        </Link>
    );
};

export default function ProjectsPage() {
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getPublishedProjects();
                setProjects(data);
            } catch (fetchError) {
                console.error(fetchError);
                setError("Unable to load projects right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <main className="flex-1 flex flex-col relative pt-24 pb-12 px-4 md:px-6 min-h-screen">
            {/* Senior Level: High-Impact Editorial Header Section */}
            <div className="relative z-20 max-w-6xl mx-auto w-full mb-12 md:mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-2xl"
                >
                    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="h-px w-8 md:w-12 bg-crimson" />
                        <span className="text-crimson font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs">
                            Our Arsenal
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
                        Digital <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-700 pr-1">
                            Vessels
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="max-w-xs md:text-right pb-1 md:pb-2"
                >
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-light">
                        We don't just write code; we architect solutions. Explore the applications, platforms, and tools built by the Appirates crew to conquer the digital frontier.
                    </p>
                </motion.div>
            </div>

            {/* Senior Level: Modern Bento Box Grid Layout */}
            <div className="relative z-20 max-w-6xl mx-auto w-full">
                {loading ? (
                    <div className="w-full py-20 text-center">
                        <div className="inline-block w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-light text-sm">Loading projects...</p>
                    </div>
                ) : error ? (
                    <div className="w-full py-20 text-center">
                        <p className="text-crimson font-semibold text-sm">{error}</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="w-full py-20 text-center">
                        <p className="text-gray-400 font-light text-sm">No published projects yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[240px] md:auto-rows-[260px] lg:auto-rows-[280px] gap-4 md:gap-5 grid-flow-dense">
                        {projects.map((project, idx) => (
                            <ProjectCard key={project.id} project={project} index={idx} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
