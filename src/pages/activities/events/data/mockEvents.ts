import type { Event } from '../types';

export const venues = [
  'TFDA Hall',
  'Bangkok Art and Culture Centre',
  'Scala Theatre',
  'Thai Film Archive',
  'Alliance Française',
  'River City Bangkok'
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Thai Film Festival 2025',
    description: 'A celebration of contemporary Thai cinema featuring award-winning films and emerging directors.',
    fullDescription: `Join us for the annual Thai Film Festival 2025, a week-long celebration of contemporary Thai cinema. The festival will showcase a curated selection of award-winning films and works by emerging directors.

This year's festival focuses on the evolution of Thai storytelling and its impact on global cinema. Featuring special screenings, director Q&As, and workshops on film production.`,
    date: '2025-02-15',
    time: '10:00 - 22:00',
    venue: 'TFDA Hall',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
    isLarge: true,
    ticketInfo: 'Tickets: 500฿ for a day pass, 2,000฿ for full festival pass'
  },
  {
    id: '2',
    title: 'Masterclass: Visual Storytelling',
    description: 'An intensive workshop on visual storytelling techniques by renowned cinematographer Sayombhu Mukdeeprom.',
    date: '2025-02-20',
    time: '13:00 - 17:00',
    venue: 'Bangkok Art and Culture Centre',
    image: 'https://images.unsplash.com/photo-1601506521793-dc748fc80b67',
    isLarge: false
  },
  {
    id: '3',
    title: 'Film Industry Networking Night',
    description: 'Connect with industry professionals, directors, and producers in an evening of networking and collaboration.',
    date: '2025-02-26',
    time: '18:30 - 22:00',
    venue: 'River City Bangkok',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
    isLarge: true
  },
  {
    id: '4',
    title: 'Classic Thai Cinema Screening',
    description: 'Special screening of restored classic Thai films from the golden age of Thai cinema.',
    date: '2025-02-28',
    time: '15:00 - 20:00',
    venue: 'Scala Theatre',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c',
    isLarge: false
  },
  {
    id: '5',
    title: 'Documentary Filmmaking Workshop',
    description: 'Learn the art of documentary filmmaking from experienced documentary directors.',
    date: '2025-03-05',
    time: '09:00 - 16:00',
    venue: 'Thai Film Archive',
    image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
    isLarge: false
  },
  {
    id: '6',
    title: 'International Co-Production Forum',
    description: 'A platform for Thai filmmakers to meet international producers and explore co-production opportunities.',
    date: '2025-03-12',
    time: '10:00 - 18:00',
    venue: 'Alliance Française',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
    isLarge: true
  },
  {
    id: '7',
    title: 'Short Film Competition Screening',
    description: 'Screening of shortlisted films from the annual TFDA Short Film Competition.',
    date: '2025-03-20',
    time: '14:00 - 19:00',
    venue: 'TFDA Hall',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',
    isLarge: false
  },
  {
    id: '8',
    title: 'Film Sound Design Workshop',
    description: 'Advanced workshop on film sound design and audio post-production techniques.',
    date: '2025-03-25',
    time: '13:00 - 17:00',
    venue: 'Thai Film Archive',
    image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0',
    isLarge: false
  }
];