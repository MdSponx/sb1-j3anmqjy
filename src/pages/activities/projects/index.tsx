import React from 'react';
import { Container } from '../../../components/ui/Container';
import { FeaturedProjectSlider } from './components/FeaturedProjectSlider';
import { ProjectGrid } from './components/ProjectGrid';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useProjects } from './hooks/useProjects';
import { CameraAnimation } from '../../../components/shared/CameraAnimation';

export function ProjectsPage() {
  const { language } = useLanguage();
  const { projects, featuredProjects, loading, error } = useProjects();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CameraAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">
          {language === 'th' 
            ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง'
            : 'Error loading data. Please try again.'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-32 pb-16">
        <Container>
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                {language === 'th' ? 'โครงการและโปรแกรม' : 'Projects & Programs'}
              </h1>
              <p className="text-lg text-gray-400">
                {language === 'th' 
                  ? 'โอกาสและโครงการที่กำลังดำเนินการสำหรับผู้กำกับภาพยนตร์ไทย'
                  : 'Current opportunities and ongoing programs for Thai filmmakers'}
              </p>
            </div>

            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
              <div className="mb-12">
                <FeaturedProjectSlider projects={featuredProjects} />
              </div>
            )}

            {/* Project Grid */}
            <ProjectGrid projects={projects} />
          </div>
        </Container>
      </div>
    </div>
  );
}

export default ProjectsPage;