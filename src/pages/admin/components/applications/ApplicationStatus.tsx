import React from 'react';
import { MembershipSelect } from './status/MembershipSelect';
import { PaymentSelect } from './status/PaymentSelect';
import type { DirectorApplication } from '../../types/application';
import type { MembershipStatus } from '../../types/membership';
import type { PaymentStatus } from '../../types/application';

interface ApplicationStatusProps {
  application: DirectorApplication;
  onStatusChange: (id: string, status: MembershipStatus) => void;
  onPaymentVerification: (id: string, status: PaymentStatus) => void;
  disabled?: boolean;
}

export function ApplicationStatus({
  application,
  onStatusChange,
  onPaymentVerification,
  disabled
}: ApplicationStatusProps) {
  const handleMembershipChange = (status: MembershipStatus) => {
    onStatusChange(application.id, status);
  };

  const handlePaymentChange = (status: PaymentStatus) => {
    onPaymentVerification(application.id, status);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <MembershipSelect
        value={application.member_status}
        onChange={handleMembershipChange}
        disabled={disabled}
      />
      <PaymentSelect
        value={application.payment_status}
        onChange={handlePaymentChange}
        disabled={disabled}
      />
    </div>
  );
}