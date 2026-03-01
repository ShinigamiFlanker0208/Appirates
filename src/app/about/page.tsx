"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlassCard } from '@/components/ui/GlassCard';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // 1. Initial Hero Animation
        gsap.fromTo('.hero-text', 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
        );
        
        gsap.fromTo('.hero-sub', 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 }
        );

        // 2. Wavy Water Text Reveal (Top to Bottom Line by Line)
        // Animate the wave horizontally infinitely
        gsap.to('.water-text', {
            backgroundPositionX: '1000px',
            ease: 'none',
            duration: 4,
            repeat: -1
        });

        // Animate the water filling top-to-bottom on scroll
        gsap.fromTo('.water-text', 
            { backgroundPositionY: '100%' }, // Transparent (bottom half of SVG)
            {
                backgroundPositionY: '0%', // White (top half of SVG)
                ease: 'none',
                scrollTrigger: {
                    trigger: '.mission-section',
                    start: 'top 80%',
                    end: 'bottom 70%',
                    scrub: 1,
                }
            }
        );

        // 3. Domains Cards Stagger
        gsap.fromTo('.domain-card', 
            { y: 40, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.domains-section',
                    start: 'top 80%',
                },
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.15,
                ease: "power3.out",
            }
        );

        // 4. Motive Section Fade
        gsap.fromTo('.motive-box',
            { scale: 0.95, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.motive-section',
                    start: 'top 80%',
                },
                scale: 1,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
            }
        );

        // 5. SHIP MOVEMENT DRIVER
        const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                // self.progress goes from 0 to 1 as we scroll down the entire page.
                // We map it so the ship sails progressively from left (15%) to right (85%)
                const percent = 0.15 + (self.progress * 0.70);
                
                // 3D Focus effect: scale up and move down as we scroll
                const scale = 2.0 + (self.progress * 8.0); // Grows from 2x to 10x
                const yOffset = self.progress * 80; // Pushes down as it gets closer

                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('setShipProgress', { 
                        detail: { percent, scale, yOffset } 
                    }));
                }
            }
        });

        return () => {
            st.kill();
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('resetShipProgress'));
            }
        };

    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="flex-1 flex flex-col relative min-h-screen overflow-hidden">
            
            {/* HERO SECTION */}
            <section className="min-h-screen flex flex-col justify-center items-center px-6 pt-20 text-center relative">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    <h1 className="hero-text text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[1.1] mb-6">
                        We Are <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson to-red-500 pr-2">
                            Appirates
                        </span>
                    </h1>
                    
                    <p className="hero-sub text-gray-400 text-sm md:text-base font-light max-w-xl leading-relaxed">
                        A tech community focused on learning, building, and shipping cool things. No fluff, just code.
                    </p>
                </div>

                {/* Scroll Indicator - Moved back to the absolute bottom of the screen */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 hero-sub opacity-0">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">Scroll</span>
                    <div className="w-px h-12 bg-gradient-to-b from-crimson to-transparent animate-pulse" />
                </div>
            </section>

            {/* THE MISSION (Wavy Water Reveal) */}
            <section className="mission-section min-h-[50vh] flex items-center justify-center px-6 py-16 bg-black/40 border-y border-white/5 relative z-10">
                <div className="max-w-4xl mx-auto w-full text-center">
                    {/* The Water Fill Text */}
                    <h2 
                        className="water-text text-2xl md:text-4xl lg:text-5xl font-bold leading-tight md:leading-tight mx-auto pb-4"
                        style={{
                            backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000"%3E%3Cpath d="M0,0 L1000,0 L1000,500 C875,540 625,460 500,500 C375,540 125,460 0,500 Z" fill="%23ffffff"/%3E%3C/svg%3E')`,
                            backgroundSize: "1000px 200%",
                            backgroundRepeat: "repeat",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "rgba(255, 255, 255, 0.15)",
                            backgroundPositionY: "100%" // Start transparent
                        }}
                    >
                        We believe knowledge isn't useful until you build something with it. We turn ideas into real, working products.
                    </h2>
                </div>
            </section>

            {/* DOMAINS */}
            <section className="domains-section py-20 px-6 relative z-10">
                <div className="max-w-5xl mx-auto w-full">
                    <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight mb-2">What We Build</h2>
                            <div className="w-12 h-1 bg-crimson mx-auto md:mx-0" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="domain-card opacity-0">
                            <GlassCard hover={false} padding="lg" className="h-full !bg-black/30 hover:border-white/20 transition-colors duration-500">
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Mobile Apps</h3>
                                <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed mb-6">
                                    Native and cross-platform mobile experiences that feel smooth and look amazing.
                                </p>
                                <span className="text-[10px] font-bold text-crimson uppercase tracking-widest">Android & iOS</span>
                            </GlassCard>
                        </div>
                        <div className="domain-card opacity-0">
                            <GlassCard hover={false} padding="lg" className="h-full !bg-black/30 hover:border-white/20 transition-colors duration-500">
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Web Platforms</h3>
                                <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed mb-6">
                                    Fast, scalable, and modern websites using the latest web frameworks.
                                </p>
                                <span className="text-[10px] font-bold text-crimson uppercase tracking-widest">Frontend & Backend</span>
                            </GlassCard>
                        </div>
                        <div className="domain-card opacity-0">
                            <GlassCard hover={false} padding="lg" className="h-full !bg-black/30 hover:border-white/20 transition-colors duration-500">
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Desktop Tools</h3>
                                <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed mb-6">
                                    Heavy-duty native applications and software for serious productivity.
                                </p>
                                <span className="text-[10px] font-bold text-crimson uppercase tracking-widest">System Architecture</span>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </section>

            {/* MOTIVE */}
            <section className="motive-section py-16 px-6 relative z-10 mb-12">
                <div className="max-w-5xl mx-auto w-full">
                    <div className="mb-10 text-center md:text-right flex flex-col md:items-end justify-between gap-4 md:flex-row-reverse">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight mb-2">How We Work</h2>
                            <div className="w-12 h-1 bg-crimson mx-auto md:mx-0 md:ml-auto" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="motive-box opacity-0">
                            <GlassCard padding="lg" className="h-full !bg-black/40 border-white/5">
                                <div className="text-crimson mb-4">
                                    <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2">1. Learn</h3>
                                <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed">
                                    We host workshops, bootcamps, and masterclasses. We don't just talk about theory; we write code together, make mistakes, and fix them in real-time.
                                </p>
                            </GlassCard>
                        </div>
                        <div className="motive-box opacity-0">
                            <GlassCard padding="lg" className="h-full !bg-black/40 border-white/5">
                                <div className="text-white mb-4">
                                    <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2">2. Build</h3>
                                <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed">
                                    Learning is half the journey. We team up to build open-source tools, community platforms, and paid projects to get real-world engineering experience.
                                </p>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}