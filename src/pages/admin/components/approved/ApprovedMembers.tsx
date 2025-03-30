import React from 'react';
import { ApprovedMembersTable } from './ApprovedMembersTable';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { CameraAnimation } from '../../../../components/shared/CameraAnimation';
import type { DirectorApplication } from '../../types/application';

interface ApprovedMembersProps {
  members: DirectorApplication[];
  loading: boolean;
  error: Error | null;
  onMemberUpdate?: () => void;
}

export function ApprovedMembers({ 
  members, 
  loading, 
  error,
  onMemberUpdate 
}: ApprovedMembersProps) {
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <CameraAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">
          {language === 'th'
            ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
            : 'Error loading members'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          {language === 'th' ? 'สมาชิกที่ได้รับการอนุมัติ' : 'Approved Members'}
          <span className="text-sm font-normal text-gray-400">
            ({members.length})
          </span>
        </h2>
      </div>

      <ApprovedMembersTable 
        members={members} 
        onMemberUpdate={onMemberUpdate}
      />
    </div>
  );
}