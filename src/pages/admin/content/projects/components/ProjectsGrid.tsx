import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import type { Project } from '../../../../../types/project';

interface ProjectsGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export function ProjectsGrid({ projects, onProjectClick }: ProjectsGridProps) {
  const { language } = useLanguage();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      language === 'th' ? 'th-TH' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-500/20 text-green-400';
      case 'Ongoing':
        return 'bg-blue-500/20 text-blue-400';
      case 'Coming Soon':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Training':
        return 'bg-blue-500/20 text-blue-400';
      case 'Funding':
        return 'bg-green-500/20 text-green-400';
      case 'Workshop':
        return 'bg-purple-500/20 text-purple-400';
      case 'Mentorship':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'International':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'workshop':
        return 'bg-purple-500/20 text-purple-400';
      case 'training':
        return 'bg-blue-500/20 text-blue-400';
      case 'funding':
        return 'bg-green-500/20 text-green-400';
      case 'mentorship':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'international':
        return 'bg-red-500/20 text-red-400';
      case 'competition':
        return 'bg-orange-500/20 text-orange-400';
      case 'collaboration':
        return 'bg-pink-500/20 text-pink-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          {language === 'th'
            ? 'ยังไม่มีโครงการในระบบ'
            : 'No projects found'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onProjectClick(project)}
          className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-200"
        >
          {/* Project Image */}
          <div className="aspect-video relative">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4 flex gap-2">
              {project.isHighlight && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
                  {language === 'th' ? 'โครงการเด่น' : 'Featured'}
                </span>
              )}
              <span className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${getStatusColor(project.status)}
              `}>
                {project.status === 'Open'
                  ? language === 'th' ? 'เปิดรับสมัคร' : 'Open'
                  : project.status === 'Ongoing'
                  ? language === 'th' ? 'กำลังดำเนินการ' : 'Ongoing'
                  : project.status === 'Coming Soon'
                  ? language === 'th' ? 'เร็วๆ นี้' : 'Coming Soon'
                  : language === 'th' ? 'ปิดรับสมัคร' : 'Closed'}
              </span>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-6">
            {/* Category and Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Category Badge */}
              {project.category && (
                <span className={`
                  text-xs font-medium px-2 py-1 rounded-full
                  ${getCategoryColor(project.category)}
                `}>
                  {project.category}
                </span>
              )}
              
              {/* Predefined Tags */}
              {project.tags?.map((tag, index) => (
                <span
                  key={`tag-${index}`}
                  className={`
                    text-xs font-medium px-2 py-1 rounded-full
                    ${getTagColor(tag)}
                  `}
                >
                  {tag}
                </span>
              ))}

              {/* Custom Tags */}
              {project.custom_tags?.map((tag, index) => (
                <span
                  key={`custom-tag-${index}`}
                  className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/20 text-purple-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-xl font-bold text-white mb-4">
              {project.title}
            </h3>

            <p className="text-gray-400 mb-6 line-clamp-2">
              {project.description}
            </p>

            {/* Project Details */}
            <div className="space-y-3 text-sm">
              {/* Duration */}
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  {project.startDate && project.endDate ? (
                    <>
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </>
                  ) : (
                    project.duration
                  )}
                </span>
              </div>

              {/* Application Deadline */}
              {project.status === 'Open' && project.applicationDeadline && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {language === 'th' ? 'ปิดรับสมัคร: ' : 'Deadline: '}
                    {formatDate(project.applicationDeadline)}
                  </span>
                </div>
              )}

              {/* Participants Limit */}
              {project.max_participants && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>
                    {language === 'th' 
                      ? `รับจำนวน ${project.max_participants} คน`
                      : `Limited to ${project.max_participants} participants`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}