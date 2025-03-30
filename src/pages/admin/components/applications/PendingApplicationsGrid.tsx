import React from 'react';
import { ApplicationCard } from './ApplicationCard';
import { CameraAnimation } from '../../../../components/shared/CameraAnimation';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { DirectorApplication } from '../../types/application';

interface PendingApplicationsGridProps {
  applications: DirectorApplication[];
  loading: boolean;
  error: Error | null;
  onStatusChange: (id: string, status: string) => void;
  onPaymentVerification: (id: string, status: string) => void;
  onImageSelect: (url: string) => void;
  onApprove: (application: DirectorApplication) => void;
  onReject: (application: DirectorApplication) => void;
}

export function PendingApplicationsGrid({
  applications,
  loading,
  error,
  onStatusChange,
  onPaymentVerification,
  onImageSelect,
  onApprove,
  onReject
}: PendingApplicationsGridProps) {
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
            : 'Error loading applications'}
        </p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          {language === 'th'
            ? 'ไม่มีคำขอที่รอการอนุมัติ'
            : 'No pending applications'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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