"use client";

import React, { useRef } from 'react';
import Link from "next/link";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlassCard } from '@/components/ui/GlassCard';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const stickySectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // --- 1. HERO ENTRANCE ---
        const tl = gsap.timeline();
        
        tl.fromTo('.hero-branding', 
            { y: 100, opacity: 0, letterSpacing: '0.5em' },
            { y: 0, opacity: 1, letterSpacing: '0.1em', duration: 1.5, ease: "expo.out", delay: 0.3 }
        )
        .fromTo('.hero-sub', 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 
            "-=0.8"
        )
        .fromTo('.hero-cta-btn',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)", stagger: 0.1 },
            "-=0.6"
        );

        // --- 2. SHIP MOVEMENT DRIVER (Link to StormBackground) ---
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                // Progressively sail and scale the ship based on scroll
                const percent = 0.75 - (self.progress * 0.5); // Move from right to left center
                const scale = 6.5 + (self.progress * 4.0); // Get closer
                const yOffset = self.progress * 50;
                
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('setShipProgress', { 
                        detail: { percent, scale, yOffset } 
                    }));
                }
            }
        });

        // --- 3. STICKY SCROLL REVEAL (Jaw-dropping interaction) ---
        // Pin the left side while the right side scrolls
        ScrollTrigger.create({
            trigger: stickySectionRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: '.sticky-left',
            pinSpacing: false,
        });

        // Animate the cards on the right as they enter
        gsap.utils.toArray('.scroll-card').forEach((card: any, i) => {
            gsap.fromTo(card,
                { opacity: 0, y: 100, scale: 0.9 },
                {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%", // trigger earlier
                        end: "top 40%",
                        scrub: 0.5, // lower scrub value makes it "snap" into place faster rather than slowly trailing
                    },
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    ease: "power2.out" // Use power ease for snappier finish
                }
            );
        });

        // --- 4. PARALLAX FOOTER ---
        gsap.fromTo('.footer-content', 
            { y: -100, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.footer-section',
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: 1,
                },
                y: 0,
                opacity: 1,
                ease: "none"
            }
        );

    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="flex-grow flex flex-col relative z-10 w-full overflow-hidden">
            
            {/* HERO SECTION - Minimal & Powerful */}
            <section className="hero-section relative min-h-screen w-full flex flex-col items-center justify-center px-6 text-center">
                <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
                    {/* Minimalist Badge */}
                    <div className="hero-sub inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-400 tracking-[0.3em] uppercase">
                            Expedition 2026
                        </span>
                    </div>

                    {/* The Branding Title */}
                    <h1 className="hero-branding text-[10vw] md:text-[8vw] font-black text-white uppercase tracking-widest leading-none mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        Appirates
                    </h1>

                    <p className="hero-sub max-w-xl text-gray-400 text-xs md:text-sm font-light tracking-wide uppercase mb-12">
                        Navigate the digital seas. <span className="text-white/80">Code. Design. Conquer.</span>
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/join" className="hero-cta-btn px-8 py-3 rounded-full bg-crimson text-white font-black uppercase tracking-widest text-[10px] md:text-xs hover:scale-105 hover:bg-red-500 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                            Join Crew
                        </Link>
                        <Link href="/projects" className="hero-cta-btn px-8 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/10 transition-all">
                            The Arsenal
                        </Link>
                    </div>
                </div>

                {/* Animated Scroll Hint */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hero-sub flex flex-col items-center gap-3">
                    <span className="text-[12px] uppercase tracking-[0.4em] text-gray-500 font-bold">Initiate Descent</span>
                    <div className="w-px h-16 bg-gradient-to-b from-gray-500 to-transparent animate-pulse" />
                </div>
            </section>

            {/* STICKY SCROLL SECTION (Jaw-dropping layout) */}
            <section ref={stickySectionRef} className="relative w-full px-6 md:px-12 py-32 flex flex-col md:flex-row gap-20">
                
                {/* Left Side: Sticky Header */}
                <div className="sticky-left w-full md:w-1/2 h-[50vh] md:h-screen flex flex-col justify-center">
                    <h2 className="text-5xl md:text-[4rem] lg:text-[6rem] font-black uppercase tracking-tighter leading-[0.9] text-white">
                        Core <br/>
                        <span className="text-gray-600">Directives.</span>
                    </h2>
                    <p className="mt-8 text-lg text-gray-400 max-w-md font-light">
                        Our engineering principles are not suggestions. They are hard-coded into every line we write.
                    </p>
                </div>

                {/* Right Side: Scrolling Cards */}
                <div className="w-full md:w-1/2 flex flex-col gap-32 pt-20 md:pt-[50vh] pb-[20vh]">
                    
                    <div className="scroll-card">
                        <GlassCard hover={false} padding="xl" className="border-white/10 !bg-black/40 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 text-5xl font-black text-white/5 pointer-events-none">01</div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Relentless Speed</h3>
                            <p className="text-gray-400 font-light text-base leading-relaxed">
                                We optimize for execution. Slow software is broken software. From V8 engines to browser rendering, we squeeze every millisecond.
                            </p>
                        </GlassCard>
                    </div>

                    <div className="scroll-card">
                        <GlassCard hover={false} padding="xl" className="border-white/10 !bg-black/40 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 text-5xl font-black text-white/5 pointer-events-none">02</div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Unapologetic UI</h3>
                            <p className="text-gray-400 font-light text-base leading-relaxed">
                                Basic layouts are dead. We architect experiences using complex grid systems, custom shaders, and physics-based micro-interactions.
                            </p>
                        </GlassCard>
                    </div>

                    <div className="scroll-card">
                        <GlassCard hover={false} padding="xl" className="border-white/10 !bg-black/40 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 text-5xl font-black text-white/5 pointer-events-none">03</div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">System Architecture</h3>
                            <p className="text-gray-400 font-light text-base leading-relaxed">
                                We don't just write scripts; we design robust, scalable, and secure infrastructures capable of surviving the harshest digital storms.
                            </p>
                        </GlassCard>
                    </div>

                </div>
            </section>

            {/* MASSIVE CTA FOOTER (Parallax Effect) */}
            <section className="footer-section relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-transparent">
                {/* Fading Gradient Divider with Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 md:w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20">
                    <div className="absolute inset-0 bg-crimson/30 blur-sm" />
                </div>
                
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-crimson/20 to-transparent mix-blend-overlay" />
                
                <div className="footer-content relative z-10 text-center px-6">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.8] text-white mix-blend-exclusion">
                        Ready To <br/> <span className="text-crimson">Set Sail?</span>
                    </h2>
                    <div className="mt-16">
                        <Link href="/join" className="group relative inline-flex items-center justify-center px-12 py-6 overflow-hidden rounded-full bg-white text-black font-black uppercase tracking-[0.2em] text-sm transition-all hover:scale-105">
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-crimson rounded-full group-hover:w-full group-hover:h-56"></span>
                            <span className="relative group-hover:text-white transition-colors duration-300">Join The Crew</span>
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
