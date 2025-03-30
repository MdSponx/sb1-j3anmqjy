export interface FormDataState {
  title: string;
  status: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  applicationUrl: string;
  organizer: string;
  is_tfda_event: boolean;
  registration_type: 'tfda' | 'external' | null;
  external_reg_url: string;
  unlimited_participants: boolean;
  max_participants: number;
  tags: string[];
  custom_tags: string[];
}