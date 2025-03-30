import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { CreditCertificationTable } from './components/CreditCertificationTable';
import { useLanguage } from '../../../../contexts/LanguageContext';

export function CreditCertificationPage() {
  const { language } = useLanguage();

  return (
    <AdminLayout
      title={language === 'th' ? 'รับรองเครดิตผลงาน' : 'Credit Certification'}
      subtitle={language === 'th' 
        ? 'ตรวจสอบและรับรองผลงานของทีมงาน' 
        : 'Review and certify crew credits'}
    >
      <CreditCertificationTable />
    </AdminLayout>
  );
}

export default CreditCertificationPage;