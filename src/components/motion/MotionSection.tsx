"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "@/motion/variants";

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
};

export const MotionSection = ({ children, className }: MotionSectionProps) => {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer()}
    >
      {children}
    </motion.section>
  );
};

