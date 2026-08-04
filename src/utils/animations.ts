import type { Variants } from 'framer-motion';

// Page-level transition animation
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: [0.2, 0, 0, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.24,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// Fade in and slide up when scrolling into view
export const fadeInUp = (duration = 0.5, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: [0.2, 0, 0, 1],
    },
  },
});

// Fade in and slide from left when scrolling into view
export const fadeInLeft = (duration = 0.5, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration,
      delay,
      ease: [0.2, 0, 0, 1],
    },
  },
});

// Fade in and slide from right when scrolling into view
export const fadeInRight = (duration = 0.5, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration,
      delay,
      ease: [0.2, 0, 0, 1],
    },
  },
});

// Stagger child elements inside a container
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Scale up fade-in transition
export const scaleUp = (duration = 0.4, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: [0.2, 0, 0, 1],
    },
  },
});

// Accordion collapse/expand transition
export const accordionTransition: Variants = {
  collapsed: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.16,
      ease: [0.4, 0, 1, 1],
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.2, 0, 0, 1],
    },
  },
};
