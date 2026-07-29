import type { Variants } from 'framer-motion';

// Page-level transition animation
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier for smooth easing
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

// Fade in and slide up when scrolling into view
export const fadeInUp = (duration = 0.5, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: 'easeOut',
    },
  },
});

// Fade in and slide from left when scrolling into view
export const fadeInLeft = (duration = 0.5, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration,
      delay,
      ease: 'easeOut',
    },
  },
});

// Fade in and slide from right when scrolling into view
export const fadeInRight = (duration = 0.5, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration,
      delay,
      ease: 'easeOut',
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
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: 'easeOut',
    },
  },
});

// Accordion collapse/expand transition
export const accordionTransition: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
      opacity: { duration: 0.2 },
    },
  },
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
      opacity: { duration: 0.25, delay: 0.05 },
    },
  },
};
