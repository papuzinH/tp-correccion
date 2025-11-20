import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ icon, children, className, variant = 'primary', ...props }) => {
  const variantClass = variant === 'secondary' ? styles.secondary : '';

  return (
    <button 
      className={`${styles.button} ${variantClass} ${className || ''}`} 
      {...props}
    >
      {icon && <span className={styles.iconWrapper}>{icon}</span>}
      {children}
    </button>
  );
};
