'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const GlassCard = ({
                              children,
                              className,
                              hover = true,
                              padding = 'lg'
                          }: GlassCardProps) => {

    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-12',
    };

    return (
        <motion.div
            whileHover={hover ? { y: -8, scale: 1.01 } : {}}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={cn(
                // The Glass Layer
                "relative overflow-hidden rounded-2xl bg-black/30 backdrop-blur-2xl",

                // The Metallic Border
                "border border-white/10 shadow-2xl",

                // Metallic Highlight (Top Edge)
                "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-gray-400 before:to-transparent before:opacity-40",

                paddingClasses[padding],
                className
            )}
        >
            {/* 1. Brushed Metal Texture */}
            <div className="absolute inset-0 opacity-[0.07] bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] pointer-events-none mix-blend-overlay" />

            {/* 2. Soft Internal Crimson Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-crimson/5 to-transparent pointer-events-none" />

            {/* 3. Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};