import React from 'react';
import { User } from 'lucide-react';

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className = '' }: UserMenuProps) {
  return (
    <button 
      className={`p-2 text-white/80 hover:text-white transition-colors duration-200 ${className}`}
      aria-label="User menu"
    >
      <User className="h-5 w-5" />
    </button>
  );
}