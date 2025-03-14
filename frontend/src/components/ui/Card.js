import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  animate = true,
  padding = 'p-6',
  shadow = 'shadow-md',
  rounded = 'rounded-lg',
  ...props
}) => {
  const cardClasses = `
    bg-white 
    ${padding} 
    ${shadow} 
    ${rounded} 
    ${hover ? 'hover:shadow-lg transition-shadow duration-300' : ''}
    ${className}
  `;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cardClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card; 