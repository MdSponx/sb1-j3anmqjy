import React, { useCallback } from 'react';
import { PendingApplications } from './applications/PendingApplications';
import { ApprovedMembers } from './approved/ApprovedMembers';
import { useApprovedMembers } from '../hooks/useApprovedMembers';
import { useLanguage } from '../../../contexts/LanguageContext';

export function DirectorApplications() {
  const { language } = useLanguage();
  const { members, loading, error, refreshData } = useApprovedMembers();

  const handleMemberUpdate = useCallback(() => {
    // Refresh both pending applications and approved members
    refreshData();
  }, [refreshData]);

  return (
    <div className="space-y-8">
      {/* Pending Applications Section */}
      <PendingApplications onApplicationUpdate={handleMemberUpdate} />

      {/* Approved Members Section */}
      <ApprovedMembers 
        members={members.filter(member => member.verification_status === 'approved')}
        loading={loading}
        error={error}
        onMemberUpdate={handleMemberUpdate}
      />
    </div>
  );
}