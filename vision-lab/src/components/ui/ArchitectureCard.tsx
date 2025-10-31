/**
 * ArchitectureCard - Reusable card component for quick reference
 * Following design principles: Single responsibility, composable
 */
import { ReactNode } from 'react';

interface ArchitectureCardProps {
  title: string;
  icon?: string;
  children: ReactNode;
  className?: string;
}

export function ArchitectureCard({
  title,
  icon,
  children,
  className = '',
}: ArchitectureCardProps) {
  return (
    <div
      className={`bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && <span className="text-2xl">{icon}</span>}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="text-gray-300">{children}</div>
    </div>
  );
}

