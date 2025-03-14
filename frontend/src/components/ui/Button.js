import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  info: 'bg-blue-500 hover:bg-blue-600 text-white',
  light: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  dark: 'bg-gray-800 hover:bg-gray-900 text-white',
  outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50',
  link: 'bg-transparent text-primary-600 hover:underline',
};

const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-2.5 text-lg',
  xl: 'px-6 py-3 text-xl',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  animate = true,
  ...props
}) => {
  const buttonClasses = `
    inline-flex items-center justify-center
    font-medium rounded-md
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    ${variants[variant]}
    ${sizes[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={buttonClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (animate) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={buttonClasses}
        disabled={disabled}
        {...props}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <button className={buttonClasses} disabled={disabled} {...props}>
      {content}
    </button>
  );
};

export default Button; 