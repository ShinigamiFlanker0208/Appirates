"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createScrollReveal } from "@/motion/scroll";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  itemSelector: string;
};

export const ScrollReveal = ({
  children,
  className,
  itemSelector,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const cleanup = createScrollReveal({
      selector: itemSelector,
      container: ref.current,
    });
    return cleanup;
  }, [itemSelector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

