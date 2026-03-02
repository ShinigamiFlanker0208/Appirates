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
                            ? "px-4 py-1.5 md:px-5 md:py-1.5 rounded-full"
                            : "px-5 py-2 md:px-7 md:py-2.5 rounded-full"
                    )}
                    hover={false}
                    padding="none"
                >
                    <div className={cn(
                        "flex items-center justify-between transition-all duration-500",
                        isScrolled ? "gap-6 md:gap-6" : "gap-8 md:gap-10"
                    )}>

                        {/* Branding / Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded-md" aria-label="Home" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className={cn(
                                "flex items-center justify-center transition-all duration-500 group-hover:scale-110 shrink-0 bg-black rounded-lg p-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                                isScrolled ? "w-7 h-7" : "w-8 h-8"
                            )}>
                                <img 
                                    src="/logo.PNG" 
                                    alt="Appirates Logo" 
                                    className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.5)] transition-all duration-300"
                                />
                            </div>

                            <AnimatePresence>
                                {!isScrolled && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0, x: -8 }}
                                        animate={{ opacity: 1, width: "auto", x: 0 }}
                                        exit={{ opacity: 0, width: 0, x: -8 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="text-white font-bold tracking-[0.25em] text-[11px] hidden sm:block overflow-hidden whitespace-nowrap"
                                    >
                                        APPIRATES
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className={cn( 
                            'hidden md:flex items-center transition-all duration-500',
                            isScrolled ? 'gap-5 lg:gap-6' : 'gap-5 lg:gap-7'
                        )}>
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href as any}
                                        className="relative group flex items-center py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded"
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        <span className={cn(
                                            "text-[10.5px] font-semibold uppercase tracking-widest leading-none transition-colors duration-200",
                                            isActive ? "text-white" : "text-white/50 group-hover:text-white/90"
                                        )}>
                                            {item.label}
                                        </span>

                                        {/* Underline indicator */}
                                        <span className="absolute bottom-0 left-0 h-px w-full overflow-hidden">
                                            <motion.span
                                                layoutId={isActive ? "activeUnderline" : undefined}
                                                className={cn(
                                                    "absolute inset-0 bg-crimson origin-left transition-transform duration-300",
                                                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                                )}
                                            />
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* CTA + Mobile Toggle */}
                        <div className="flex items-center gap-3">
                            {/* CTA Button */}
                            <Link 
                                href="/join"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "group relative inline-flex items-center justify-center overflow-hidden rounded-md bg-crimson text-white font-semibold uppercase tracking-widest leading-none transition-all duration-200 hover:brightness-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-1 focus-visible:ring-offset-black shrink-0",
                                    isScrolled 
                                        ? "h-6 px-3 text-[8.5px] gap-1" 
                                        : "h-7 px-3.5 text-[9px] gap-1.5"
                                )}
                            >
                                <span className="relative z-10">Join Us</span>
                                <svg 
                                    className="relative z-10 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" 
                                    width="8" height="8" viewBox="0 0 10 10" fill="none"
                                >
                                    <path d="M1 5h8M5.5 1.5L9 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
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
                    <nav className="flex flex-col mt-8">
                        {navItems.map((item, i) => {
                            const isActive = pathname === item.href;
                            return (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.3 }}
                                >
                                    <Link
                                        href={item.href as any}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center justify-between text-lg font-semibold uppercase tracking-widest w-full py-4 border-b border-white/10 transition-colors duration-150",
                                            isActive ? "text-white" : "text-white/40 hover:text-white/80"
                                        )}
                                    >
                                        {item.label}
                                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-crimson" />}
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