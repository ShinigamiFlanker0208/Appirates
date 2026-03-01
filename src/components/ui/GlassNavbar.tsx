"use client";

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';
import Link from "next/link";
import { usePathname } from 'next/navigation';

const navItems = [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Events", href: "/events" },
    { label: "Team", href: "/team" },
];

export const GlassNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const scrolled = latest > 50;
        if (scrolled !== isScrolled) {
            setIsScrolled(scrolled);
        }
    });

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
                "fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-out px-2 md:px-4",
                isScrolled ? "top-4" : "top-8"
            )}
        >
            <nav aria-label="Main Navigation">
                <GlassCard
                    className={cn(
                        "transition-all duration-500 ease-out relative z-50",
                        "bg-black/60 backdrop-blur-xl border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
                        isScrolled
                            ? "px-5 py-2 md:px-6 md:py-2.5 rounded-full"
                            : "px-6 py-3 md:px-8 md:py-4 rounded-full"
                    )}
                    hover={false}
                    padding="none"
                >
                    <div className={cn(
                        "flex items-center justify-between transition-all duration-500",
                        isScrolled ? "gap-6 md:gap-6" : "gap-8 md:gap-10"
                    )}>

                        {/* Branding / Logo */}
                        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded-md" aria-label="Home" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className={cn(
                                "flex items-center justify-center transition-all duration-500 group-hover:scale-110 shrink-0 bg-black rounded-lg p-1.5 shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                                isScrolled ? "w-10 h-10" : "w-12 h-12"
                            )}>
                                <img 
                                    src="/logo.PNG" 
                                    alt="Appirates Logo" 
                                    className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.5)] transition-all duration-300"
                                />
                            </div>

                            {/* Removed the 'hidden sm:block' and collapse logic to prevent overlap/layout jumps */}
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className={cn( 
                            'hidden md:flex items-center transition-all duration-500',
                            isScrolled ? 'gap-4 lg:gap-6' : 'gap-6 lg:gap-8'
                        )}>
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href as any}
                                        className="relative group py-2 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded"
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        {/* Original Text (Hides on hover) */}
                                        <span className="relative flex overflow-hidden">
                                            {item.label.split('').map((char, index) => (
                                                <span 
                                                    key={index} 
                                                    className={cn(
                                                        "inline-block text-[10px] font-bold uppercase tracking-[0.2em] transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[150%] group-hover:rotate-12",
                                                        isActive ? "text-white" : "text-white/60"
                                                    )}
                                                    style={{ transitionDelay: `${index * 0.01}s` }}
                                                >
                                                    {char === " " ? "\u00A0" : char}
                                                </span>
                                            ))}
                                        </span>

                                        {/* Hover Text (Reveals on hover) */}
                                        <span className="absolute left-0 top-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none" aria-hidden="true">
                                            {item.label.split('').map((char, index) => (
                                                <span 
                                                    key={index} 
                                                    className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-crimson transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-[150%] -rotate-12 group-hover:translate-y-0 group-hover:rotate-0"
                                                    style={{ transitionDelay: `${index * 0.01}s` }}
                                                >
                                                    {char === " " ? "\u00A0" : char}
                                                </span>
                                            ))}
                                        </span>
                                        
                                        {/* Active Indicator Dot */}
                                        {isActive && (
                                            <motion.div 
                                                layoutId="activeNavIndicator"
                                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-crimson rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" 
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Advanced CTA Button & Mobile Toggle Wrapper */}
                        <div className="flex items-center gap-3 md:gap-4">
                            {/* Premium Compact CTA Button */}
                            <Link 
                                href="/join"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "group relative flex items-center justify-center overflow-hidden rounded-full font-bold uppercase tracking-widest text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]",
                                    isScrolled 
                                        ? "h-8 px-4 text-[9px] bg-black/60 border border-crimson/50" 
                                        : "h-10 px-5 md:px-6 text-[10px] bg-black/40 border border-crimson/40"
                                )}
                            >
                                {/* Glowing ambient background that shifts on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-crimson/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Shimmering sweep effect */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />

                                {/* Text & Expanding Icon */}
                                <span className="relative z-10 flex items-center">
                                    <span className="mr-0 transition-all duration-300 group-hover:mr-2">Join</span>
                                    <svg 
                                        className="w-0 h-3 opacity-0 -translate-x-2 transition-all duration-300 ease-out group-hover:w-3 group-hover:opacity-100 group-hover:translate-x-0" 
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            </Link>

                            {/* Mobile Hamburger Toggle */}
                            <button 
                                className="md:hidden p-2 text-white hover:text-crimson focus:outline-none transition-colors"
                                onClick={toggleMobileMenu}
                                aria-label="Toggle mobile menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                    )}
                                </svg>
                            </button>
                        </div>

                    </div>
                </GlassCard>
            </nav>
        </motion.header>

        {/* Mobile Fullscreen Menu Overlay */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl md:hidden pt-28 px-6 pb-6 flex flex-col"
                >
                    <nav className="flex flex-col gap-6 mt-10">
                        {navItems.map((item, i) => {
                            const isActive = pathname === item.href;
                            return (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                >
                                    <Link
                                        href={item.href as any}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "text-2xl font-black uppercase tracking-widest block w-full py-4 border-b border-white/5",
                                            isActive ? "text-crimson" : "text-white/70 hover:text-white"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};