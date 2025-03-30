export interface AdminUser {
  id: string;
  email: string;
  web_role: string;
  fullname_th?: string;
  fullname_en?: string;
  occupation?: string;
}

export interface FoundUser {
  id: string;
  email: string;
}