
import React from 'react';
import { Play } from 'lucide-react';

interface BrandHeaderProps {
  title: string;
  subtitle?: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

const BrandHeader = ({ title, subtitle, iconSize = 'md' }: BrandHeaderProps) => {
  const sizeClasses = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8' }
  };

  return (
    <div className="text-center">
      <div className={`${sizeClasses[iconSize].container} bg-white rounded-lg flex items-center justify-center mx-auto mb-4`}>
        <Play className={`${sizeClasses[iconSize].icon} text-black`} />
      </div>
      <h2 className="text-white text-2xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-white/80">{subtitle}</p>}
    </div>
  );
};

export default BrandHeader;
