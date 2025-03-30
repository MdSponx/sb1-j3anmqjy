import React from 'react';
import { LogOut, User, Settings, Shield, LayoutDashboard, FileEdit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFirebase } from '../../contexts/firebase';
import { useUserData } from '../../hooks/useUserData';
import { UserAvatar } from './UserAvatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

export function UserDropdownMenu() {
  const { user } = useAuth();
  const { auth } = useFirebase();
  const { language } = useLanguage();
  const { userData } = useUserData();

  const isAdmin = userData?.web_role === 'admin';
  const isEditor = userData?.web_role === 'editor';
  const hasContentAccess = isAdmin || isEditor;

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none">
          <UserAvatar className="h-8 w-8 hover:ring-2 hover:ring-red-500 transition-all cursor-pointer" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {user ? (
          <>
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-white truncate">
                {user.displayName || user.email}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-gray-700 my-1" />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleNavigation('/profile/public')}>
                <User className="mr-2 h-4 w-4" />
                <span>{language === 'th' ? 'โปรไฟล์สาธารณะ' : 'Public Profile'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation('/edit-profile')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{language === 'th' ? 'แก้ไขโปรไฟล์' : 'Edit Profile'}</span>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => handleNavigation('/admin')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>{language === 'th' ? 'แดชบอร์ด' : 'Dashboard'}</span>
                </DropdownMenuItem>
              )}
              {hasContentAccess && (
                <DropdownMenuItem onClick={() => handleNavigation('/admin/content')}>
                  <FileEdit className="mr-2 h-4 w-4" />
                  <span>{language === 'th' ? 'จัดการเนื้อหา' : 'Content Management'}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-gray-700 my-1" />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{language === 'th' ? 'ออกจากระบบ' : 'Sign Out'}</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleNavigation('/login')}>
              {language === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation('/register')}>
              {language === 'th' ? 'สมัครสมาชิก' : 'Register'}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}