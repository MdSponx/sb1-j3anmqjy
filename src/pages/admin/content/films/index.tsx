import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { ThaiFilmDataEditor } from './components/ThaiFilmDataEditor';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Button } from '../../../../components/ui/button';
import { migratePosters } from '../../../../lib/utils/migrations';

export function ThaiFilmDataEditorPage() {
  const { language } = useLanguage();

  const handleMigration = async () => {
    try {
      const result = await migratePosters();
      if (result.success) {
        alert(language === 'th' 
          ? `การย้ายข้อมูลสำเร็จ\nย้ายแล้ว: ${result.migratedCount}\nผิดพลาด: ${result.errorCount}`
          : `Migration successful\nMigrated: ${result.migratedCount}\nErrors: ${result.errorCount}`
        );
      }
    } catch (error) {
      console.error('Migration error:', error);
      alert(language === 'th'
        ? 'เกิดข้อผิดพลาดในการย้ายข้อมูล'
        : 'Error during migration');
    }
  };

  return (
    <AdminLayout
      title={language === 'th' ? 'จัดการข้อมูลภาพยนตร์ไทย' : 'Thai Films Management'}
      subtitle={language === 'th' 
        ? 'จัดการและแก้ไขข้อมูลภาพยนตร์ในระบบ' 
        : 'Manage and edit film information in the system'}
    >
 
    
      <ThaiFilmDataEditor />
    </AdminLayout>
  );
}

export default ThaiFilmDataEditorPage;