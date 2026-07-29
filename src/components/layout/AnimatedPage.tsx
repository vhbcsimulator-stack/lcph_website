import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
