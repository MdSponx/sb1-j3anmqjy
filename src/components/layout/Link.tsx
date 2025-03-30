import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function Link({ href, children, className = '' }: LinkProps) {
  return (
    <a 
      href={href}
      className={`text-white hover:text-gray-300 transition-colors duration-200 ${className}`}
    >
      {children}
    </a>
  );
}