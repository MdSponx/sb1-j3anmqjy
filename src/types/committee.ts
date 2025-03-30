export interface CommitteeMember {
  id: string;
  name: string;
  position: string;
  photo?: string;
}

export const positionOrder = [
  'นายกสมาคม',
  'กรรมการ',
  'เลขาธิการ',
  'เลขานุการ',
  'ที่ปรึกษา',
  'ที่ปรึกษากิตติมศักดิ์',
  'ฝ่ายประชาสัมพันธ์'
] as const;

export type Position = typeof positionOrder[number];

export const positionGroups = {
  'นายกสมาคม': 'นายกสมาคม',
  'กรรมการ': 'กรรมการ',
  'เลขาธิการ': 'เลขาธิการ/เลขานุการ',
  'เลขานุการ': 'เลขาธิการ/เลขานุการ',
  'ที่ปรึกษา': 'ที่ปรึกษา',
  'ที่ปรึกษากิตติมศักดิ์': 'ที่ปรึกษากิตติมศักดิ์',
  'ฝ่ายประชาสัมพันธ์': 'ฝ่ายประชาสัมพันธ์'
} as const;

export type PositionGroup = typeof positionGroups[keyof typeof positionGroups];