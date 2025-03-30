import React, { useState } from 'react';
import { usePendingCrewApplications } from '../../hooks/usePendingCrewApplications';
import { useImageViewer } from '../../hooks/useImageViewer';
import { ApplicationCard } from './ApplicationCard';
import { ImageViewDialog } from './ImageViewDialog';
import { CameraAnimation } from '../../../../components/shared/CameraAnimation';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { CrewApplication } from '../../types/application';

interface PendingCrewApplicationsProps {
  onApplicationUpdate?: () => void;
}

export function PendingCrewApplications({
  onApplicationUpdate,
}: PendingCrewApplicationsProps) {
  const { language } = useLanguage();
  const { applications, loading, error } = usePendingCrewApplications();
  const { selectedImage, handleImageSelect, handleCloseImage } = useImageViewer();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CrewApplication | null>(null);

  const handleOpenDialog = (member: CrewApplication) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMember(null);
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
            onImageSelect={handleImageSelect}
            onRecheck={() => handleOpenDialog(application)}
          />
        ))}
      </div>

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