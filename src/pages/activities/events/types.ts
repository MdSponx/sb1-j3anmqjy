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
  is_free?: boolean;
  is_paid?: boolean;
  requires_registration?: boolean;
  organizer?: string;
  is_tfda_event?: boolean;
  tags?: string[];
  custom_tags?: string[];
  registration_type?: 'tfda' | 'external' | null;
  external_reg_url?: string;
  unlimited_participants?: boolean;
  max_participants?: number;
  ticket_purchase_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  dietary_restrictions?: string;
  special_requirements?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  registered_at: string;
  updated_at: string;
}