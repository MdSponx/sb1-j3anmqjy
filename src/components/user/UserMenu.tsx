import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUserData } from '../../hooks/useUserData';
import { FileEdit, LayoutDashboard } from 'lucide-react';
import { DropdownMenuItem } from '../ui/dropdown-menu';

export function UserMenu() {
  const { language } = useLanguage();
  const { userData } = useUserData();
  const isAdmin = userData?.web_role === 'admin';
  const isEditor = userData?.web_role === 'editor';

  if (!isAdmin && !isEditor) return null;

  return (
    <>
      {isAdmin && (
        <DropdownMenuItem onClick={() => window.location.href = '/admin'}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>
            {language === 'th' ? 'แดชบอร์ด' : 'Dashboard'}
          </span>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem onClick={() => window.location.href = '/admin/content'}>
        <FileEdit className="mr-2 h-4 w-4" />
        <span>
          {language === 'th' ? 'จัดการเนื้อหา' : 'Content Management'}
        </span>
      </DropdownMenuItem>
    </>
  );
}