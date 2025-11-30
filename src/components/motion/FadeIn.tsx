import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for cleaner class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  viewportAmount?: number; // 0-1, how much of element must be visible
}

export default function FadeIn({ 
  children, 
  className, 
  delay = 0, 
  direction = 'up',
  duration = 0.5,
  viewportAmount = 0.3,
  ...props 
}: Props) {
  
  const getVariants = () => {
    const distance = 20;
    
    const initial: any = { opacity: 0 };
    if (direction === 'up') initial.y = distance;
    if (direction === 'down') initial.y = -distance;
    if (direction === 'left') initial.x = distance;
    if (direction === 'right') initial.x = -distance;

    const animate: any = { opacity: 1, x: 0, y: 0 };

    return {
      hidden: initial,
      visible: { 
        ...animate,
        transition: {
          duration,
          delay,
          ease: [0.21, 0.47, 0.32, 0.98] // Elegant spring-like curve
        }
      }
    };
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      variants={getVariants()}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

