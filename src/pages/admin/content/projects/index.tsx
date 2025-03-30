import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { ProjectsEditor } from './components/ProjectsEditor';
import { useLanguage } from '../../../../contexts/LanguageContext';

export function ProjectsEditorPage() {
  const { language } = useLanguage();

  return (
    <AdminLayout
      title={language === 'th' ? 'จัดการโครงการ' : 'Project Management'}
      subtitle={language === 'th' 
        ? 'จัดการโครงการและกิจกรรมของสมาคมฯ' 
        : 'Manage association projects and programs'}
    >
      <ProjectsEditor />
    </AdminLayout>
  );
}

export default ProjectsEditorPage;