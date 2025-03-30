export type ProjectCategory = 'Training' | 'Funding' | 'Workshop' | 'Mentorship' | 'International';
export type ProjectStatus = 'Open' | 'Ongoing' | 'Coming Soon' | 'Closed';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  duration: string;
  image: string;
  applicationUrl?: string;
}