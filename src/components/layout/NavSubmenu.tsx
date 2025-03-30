import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface NavSubmenuProps {
  isOpen: boolean;
  items: Array<{
    href: string;
    labelKey: string;
  }>;
  parentRef: React.RefObject<HTMLDivElement>;
}

export function NavSubmenu({ isOpen, items, parentRef }: NavSubmenuProps) {
  const { t } = useLanguage();
  const submenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && submenuRef.current && parentRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const submenuRect = submenuRef.current.getBoundingClientRect();
      
      // Check if submenu would go off-screen
      const viewportWidth = window.innerWidth;
      const overflowRight = parentRect.left + submenuRect.width > viewportWidth;
      
      if (overflowRight) {
        submenuRef.current.style.left = 'auto';
        submenuRef.current.style.right = '0';
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={submenuRef}
      className="
        absolute top-full left-1/2 -translate-x-1/2 mt-2 py-2 
        w-48 bg-black/90 backdrop-blur-md rounded-xl shadow-lg 
        ring-1 ring-white/10 z-50
        transform opacity-100 scale-100
        transition-all duration-200 ease-out
        origin-top
      "
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-8 border-transparent border-b-black/90" />
      <ul className="py-1">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="
                block px-4 py-2 
                text-sm text-white/80 
                hover:text-white hover:bg-white/10 
                transition-colors
              "
            >
              {t(item.labelKey)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}