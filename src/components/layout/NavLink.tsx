import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavSubmenu } from './NavSubmenu';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  current?: boolean;
  className?: string;
  submenuItems?: Array<{
    href: string;
    labelKey: string;
  }>;
}

export function NavLink({ 
  href, 
  children, 
  current = false, 
  className = '',
  submenuItems 
}: NavLinkProps) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const timeoutRef = useRef<number>();
  const linkRef = useRef<HTMLDivElement>(null);

  const hasSubmenu = submenuItems && submenuItems.length > 0;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsSubmenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsSubmenuOpen(false);
    }, 150); // Small delay to prevent menu from closing when moving to submenu
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={linkRef}
      className="relative" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a 
        href={href}
        className={`
          inline-flex items-center gap-1
          px-4 py-2
          text-sm
          rounded-full 
          transition-all duration-300
          ${current 
            ? 'text-white bg-white/10' 
            : 'text-white/80 hover:text-white hover:bg-white/10'
          }
          ${className}
        `}
      >
        {children}
        {hasSubmenu && (
          <ChevronDown 
            className={`
              h-4 w-4 transition-transform duration-200
              ${isSubmenuOpen ? 'rotate-180' : ''}
            `}
          />
        )}
      </a>
      {hasSubmenu && (
        <NavSubmenu 
          isOpen={isSubmenuOpen} 
          items={submenuItems}
          parentRef={linkRef}
        />
      )}
    </div>
  );
}