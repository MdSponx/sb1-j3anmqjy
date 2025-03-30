import React from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { CrewApplications } from '../components/CrewApplications';
import { useLanguage } from '../../../contexts/LanguageContext';

export function CrewApplicationsPage() {
  const { language } = useLanguage();

  return (
    <AdminLayout
      title={language === 'th' ? 'คำขอสมัครทีมงาน' : 'Crew Applications'}
      subtitle={language === 'th' ? 'จัดการคำขอสมัครทีมงานใหม่' : 'Manage new crew member applications'}
    >
      <CrewApplications />
    </AdminLayout>
  );
}

export default CrewApplicationsPage;