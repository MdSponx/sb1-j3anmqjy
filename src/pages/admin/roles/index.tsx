import React from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { RoleManagement as RoleManager } from '../components/RoleManagement';
import { useLanguage } from '../../../contexts/LanguageContext';

export function RoleManagement() {
  const { language } = useLanguage();

  return (
    <AdminLayout
      title={language === 'th' ? 'จัดการสิทธิ์' : 'Role Management'}
      subtitle={language === 'th' ? 'จัดการสิทธิ์การใช้งานระบบ' : 'Manage system access permissions'}
    >
      <RoleManager />
    </AdminLayout>
  );
}