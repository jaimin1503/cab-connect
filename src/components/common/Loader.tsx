import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  const colorMap = {
    primary: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-500',
  };
  
  const containerClasses = `${sizeMap[size]} ${colorMap[color]} ${className}`;
  
  return (
    <div className={`flex justify-center items-center ${containerClasses}`}>
      <motion.div
        className="relative w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full border-2 border-current rounded-full opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-current rounded-full"></div>
      </motion.div>
    </div>
  );
};

export default Loader;