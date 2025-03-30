import React from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { ContentDashboard } from './components/ContentDashboard';
import { useLanguage } from '../../../contexts/LanguageContext';

export function ContentEditorPage() {
  const { language } = useLanguage();

  return (
    <AdminLayout
      title={language === 'th' ? 'จัดการเนื้อหา' : 'Content Editor'}
      subtitle={language === 'th' 
        ? 'จัดการเนื้อหาและข้อมูลในระบบ' 
        : 'Manage system content and information'}
    >
      <ContentDashboard />
    </AdminLayout>
  );
}

export default ContentEditorPage;