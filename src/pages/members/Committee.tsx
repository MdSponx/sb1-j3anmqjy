import React from 'react';
import { useCommitteeMembers } from '../../hooks/useCommitteeMembers';
import { positionGroups, type PositionGroup } from '../../types/committee';
import { useLanguage } from '../../contexts/LanguageContext';
import { CameraAnimation } from '../../components/shared/CameraAnimation';
import { CommitteeHero } from '../../components/committee/CommitteeHero';
import { CommitteeList } from '../../components/committee/CommitteeList';

export function Committee() {
  const { members, loading, error } = useCommitteeMembers();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CameraAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{t('committee.error')}</p>
        </div>
      </div>
    );
  }

  // Group members by their position group
  const groupedMembers = members.reduce((acc, member) => {
    const groupKey = positionGroups[member.position as keyof typeof positionGroups] as PositionGroup;
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(member);
    return acc;
  }, {} as Record<PositionGroup, typeof members>);

  // Order of position groups to display
  const displayOrder: PositionGroup[] = [
    'นายกสมาคม',
    'กรรมการ',
    'เลขาธิการ/เลขานุการ',
    'ที่ปรึกษา',
    'ที่ปรึกษากิตติมศักดิ์',
    'ฝ่ายประชาสัมพันธ์'
  ];

  // Find the president
  const president = groupedMembers['นายกสมาคม']?.[0];

  return (
    <div className="min-h-screen bg-black">
      <CommitteeHero president={president} />
      <CommitteeList 
        groupedMembers={groupedMembers}
        displayOrder={displayOrder}
      />
    </div>
  );
}