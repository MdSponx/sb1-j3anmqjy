export type PublicMemberType = 'school student' | 'college student' | 'general people';

export interface PublicMemberFormData {
  occupation: PublicMemberType;
  plan_selection: 'Public';
}

export interface PublicMemberOption {
  value: PublicMemberType;
  labelTh: string;
  labelEn: string;
}