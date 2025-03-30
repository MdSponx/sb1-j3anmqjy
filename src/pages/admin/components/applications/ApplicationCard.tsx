import React from 'react';
import { ApplicationHeader } from './ApplicationHeader';
import { ApplicationStatus } from './ApplicationStatus';
import { ApplicationActions } from './ApplicationActions';
import { DocumentBadges } from './DocumentBadges';
import { PortfolioDialog } from './PortfolioDialog';
import { useDirectorPortfolio } from '../../hooks/useDirectorPortfolio';
import type { DirectorApplication } from '../../types/application';
import type { MembershipStatus } from '../../types/membership';
import type { PaymentStatus } from '../../types/application';

interface ApplicationCardProps {
  application: DirectorApplication;
  onStatusChange: (id: string, status: MembershipStatus) => void;
  onPaymentVerification: (id: string, status: PaymentStatus) => void;
  onImageSelect: (url: string) => void;
  onUpdate?: () => void;
  onRecheck: () => void; 
}

export function ApplicationCard({
  application,
  onStatusChange,
  onPaymentVerification,
  onImageSelect,
  onUpdate
}: ApplicationCardProps) {
  const { 
    director,
    loading,
    showPortfolio,
    fetchDirectorData,
    closePortfolio
    
  } = useDirectorPortfolio();

  const handlePortfolioClick = () => {
    fetchDirectorData(application.fullname_th);
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl duration-200">
      <ApplicationHeader 
        application={application}
        onImageSelect={onImageSelect}
        onPortfolioClick={handlePortfolioClick}
        isLoadingPortfolio={loading}
      />

      <div className="p-4 space-y-4">
        <ApplicationStatus
          application={application}
          onStatusChange={onStatusChange}
          onPaymentVerification={onPaymentVerification}
        />

        <DocumentBadges
          application={application}
          onImageSelect={onImageSelect}
        />

        <ApplicationActions
          application={application}
          onSuccess={onUpdate}
        />
      </div>

      <PortfolioDialog
        isOpen={showPortfolio}
        onClose={closePortfolio}
        director={director}
      />
    </div>
  );
}