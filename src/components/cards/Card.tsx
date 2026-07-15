import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = true, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        'bg-white border border-slate-100 rounded-xl p-5 shadow-sm transition-all duration-300',
        hoverable && 'hover:shadow-md hover:-translate-y-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
export default Card;
