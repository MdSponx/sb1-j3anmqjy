import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Clock, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProjects } from '../../pages/activities/projects/hooks/useProjects';
import { CameraAnimation } from '../shared/CameraAnimation';
import { CategoryBadge } from '../../pages/activities/projects/components/CategoryBadge';
import { StatusBadge } from '../../pages/activities/projects/components/StatusBadge';

export function FeaturedProject() {
  const { language } = useLanguage();
  const { featuredProjects, loading, error } = useProjects();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (featuredProjects.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProjects.length]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      language === 'th' ? 'th-TH' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const handleApplyClick = (project: any) => {
    if (project.registration_type === 'external' && project.external_reg_url) {
      window.open(project.external_reg_url, '_blank', 'noopener,noreferrer');
      return;
    }
    window.location.href = '/activities/projects';
  };

  if (loading) {
    return (
      <section className="relative bg-transparent py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <CameraAnimation />
          </div>
        </div>
      </section>
    );
  }

  if (error || featuredProjects.length === 0) {
    return null;
  }

  const currentProject = featuredProjects[currentIndex];

  return (
    <section className="relative bg-transparent py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            {language === 'th' ? 'โครงการเด่น' : 'Featured Projects'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 font-light">
            {language === 'th' 
              ? 'โครงการพิเศษจากสมาคมผู้กำกับภาพยนตร์ไทย'
              : 'Special projects from Thai Film Director Association'}
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative group">
          {/* Featured Project Card */}
          <div className="relative h-[400px] sm:h-[450px] md:h-[500px] rounded-xl overflow-hidden">
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full">
              {featuredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`
                    absolute inset-0 w-full h-full
                    transition-opacity duration-500 ease-in-out
                    ${index === currentIndex ? 'opacity-100' : 'opacity-0'}
                  `}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                </div>
              ))}
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 flex gap-2">
              {currentProject.category && <CategoryBadge category={currentProject.category} />}
              <StatusBadge status={currentProject.status} />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="w-full lg:w-2/3 p-6 sm:p-8 lg:p-12">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentProject.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                  {currentProject.custom_tags?.map((tag, index) => (
                    <span
                      key={`custom-${index}`}
                      className="px-2 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-500/20 text-purple-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                  {currentProject.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 line-clamp-3">
                  {currentProject.description}
                </p>

                {/* Organizer */}
                {currentProject.organizer && (
                  <div className="flex items-center gap-2 text-gray-400 mb-4 sm:mb-6">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">{currentProject.organizer}</span>
                  </div>
                )}

                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>
                      {currentProject.startDate && currentProject.endDate ? (
                        <>
                          {formatDate(currentProject.startDate)}
                          {' - '}
                          {formatDate(currentProject.endDate)}
                        </>
                      ) : (
                        currentProject.duration
                      )}
                    </span>
                  </div>

                  {currentProject.applicationDeadline && (
                    <div className="flex items-center gap-2 text-yellow-400 font-medium text-sm sm:text-base">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>
                        {language === 'th' ? 'ปิดรับสมัคร: ' : 'Deadline: '}
                        {formatDate(currentProject.applicationDeadline)}
                      </span>
                    </div>
                  )}
                </div>

                {currentProject.status === 'Open' && (
                  <Button 
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-sm sm:text-base"
                    onClick={() => handleApplyClick(currentProject)}
                  >
                    {language === 'th' ? 'สมัครเข้าร่วมโครงการ' : 'Apply Now'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {featuredProjects.length > 1 && (
            <>
              <Button
                onClick={handlePrevious}
                disabled={isTransitioning}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                size="icon"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                onClick={handleNext}
                disabled={isTransitioning}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                size="icon"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {featuredProjects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true);
                        setCurrentIndex(index);
                        setTimeout(() => setIsTransitioning(false), 500);
                      }
                    }}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/75'
                    }`}
                    disabled={isTransitioning}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

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