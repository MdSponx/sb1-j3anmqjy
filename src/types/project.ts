export type ProjectStatus = 'Open' | 'Ongoing' | 'Coming Soon' | 'Closed';
export type ProjectCategory = 'Training' | 'Funding' | 'Workshop' | 'Mentorship' | 'International';

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  category?: ProjectCategory;
  description: string;
  startDate?: string;
  endDate?: string;
  applicationDeadline?: string;
  duration: string;
  image: string;
  applicationUrl?: string;
  tags?: string[];
  custom_tags?: string[];
  isHighlight?: boolean; // Added highlight flag
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}