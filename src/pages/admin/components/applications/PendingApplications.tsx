import React, { useState } from 'react';
import { usePendingApplications } from '../../hooks/usePendingApplications';
import { useImageViewer } from '../../hooks/useImageViewer';
import { ApplicationCard } from './ApplicationCard';
import { ImageViewDialog } from './ImageViewDialog';
import { DirectorRecheckDialog } from '../../../admin/components/approved/DirectorRecheckDialog';
import { CameraAnimation } from '../../../../components/shared/CameraAnimation';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { DirectorApplication } from '../../types/application';

interface PendingApplicationsProps {
  onApplicationUpdate?: () => void;
}

export function PendingApplications({
  onApplicationUpdate,
}: PendingApplicationsProps) {
  const { language } = useLanguage();
  const { applications, loading, error } = usePendingApplications();
  const { selectedImage, handleImageSelect, handleCloseImage } = useImageViewer();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<DirectorApplication | null>(null);

  const handleOpenDialog = (member: DirectorApplication) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMember(null);
  };

  // เพิ่มฟังก์ชันสำหรับ ApplicationCard props
  const handleStatusChange = async (id: string, status: string) => {
    // implement status change logic if needed
    console.log('Status change:', id, status);
  };

  const handlePaymentVerification = async (id: string, status: string) => {
    // implement payment verification logic if needed
    console.log('Payment verification:', id, status);
  };

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onStatusChange={handleStatusChange}
            onPaymentVerification={handlePaymentVerification}
            onImageSelect={handleImageSelect}
            onRecheck={() => handleOpenDialog(application)}
          />
        ))}
      </div>

      <DirectorRecheckDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        member={selectedMember}
        onImageSelect={handleImageSelect}
        onUpdate={onApplicationUpdate} // เพิ่ม onUpdate prop
      />

      <ImageViewDialog
        isOpen={!!selectedImage}
        imageUrl={selectedImage}
        onClose={handleCloseImage}
      />

      {applications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {language === 'th'
              ? 'ไม่มีคำขอที่รอการอนุมัติ'
              : 'No pending applications'}
          </p>
        </div>
      )}
    </div>
  );
}
