import { Variants, Transition } from "framer-motion";

// Shared easing + duration tokens
export const motionTransition: Transition = {
  duration: 0.6,
  ease: [0.21, 0.47, 0.32, 0.98],
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: motionTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: motionTransition },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: motionTransition },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: motionTransition },
};

export const staggerContainer = (stagger: number = 0.12): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.05,
    },
  },
});

export const scaleOnHover = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.97 },
};

