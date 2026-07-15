import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section className={twMerge('py-12 md:py-20', className)} {...props}>
      {children}
    </section>
  );
}
