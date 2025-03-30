import React from 'react';
import { Calendar, ArrowRight, Clock, Building2 } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { StatusBadge } from './StatusBadge';
import { Button } from '../../../../components/ui/button';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { Project } from '../../../../types/project';

interface ProjectCardProps {
  project: Project;
  onRegister: () => void;
}

export function ProjectCard({ project, onRegister }: ProjectCardProps) {
  const { language } = useLanguage();

  const canRegister = () => {
    if (!project.applicationDeadline) return true;
    const now = new Date();
    const deadline = new Date(project.applicationDeadline);
    return now <= deadline;
  };

  const formatDeadline = (date: string) => {
    return new Date(date).toLocaleDateString(
      language === 'th' ? 'th-TH' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
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

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg overflow-hidden group hover:scale-[1.02] transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-[16/9]">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.category && <CategoryBadge category={project.category} />}
          {project.tags?.map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
          {project.custom_tags?.map((tag, index) => (
            <span
              key={`custom-${index}`}
              className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {project.title}
        </h3>

        <p className="text-gray-400 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Organizer */}
        {project.organizer && (
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Building2 className="w-4 h-4" />
            <span>{project.organizer}</span>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar className="w-4 h-4" />
            <span>
              {project.startDate && project.endDate ? (
                <>
                  {formatDeadline(project.startDate)}
                  {' - '}
                  {formatDeadline(project.endDate)}
                </>
              ) : (
                project.duration
              )}
            </span>
          </div>

          {project.applicationDeadline && (
            <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>
                {language === 'th' ? 'ปิดรับสมัคร: ' : 'Deadline: '}
                {formatDeadline(project.applicationDeadline)}
              </span>
            </div>
          )}
        </div>

        {project.status === 'Open' && canRegister() && (
          <Button 
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            onClick={onRegister}
          >
            {language === 'th' ? 'สมัครเข้าร่วม' : 'Apply Now'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}