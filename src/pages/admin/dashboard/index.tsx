import React from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { AdminDashboard as Dashboard } from '../components/AdminDashboard';
import { useLanguage } from '../../../contexts/LanguageContext';

export function AdminDashboard() {
  const { language } = useLanguage();

  return (
    <AdminLayout
      title={language === 'th' ? 'แดชบอร์ด' : 'Dashboard'}
      subtitle={language === 'th' ? 'ภาพรวมของระบบ' : 'System overview'}
    >
      <Dashboard />
    </AdminLayout>
  );
}