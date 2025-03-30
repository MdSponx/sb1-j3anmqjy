import React from 'react';
import { Film, Award, FolderGit2, Calendar } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useMoviesCount } from '../hooks/useMoviesCount';
import { useProjectsCount } from '../hooks/useProjectsCount';
import { useEventsCount } from '../hooks/useEventsCount';
import { ContentCard } from './ContentCard';

export function ContentDashboard() {
  const { language } = useLanguage();
  const { count: moviesCount, loading: moviesLoading } = useMoviesCount();
  const { count: projectsCount, loading: projectsLoading } = useProjectsCount();
  const { count: eventsCount, loading: eventsLoading } = useEventsCount();

  const contentCards = [
    {
      title: language === 'th' ? 'ภาพยนตร์ไทย' : 'Thai Films',
      subtitle: language === 'th' ? 'จำนวนภาพยนตร์ในระบบ' : 'Total movies in system',
      icon: <Film className="w-6 h-6 text-red-500" />,
      value: moviesCount,
      loading: moviesLoading,
      href: '/admin/content/films'
    },
    {
      title: language === 'th' ? 'รางวัลสมาคมฯ' : 'TFDA Awards',
      subtitle: language === 'th' ? 'การประกวดและรางวัล' : 'Competitions and awards',
      icon: <Award className="w-6 h-6 text-yellow-500" />,
      value: '-',
      status: language === 'th' ? 'อยู่ระหว่างการพัฒนา' : 'Under Development',
      href: '/admin/content/awards'
    },
    {
      title: language === 'th' ? 'โครงการ' : 'Projects',
      subtitle: language === 'th' ? 'โครงการและกิจกรรม' : 'Projects and activities',
      icon: <FolderGit2 className="w-6 h-6 text-blue-500" />,
      value: projectsCount,
      loading: projectsLoading,
      href: '/admin/content/projects'
    },
    {
      title: language === 'th' ? 'กิจกรรม' : 'Events',
      subtitle: language === 'th' ? 'ปฏิทินกิจกรรม' : 'Event calendar',
      icon: <Calendar className="w-6 h-6 text-green-500" />,
      value: eventsCount,
      loading: eventsLoading,
      href: '/admin/content/events'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {contentCards.map((card, index) => (
        <ContentCard key={index} {...card} />
      ))}
    </div>
  );
}