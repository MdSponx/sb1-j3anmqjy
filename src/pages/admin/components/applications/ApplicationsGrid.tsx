import React from 'react';
import { ApplicationCard } from './ApplicationCard';
import type { DirectorApplication } from '../../types/application';

interface ApplicationsGridProps {
  applications: DirectorApplication[];
  onStatusChange: (id: string, status: string) => void;
  onPaymentVerification: (id: string, status: string) => void;
  onImageSelect: (url: string) => void;
  onApprove: (application: DirectorApplication) => void;
  onReject: (application: DirectorApplication) => void;
}

export function ApplicationsGrid({
  applications,
  onStatusChange,
  onPaymentVerification,
  onImageSelect,
  onApprove,
  onReject
}: ApplicationsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {applications.map(application => (
        <ApplicationCard
          key={application.id}
          application={application}
          onStatusChange={onStatusChange}
          onPaymentVerification={onPaymentVerification}
          onImageSelect={onImageSelect}
          onApprove={() => onApprove(application)}
          onReject={() => onReject(application)}
        />
      ))}
    </div>
  );
}