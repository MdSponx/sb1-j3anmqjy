export interface Event {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  date: string;
  time: string;
  endDate?: string;
  venue: string;
  locationUrl?: string;
  image?: string;
  ticketInfo?: string;
  isLarge?: boolean;
  created_at?: string;
  updated_at?: string;
}