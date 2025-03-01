import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  interactive = false
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';
  const interactiveClasses = interactive 
    ? 'cursor-pointer transition-all duration-200 hover:shadow-lg' 
    : '';
  
  const cardClasses = `${baseClasses} ${interactiveClasses} ${className}`;
  
  if (interactive) {
    return (
      <motion.div 
        className={cardClasses}
        onClick={onClick}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;