"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';
import NextImage from 'next/image';

type EventType = {
  id: string;
  title: string;
  description: string;
  mentor: string;
  startDate: string;
  endDate: string;
  imageUrls?: string[];
  category?: string;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const categories = ["All", "Web Dev", "Mobile Dev", "AI & IoT"];

const EventCard = ({ event }: { event: EventType }) => {
    const displayDate = event.endDate && event.startDate !== event.endDate
        ? `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`
        : formatDate(event.startDate);
        
    const imageSrc = event.imageUrls && event.imageUrls.length > 0 ? event.imageUrls[0] : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ 
                duration: 0.2,
                layout: { type: "spring", stiffness: 500, damping: 40 } 
            }}
            className="group relative flex w-full h-full"
        >
            <GlassCard hover={false} padding="none" className="flex flex-col h-full w-full relative overflow-hidden rounded-2xl md:rounded-3xl !bg-black/20 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(220,38,38,0.1)] hover:border-white/20">
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden shrink-0 bg-white/5">
                    <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-transparent transition-colors duration-500" />
                    {imageSrc && (
                        <NextImage
                            src={imageSrc}
                            alt={event.title || "Event Image"}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.21,0.47,0.32,0.98)]"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                    
                    {/* Category Tag on Image */}
                    {event.category && (
                        <div className="absolute top-4 left-4 z-20">
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white/90 shadow-sm">
                                {event.category}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="relative z-20 flex-1 flex flex-col p-6 md:p-8 bg-black/40 backdrop-blur-md -mt-4 rounded-t-3xl border-t border-white/5">
                    <div className="flex-1">
                        <p className="text-crimson font-bold text-[10px] tracking-widest uppercase mb-2">
                            {displayDate}
                        </p>
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-1 group-hover:text-crimson transition-colors duration-300">
                            {event.title}
                        </h3>
                        <p className="text-xs text-gray-300 mb-5 tracking-wide font-light line-clamp-4 leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    {/* Footer */}
                    {event.mentor && (
                        <div className="pt-5 border-t border-white/10 mt-auto">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                                Mentor(s): {event.mentor}
                            </p>
                        </div>
                    )}
                </div>
            </GlassCard>
        </motion.div>
    );
};

export default function EventsPage() {
    const [events, setEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const q = query(
                    collection(db, "events"),
                    orderBy("createdAt", "desc")
                );

                const snapshot = await getDocs(q);

                const data: EventType[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<EventType, "id">),
                }));

                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const matchesSearch = 
                event.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.mentor?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [events, searchQuery, selectedCategory]);

    return (
        <main className="relative min-h-screen overflow-hidden flex flex-col">

            <div className="relative z-10 flex flex-col min-h-screen flex-1">
                <div className="flex-1 flex flex-col pt-32 pb-12 px-4 md:px-6">
                    {/* High-Impact Editorial Header Section */}
                    <div className="max-w-6xl mx-auto w-full mb-10 md:mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="max-w-2xl"
                        >
                            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                                <div className="h-px w-8 md:w-12 bg-crimson" />
                                <span className="text-crimson font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs">
                                    Chronicles
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
                                Appirates <br className="hidden md:block"/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-700 pr-1">
                                    Workshops
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
                                Discover the hands-on sessions, expert masterclasses, and intensive bootcamps that equip our crew for the digital seas.
                            </p>
                        </motion.div>
                    </div>

                    {/* Filter & Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-6xl mx-auto w-full mb-10 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/5 pb-8"
                    >
                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search workshops..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-white rounded-full py-2.5 pl-10 pr-4 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-crimson/50 focus:bg-white/10 transition-all text-xs md:text-sm font-light placeholder-gray-500 shadow-inner"
                            />
                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap justify-center md:justify-end gap-2 w-full md:w-auto">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 border",
                                        selectedCategory === category 
                                            ? "bg-crimson border-crimson text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
                                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Grid Layout for Events */}
                    <div className="max-w-6xl mx-auto w-full">
                        {loading ? (
                            <div className="w-full py-20 text-center">
                                <div className="inline-block w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500 font-light text-sm">Loading events...</p>
                            </div>
                        ) : (
                            <>
                                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                    <AnimatePresence mode='popLayout'>
                                        {filteredEvents.map((event) => (
                                            <EventCard key={event.id} event={event} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Empty State */}
                                {!loading && filteredEvents.length === 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        className="w-full py-20 text-center"
                                    >
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4 text-gray-500">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">No events found</h3>
                                        <p className="text-gray-500 font-light text-sm">Try adjusting your search query or selected category.</p>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}