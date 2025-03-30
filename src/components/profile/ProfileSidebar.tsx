import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUserData } from '../../hooks/useUserData';
import { 
  User, 
  Edit, 
  Shield, 
  LayoutDashboard, 
  Users, 
  FileEdit,
  Film,
  Award,
  FolderGit2,
  Calendar,
  Clapperboard,
  CheckSquare,
  Briefcase
} from 'lucide-react';

interface SidebarLink {
  icon: React.ReactNode;
  labelTh: string;
  labelEn: string;
  href: string;
  children?: SidebarLink[];
}

export function ProfileSidebar() {
  const { language } = useLanguage();
  const { userData } = useUserData();
  const currentPath = window.location.pathname;

  const isAdmin = userData?.web_role === 'admin';
  const isEditor = userData?.web_role === 'editor';
  const hasContentAccess = isAdmin || isEditor;
  const isDirector = userData?.occupation === 'director';

  const links: SidebarLink[] = [
    {
      icon: <User className="w-5 h-5" />,
      labelTh: 'โปรไฟล์สาธารณะ',
      labelEn: 'Public Profile',
      href: '/profile/public'
    },
    {
      icon: <Edit className="w-5 h-5" />,
      labelTh: 'แก้ไขโปรไฟล์',
      labelEn: 'Edit Profile',
      href: '/edit-profile'
    },
    {
      icon: <Clapperboard className="w-5 h-5" />,
      labelTh: 'ผลงานภาพยนตร์',
      labelEn: 'Movie Portfolio',
      href: '/profile/portfolio'
    }
  ];

  // Add Credit Confirmation link for directors and admins
  if (isDirector || isAdmin) {
    links.push({
      icon: <CheckSquare className="w-5 h-5" />,
      labelTh: 'รับรองเครดิตผลงาน',
      labelEn: 'Credit Confirmation',
      href: '/admin/content/credits'
    });
  }

  // Add admin section if user has admin role
  if (isAdmin) {
    links.push({
      icon: <Shield className="w-5 h-5" />,
      labelTh: 'จัดการระบบ',
      labelEn: 'Admin Console',
      href: '/admin',
      children: [
        {
          icon: <LayoutDashboard className="w-5 h-5" />,
          labelTh: 'แดชบอร์ด',
          labelEn: 'Dashboard',
          href: '/admin/dashboard'
        },
        {
          icon: <Users className="w-5 h-5" />,
          labelTh: 'คำขอสมัครสมาชิก',
          labelEn: 'Member Applications',
          href: '/admin/applications'
        },
        {
          icon: <Briefcase className="w-5 h-5" />,
          labelTh: 'คำขอสมัครทีมงาน',
          labelEn: 'Crew Applications',
          href: '/admin/crew-applications'
        },
        {
          icon: <Shield className="w-5 h-5" />,
          labelTh: 'จัดการสิทธิ์',
          labelEn: 'Role Management',
          href: '/admin/roles'
        }
      ]
    });
  }

  // Add content management section if user has access
  if (hasContentAccess) {
    links.push({
      icon: <FileEdit className="w-5 h-5" />,
      labelTh: 'จัดการเนื้อหา',
      labelEn: 'Content Management',
      href: '/admin/content',
      children: [
        {
          icon: <Film className="w-5 h-5" />,
          labelTh: 'ข้อมูลภาพยนตร์ไทย',
          labelEn: 'Thai Films Data',
          href: '/admin/content/films'
        },
        {
          icon: <Award className="w-5 h-5" />,
          labelTh: 'รางวัลสมาคมฯ',
          labelEn: 'TFDA Awards',
          href: '/admin/content/awards'
        },
        {
          icon: <FolderGit2 className="w-5 h-5" />,
          labelTh: 'โครงการ',
          labelEn: 'Projects',
          href: '/admin/content/projects'
        },
        {
          icon: <Calendar className="w-5 h-5" />,
          labelTh: 'กิจกรรม',
          labelEn: 'Events',
          href: '/admin/content/events'
        }
      ]
    });
  }

  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <React.Fragment key={link.href}>
          <a
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
          {link.children?.map(child => (
            <a
              key={child.href}
              href={child.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg ml-4
                transition-colors duration-200
                ${currentPath === child.href
                  ? 'bg-red-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              {child.icon}
              <span className="ml-3">
                {language === 'th' ? child.labelTh : child.labelEn}
              </span>
            </a>
          ))}
        </React.Fragment>
      ))}
    </nav>
  );
}