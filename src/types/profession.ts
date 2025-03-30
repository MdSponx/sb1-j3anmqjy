export interface Profession {
  type: string;
  department_th: string;
  department_en: string;
  role_th: string;
  role_en: string;
}

export interface Role {
  title_th: string;
  title_en: string;
  type: string;
}

export interface Department {
  name_th: string;
  name_en: string;
  roles: Role[];
}

export interface SearchResult {
  department: Department;
  role: Role;
  matchScore: number;
}

export interface ProfessionState {
  initialized: boolean;
  version: string;
  departments: Department[];
  lastUpdated: string;
}

export interface CrewProfile {
  department_th: string;
  department_en: string;
  role_th: string;
  role_en: string;
  type: string;
  occupation: 'crew';
  verification_status: 'pending' | 'verified' | 'rejected';
}