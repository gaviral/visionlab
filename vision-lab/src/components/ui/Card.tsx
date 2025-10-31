/**
 * Card - Professional reusable card component
 * Following design principles: Single responsibility, composable, enterprise-grade
 */
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const baseStyles =
    'bg-gray-800 border border-gray-700 rounded-lg p-5 transition-all duration-150';

  const hoverStyles = hover
    ? 'hover:border-gray-600 hover:bg-gray-800/80 cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
