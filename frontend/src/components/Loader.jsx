import React from 'react';

export function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-rose-500 border-t-transparent ${sizeClasses[size]} ${className}`}
      role="status"
    />
  );
}

export function MovieSkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl glass-panel p-3 space-y-3">
          <div className="aspect-[2/3] w-full rounded-xl skeleton-loading" />
          <div className="h-4 w-3/4 rounded skeleton-loading" />
          <div className="h-3 w-1/2 rounded skeleton-loading" />
          <div className="h-9 w-full rounded-xl skeleton-loading" />
        </div>
      ))}
    </div>
  );
}
