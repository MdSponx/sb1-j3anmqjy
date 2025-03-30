import React from 'react';
import { ApplicationHeader } from './applications/ApplicationHeader';
import { ApplicationStatus } from './applications/ApplicationStatus';
import { DocumentBadges } from './applications/DocumentBadges';
import { ActionButtons } from './applications/ActionButtons';
import { PortfolioDialog } from './applications/PortfolioDialog';
import { useDirectorPortfolio } from '../hooks/useDirectorPortfolio';
import type { DirectorApplication } from '../types/application';

interface MemberCardProps {
  application: DirectorApplication;
  onStatusChange: (id: string, status: string) => void;
  onPaymentVerification: (id: string, status: string) => void;
  onImageSelect: (url: string) => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function MemberCard({
  application,
  onStatusChange,
  onPaymentVerification,
  onImageSelect,
  onApprove,
  onReject
}: MemberCardProps) {
  const { director, loading, fetchDirectorData, clearDirector } = useDirectorPortfolio();
  const [showPortfolio, setShowPortfolio] = React.useState(false);

  const handlePortfolioClick = async () => {
    await fetchDirectorData(application.fullname_th);
    setShowPortfolio(true);
  };

  const handleClosePortfolio = () => {
    setShowPortfolio(false);
    clearDirector();
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl duration-200">
      <ApplicationHeader 
        application={application} 
        onImageSelect={onImageSelect}
        onPortfolioClick={handlePortfolioClick}
        isLoading={loading}
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

        <ActionButtons
          onApprove={onApprove}
          onReject={onReject}
        />
      </div>

      <PortfolioDialog
        isOpen={showPortfolio}
        onClose={handleClosePortfolio}
        director={director}
      />
    </div>
  );
}