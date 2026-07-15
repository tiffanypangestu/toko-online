import React from 'react';
import { twMerge } from 'tailwind-merge';

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'title' | 'circle' | 'card' | 'rect';
}

export function LoadingSkeleton({ className, variant = 'rect', ...props }: LoadingSkeletonProps) {
  const baseStyle = 'animate-pulse bg-slate-200 rounded';

  const variantStyles = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    circle: 'rounded-full h-10 w-10',
    rect: 'h-24 w-full',
    card: 'h-80 w-full rounded-xl',
  };

  return (
    <div
      className={twMerge(baseStyle, variantStyles[variant], className)}
      {...props}
    />
  );
}
export default LoadingSkeleton;
