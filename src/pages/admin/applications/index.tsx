import React from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { DirectorApplications } from '../components/DirectorApplications';
import { useLanguage } from '../../../contexts/LanguageContext';

export function MemberApplications() {
  const { language } = useLanguage();

  return (
    <AdminLayout
      title={language === 'th' ? 'คำขอสมัครสมาชิก' : 'Member Applications'}
      subtitle={language === 'th' ? 'จัดการคำขอสมัครสมาชิกใหม่' : 'Manage new member applications'}
    >
      <DirectorApplications />
    </AdminLayout>
  );
}