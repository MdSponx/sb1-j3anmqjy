export type MembershipStatus = 'ว่าที่สามัญ' | 'สามัญ' | 'วิสามัญ';

export interface MembershipOption {
  value: MembershipStatus;
  labelTh: string;
  labelEn: string;
}