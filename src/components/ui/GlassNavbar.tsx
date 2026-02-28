'use client';

import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';
import Link from "next/link";

export const GlassNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const navItems = [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Events", href: "/events" },
    { label: "Team", href: "/team" },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrolled = latest > 50;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  });

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out",
        isScrolled ? "top-4" : "top-8"
      )}
    >
      <GlassCard
        className={cn(
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "!bg-black/40 border-gray-500/30",
          isScrolled
            ? "px-6 py-2 !rounded-2xl bg-black/80 backdrop-blur-xl border-white/10 shadow-metal"
            : "px-10 py-4 !rounded-full"
        )}
        hover={false}
        padding="none"
      >
        <div
          className={cn(
            "flex items-center transition-all duration-500",
            isScrolled ? "gap-4" : "gap-10"
          )}
        >

          {/* ================== BRANDING (Clickable) ================== */}
          <Link href="/" className="flex items-center gap-3">

            <div
              className={cn(
                "rounded-md bg-crimson flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all duration-500",
                isScrolled ? "w-6 h-6" : "w-8 h-8"
              )}
            >
              <span className="font-bold text-white text-[10px]">A</span>
            </div>

            <span
              className={cn(
                "font-bold tracking-widest text-white uppercase text-xs transition-all duration-500",
                isScrolled ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
              )}
            >
              Appirates
            </span>

          </Link>

          {/* ================== NAV LINKS ================== */}
          <div
            className={cn(
              'hidden md:flex items-center transition-all duration-500',
              isScrolled ? 'gap-6' : 'gap-8'
            )}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-crimson transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* ================== JOIN BUTTON (Fixed) ================== */}
          <Link
            href="/join"
            className={cn(
              "text-[10px] font-black uppercase tracking-widest text-white border border-crimson/50 rounded-full hover:bg-crimson transition-all duration-500",
              isScrolled ? "px-4 py-1.5 bg-crimson/10" : "px-6 py-2"
            )}
          >
            Join Crew
          </Link>

        </div>
      </GlassCard>
    </motion.div>
  );
};