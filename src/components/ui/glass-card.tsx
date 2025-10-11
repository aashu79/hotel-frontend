import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'medium' | 'heavy';
  hover?: boolean;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  variant = 'medium', 
  hover = false, 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-300',
        {
          'glass-light': variant === 'light',
          'glass-medium': variant === 'medium', 
          'glass-heavy': variant === 'heavy',
          'glass-hover': hover,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};