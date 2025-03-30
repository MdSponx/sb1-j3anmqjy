import React, { useState } from 'react';
import { Calendar, ArrowRight, Clock, Building2 } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { StatusBadge } from './StatusBadge';
import { Button } from '../../../../components/ui/button';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { ProjectRegistrationDialog } from './registration/ProjectRegistrationDialog';
import type { Project } from '../../../../types/project';

interface FeaturedProjectProps {
  project: Project;
}

export function FeaturedProject({ project }: FeaturedProjectProps) {
  const { language } = useLanguage();
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);

  const canRegister = () => {
    if (!project.applicationDeadline) return true;
    const now = new Date();
    const deadline = new Date(project.applicationDeadline);
    return now <= deadline;
  };

  const handleRegistration = () => {
    // If external registration, redirect to external URL
    if (project.registration_type === 'external' && project.external_reg_url) {
      window.open(project.external_reg_url, '_blank', 'noopener,noreferrer');
      return;
    }

    // For TFDA registration, show the registration dialog
    if (project.registration_type === 'tfda') {
      setShowRegistrationDialog(true);
      return;
    }
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
    <>
      <div className="relative h-[500px] rounded-xl overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-[75%_center]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80';
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>

        {/* Status Badge - Moved to top right */}
        <div className="absolute top-6 right-6 z-10">
          <StatusBadge status={project.status} />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="w-full lg:w-2/3 p-8 lg:p-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.category && <CategoryBadge category={project.category} />}
              {project.tags?.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
              {project.custom_tags?.map((tag, index) => (
                <span
                  key={`custom-${index}`}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {project.title}
            </h2>

            <p className="text-gray-300 text-lg mb-6">
              {project.description}
            </p>

            {/* Organizer */}
            {project.organizer && (
              <div className="flex items-center gap-2 text-gray-400 mb-6">
                <Building2 className="w-5 h-5" />
                <span>{project.organizer}</span>
              </div>
            )}

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-5 h-5" />
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
                <div className="flex items-center gap-2 text-yellow-400 font-medium">
                  <Clock className="w-5 h-5" />
                  <span>
                    {language === 'th' ? 'ปิดรับสมัคร: ' : 'Deadline: '}
                    {formatDeadline(project.applicationDeadline)}
                  </span>
                </div>
              )}
            </div>

            {project.status === 'Open' && canRegister() && (
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-2.5"
                onClick={handleRegistration}
              >
                {language === 'th' ? 'สมัครเข้าร่วมโครงการ' : 'Apply Now'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Registration Dialog */}
      {project.registration_type === 'tfda' && (
        <ProjectRegistrationDialog
          project={project}
          isOpen={showRegistrationDialog}
          onClose={() => setShowRegistrationDialog(false)}
        />
      )}
    </>
  );
}