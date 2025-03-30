import React, { useCallback } from 'react';
import { PendingCrewApplications } from './applications/PendingCrewApplications';
import { ApprovedCrewMembers } from './approved/ApprovedCrewMembers';
import { useApprovedCrewMembers } from '../hooks/useApprovedCrewMembers';
import { useLanguage } from '../../../contexts/LanguageContext';

export function CrewApplications() {
  const { language } = useLanguage();
  const { members, loading, error, refreshData } = useApprovedCrewMembers();

  const handleMemberUpdate = useCallback(() => {
    // Refresh both pending applications and approved members
    refreshData();
  }, [refreshData]);

  return (
    <div className="space-y-8">
      {/* Pending Applications Section */}
      <PendingCrewApplications onApplicationUpdate={handleMemberUpdate} />

      {/* Approved Members Section */}
      <ApprovedCrewMembers 
        members={members.filter(member => member.verification_status === 'approved')}
        loading={loading}
        error={error}
        onMemberUpdate={handleMemberUpdate}
      />
    </div>
  );
}