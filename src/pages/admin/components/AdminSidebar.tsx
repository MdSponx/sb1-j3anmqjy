import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { LayoutDashboard, Users, Shield } from 'lucide-react';

interface AdminLink {
  icon: React.ReactNode;
  labelTh: string;
  labelEn: string;
  href: string;
}

interface AdminSidebarProps {
  currentPath: string;
}

export function AdminSidebar({ currentPath }: AdminSidebarProps) {
  const { language } = useLanguage();

  const links: AdminLink[] = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      labelTh: 'แดชบอร์ด',
      labelEn: 'Dashboard',
      href: '/admin'
    },
    {
      icon: <Users className="w-5 h-5" />,
      labelTh: 'คำขอสมัครสมาชิก',
      labelEn: 'Member Applications',
      href: '/admin/applications'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      labelTh: 'จัดการสิทธิ์',
      labelEn: 'Role Management',
      href: '/admin/roles'
    }
  ];

  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`
            flex items-center px-4 py-3 text-sm font-medium rounded-lg
            transition-colors duration-200
            ${currentPath === link.href
              ? 'bg-red-500 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }
          `}
        >
          {link.icon}
          <span className="ml-3">
            {language === 'th' ? link.labelTh : link.labelEn}
          </span>
        </a>
      ))}
    </nav>
  );
}