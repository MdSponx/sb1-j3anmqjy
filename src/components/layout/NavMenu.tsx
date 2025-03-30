import React from 'react';
import { NavLink } from './NavLink';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface NavMenuItem {
  href: string;
  label: string;
  current: boolean;
  submenuItems?: Array<{
    href: string;
    labelKey: string;
  }>;
}

interface NavMenuProps {
  links: NavMenuItem[];
  mobile?: boolean;
}

export function NavMenu({ links, mobile = false }: NavMenuProps) {
  const { t } = useLanguage();

  if (mobile) {
    return (
      <div className="flex flex-col space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
        {links.map((link) => (
          <div key={`mobile-${link.label}`}>
            <a
              href={link.href}
              className={`
                block w-full px-4 py-2.5
                text-base font-medium
                rounded-lg
                transition-colors
                ${link.current 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <span className="flex items-center justify-between">
                {link.label}
                {link.submenuItems && <ChevronRight className="h-4 w-4" />}
              </span>
            </a>
            {link.submenuItems && (
              <div className="pl-4 mt-1 space-y-1">
                {link.submenuItems.map((subItem) => (
                  <a
                    key={`mobile-sub-${subItem.href}`}
                    href={subItem.href}
                    className="
                      block px-4 py-2
                      text-sm text-white/70
                      hover:text-white hover:bg-white/10
                      rounded-lg
                      transition-colors
                    "
                  >
                    {t(subItem.labelKey)}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {links.map((link) => (
        <NavLink
          key={`desktop-${link.label}`}
          href={link.href}
          current={link.current}
          submenuItems={link.submenuItems}
          className="
            text-xs sm:text-sm lg:text-base
            font-medium
            px-4 py-2
            rounded-full
            hover:bg-white/10
          "
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}