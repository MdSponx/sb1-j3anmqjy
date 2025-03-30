import React from 'react';
import { Container } from '../ui/Container';
import { PositionGroup } from './PositionGroup';
import { CommitteeMember, PositionGroup as PositionGroupType } from '../../types/committee';
import { useLanguage } from '../../contexts/LanguageContext';

interface CommitteeListProps {
  groupedMembers: Record<PositionGroupType, CommitteeMember[]>;
  displayOrder: PositionGroupType[];
}

export function CommitteeList({ groupedMembers, displayOrder }: CommitteeListProps) {
  const { t } = useLanguage();

  const getTranslatedTitle = (groupKey: PositionGroupType) => {
    switch (groupKey) {
      case 'นายกสมาคม':
        return t('committee.president');
      case 'กรรมการ':
        return t('committee.board');
      case 'เลขาธิการ/เลขานุการ':
        return t('committee.secretary');
      case 'ที่ปรึกษา':
        return t('committee.advisor');
      case 'ที่ปรึกษากิตติมศักดิ์':
        return t('committee.honoraryAdvisor');
      case 'ฝ่ายประชาสัมพันธ์':
        return t('committee.pr');
      default:
        return groupKey;
    }
  };

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-black">
      <Container>
        <div className="space-y-16 sm:space-y-20 lg:space-y-24">
          {displayOrder.map((groupKey) => (
            groupKey !== 'นายกสมาคม' && (
              <PositionGroup
                key={groupKey}
                title={getTranslatedTitle(groupKey)}
                members={groupedMembers[groupKey] || []}
              />
            )
          ))}
        </div>
      </Container>
    </section>
  );
}