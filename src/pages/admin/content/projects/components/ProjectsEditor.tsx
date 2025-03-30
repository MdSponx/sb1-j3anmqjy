import React, { useState } from 'react';
import { ProjectEditorPanel } from './ProjectEditorPanel';
import { ProjectsGrid } from './ProjectsGrid';
import { Button } from '../../../../../components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useProjects } from '../hooks/useProjects';
import { CameraAnimation } from '../../../../../components/shared/CameraAnimation';
import type { Project } from '../../../../../types/project';

export function ProjectsEditor() {
  const { language } = useLanguage();
  const { projects, loading, error } = useProjects();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsEditorOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedProject(null);
  };

  const handleSaveSuccess = () => {
    // No need to manually refresh since we're using realtime updates
    setIsEditorOpen(false);
    setSelectedProject(null);
  };

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500 p-4">
        <p className="text-red-500">
          {language === 'th' 
            ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง'
            : 'Error loading data. Please try again.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={handleAddProject}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {language === 'th' ? 'เพิ่มโครงการ' : 'Add Project'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <CameraAnimation />
        </div>
      ) : (
        <ProjectsGrid 
          projects={projects} 
          onProjectClick={handleEditProject}
        />
      )}

      <ProjectEditorPanel
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        project={selectedProject}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}