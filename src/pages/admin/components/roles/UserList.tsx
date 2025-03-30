import React from 'react';
import { Button } from '../../../../components/ui/button';
import { RoleBadge } from './RoleBadge';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { AdminUser } from '../../types/admin';

interface UserListProps {
  users: AdminUser[];
  onRemoveRole: (userId: string) => Promise<void>;
}

export function UserList({ users, onRemoveRole }: UserListProps) {
  const { language } = useLanguage();

  if (users.length === 0) {
    return (
      <p className="text-gray-400 text-center py-4">
        {language === 'th'
          ? 'ไม่พบรายชื่อผู้ดูแลระบบ'
          : 'No admin users found'}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-gray-800 rounded-lg p-3 flex items-center justify-between"
        >
          <div className="grid grid-cols-4 gap-3 flex-1">
            <div>
              <p className="text-gray-400 text-xs mb-1">
                {language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name'}
              </p>
              <p className="text-white text-sm">
                {language === 'th'
                  ? user.fullname_th || '-'
                  : user.fullname_en || '-'}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1">
                {language === 'th' ? 'อีเมล' : 'Email'}
              </p>
              <p className="text-white text-sm truncate">{user.email}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1">
                {language === 'th' ? 'อาชีพ' : 'Occupation'}
              </p>
              <RoleBadge type="occupation" label={user.occupation || '-'} />
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1">
                {language === 'th' ? 'สิทธิ์' : 'Role'}
              </p>
              <RoleBadge type="role" label={user.web_role} />
            </div>
          </div>

          <Button
            onClick={() => onRemoveRole(user.id)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 ml-4"
          >
            {language === 'th' ? 'ลบสิทธิ์' : 'Remove'}
          </Button>
        </div>
      ))}
    </div>
  );
}