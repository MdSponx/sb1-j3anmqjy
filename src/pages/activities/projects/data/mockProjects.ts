import type { Project } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Film Development Workshop 2024',
    category: 'Workshop',
    status: 'Open',
    description: 'An intensive workshop focused on script development and pre-production planning for emerging filmmakers.',
    duration: 'March 15 - April 30, 2024',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80',
    applicationUrl: '#'
  },
  {
    id: '2',
    title: 'Young Filmmaker Grant Program',
    category: 'Funding',
    status: 'Coming Soon',
    description: 'Financial support program for first-time directors under 35 years old to produce their debut feature films.',
    duration: 'Applications open May 2024',
    image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    title: 'International Co-Production Forum',
    category: 'International',
    status: 'Open',
    description: 'Connect with international producers and explore co-production opportunities for your next film project.',
    duration: 'June 10-12, 2024',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80',
    applicationUrl: '#'
  },
  {
    id: '4',
    title: 'Masterclass Series: Visual Storytelling',
    category: 'Training',
    status: 'Ongoing',
    description: 'Learn from award-winning directors about visual storytelling techniques and cinematic language.',
    duration: 'February - July 2024',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80'
  },
  {
    id: '5',
    title: 'Emerging Directors Mentorship Program',
    category: 'Mentorship',
    status: 'Coming Soon',
    description: 'One-on-one mentorship program pairing emerging directors with experienced filmmakers.',
    duration: 'Starting September 2024',
    image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80'
  },
  {
    id: '6',
    title: 'Film Production Grant 2024',
    category: 'Funding',
    status: 'Open',
    description: 'Production funding support for independent Thai filmmakers with innovative storytelling approaches.',
    duration: 'Applications close April 30, 2024',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80',
    applicationUrl: '#'
  }
];

export const featuredProject: Project = {
  id: 'featured',
  title: 'TFDA New Wave Program 2024',
  category: 'Training',
  status: 'Open',
  description: 'A comprehensive year-long program designed to support and nurture the next generation of Thai filmmakers. Selected participants will receive mentorship, funding, and opportunities to showcase their work internationally.',
  duration: 'May 2024 - April 2025',
  image: 'https://images.unsplash.com/photo-1500210600724-e91f0c8d2f60?auto=format&fit=crop&q=80',
  applicationUrl: '#'
};