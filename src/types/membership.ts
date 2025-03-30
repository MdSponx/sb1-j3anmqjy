export type MembershipPlan = 'Free' | 'Pro' | 'Crew' | 'Public';

export interface MembershipData {
  plan_selection: MembershipPlan;
  created_at: string;
  updated_at: string;
}