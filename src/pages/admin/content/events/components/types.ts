export interface FormDataState {
  date: string;
  title: string;
  description: string;
  fullDescription: string;
  startTime: string;
  endTime: string;
  endDate: string;
  venue: string;
  locationUrl: string;
  image: string;
  ticketInfo: string;
  isLarge: boolean;
  is_free: boolean;
  is_paid: boolean;
  requires_registration: boolean;
  organizer: string;
  is_tfda_event: boolean;
  tags: string[];
  custom_tags: string[];
  registration_type: 'tfda' | 'external' | null;
  external_reg_url: string;
  unlimited_participants: boolean;
  max_participants: number;
  ticket_purchase_url: string;
  original_url?: string; // Added original_url field
}