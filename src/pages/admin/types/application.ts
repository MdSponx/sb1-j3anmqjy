import type { MembershipStatus } from './membership';

export type PaymentStatus = 'not paid' | 'pending' | 'paid';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

interface BaseApplication {
  id: string;
  fullname_th: string;
  fullname_en?: string;
  email?: string;
  phone?: string;
  verification_status: VerificationStatus;
  member_status: MembershipStatus;
  payment_status: PaymentStatus;
  profile_image_url?: string;
  id_card_image_url?: string;
  payment_slip_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DirectorApplication extends BaseApplication {
  occupation: 'director';
}

export interface CrewApplication extends BaseApplication {
  occupation: 'crew';
  department_th: string;
  department_en: string;
  role_th: string;
  role_en: string;
}

export type Application = DirectorApplication | CrewApplication;