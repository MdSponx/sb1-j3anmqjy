import React, { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectRegistrationDialog } from './registration/ProjectRegistrationDialog';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { Project } from '../../../../types/project';

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const { language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);

  const handleRegistration = (project: Project) => {
    // If external registration, redirect to external URL
    if (project.registration_type === 'external' && project.external_reg_url) {
      window.open(project.external_reg_url, '_blank', 'noopener,noreferrer');
      return;
    }

    // For TFDA registration, show the registration dialog
    if (project.registration_type === 'tfda') {
      setSelectedProject(project);
      setShowRegistrationDialog(true);
      return;
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          {language === 'th'
            ? 'ไม่มีโครงการในขณะนี้'
            : 'No projects available'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            onRegister={() => handleRegistration(project)}
          />
        ))}
      </div>

      {/* Registration Dialog */}
      {selectedProject && (
        <ProjectRegistrationDialog
          project={selectedProject}
          isOpen={showRegistrationDialog}
          onClose={() => {
            setShowRegistrationDialog(false);
            setSelectedProject(null);
          }}
        />
      )}
    </>
  );
}