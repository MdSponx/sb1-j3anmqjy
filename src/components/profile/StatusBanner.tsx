import React from 'react';
import { Crown, CreditCard, UserCheck, BadgeCheck, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface StatusBannerProps {
  occupation?: string;
  memberStatus?: string;
  paymentStatus?: string;
  planSelection?: string;
  verificationStatus?: string;
  idCardUrl?: string;
  paymentSlipUrl?: string;
  onMemberStatusClick?: () => void;
  onPaymentStatusClick?: () => void;
}

export function StatusBanner({ 
  occupation, 
  memberStatus, 
  paymentStatus, 
  planSelection,
  verificationStatus,
  idCardUrl,
  paymentSlipUrl,
  onMemberStatusClick,
  onPaymentStatusClick
}: StatusBannerProps) {
  const { language } = useLanguage();

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };

  const getVerificationStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getVerificationStatusText = (status?: string) => {
    if (!status) return '-';
    
    if (language === 'th') {
      switch (status) {
        case 'approved':
          return 'ยืนยันแล้ว';
        case 'pending':
          return 'รอการยืนยัน';
        case 'rejected':
          return 'ไม่ผ่านการยืนยัน';
        default:
          return '-';
      }
    } else {
      switch (status) {
        case 'approved':
          return 'Verified';
        case 'pending':
          return 'Pending';
        case 'rejected':
          return 'Rejected';
        default:
          return '-';
      }
    }
  };

  const StatusBox = ({ 
    icon: Icon, 
    title, 
    value, 
    description,
    valueColor = 'text-white',
    onClick,
    clickable = false
  }: {
    icon: React.ElementType;
    title: string;
    value: string;
    description?: string;
    valueColor?: string;
    onClick?: () => void;
    clickable?: boolean;
  }) => (
    <div 
      className={`bg-gray-800 rounded-lg p-4 flex-1 ${clickable ? 'cursor-pointer hover:bg-gray-700 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-red-500" />
        <h3 className="text-sm text-gray-400">{title}</h3>
      </div>
      <p className={`text-base font-medium ${valueColor} mb-1`}>{value}</p>
      {description && (
        <p className="text-[10px] leading-tight text-gray-400">{description}</p>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-5 gap-2">
      {/* Occupation */}
      <StatusBox
        icon={UserCheck}
        title={language === 'th' ? 'อาชีพ' : 'Occupation'}
        value={occupation || '-'}
      />

      {/* Plan */}
      <StatusBox
        icon={Crown}
        title={language === 'th' ? 'แพ็คเกจ' : 'Plan'}
        value={planSelection || '-'}
      />

      {/* Member Status */}
      <StatusBox
        icon={BadgeCheck}
        title={language === 'th' ? 'ประเภทสมาชิก' : 'Member Status'}
        value={memberStatus || '-'}
        description={!idCardUrl 
          ? language === 'th' ? 'คลิกเพื่ออัพโหลดรูปบัตรประชาชน' : 'Click to upload ID card'
          : language === 'th' ? 'รอตรวจสอบบัตรประชาชน' : 'Waiting for verification'
        }
        onClick={onMemberStatusClick}
        clickable={true}
      />

      {/* Payment Status */}
      <StatusBox
        icon={CreditCard}
        title={language === 'th' ? 'สถานะการชำระเงิน' : 'Payment Status'}
        value={paymentStatus ? (
          language === 'th' ? 
            paymentStatus === 'paid' ? 'ชำระแล้ว' :
            paymentStatus === 'pending' ? 'รอตรวจสอบ' : 'ยังไม่ชำระ'
          :
            paymentStatus === 'paid' ? 'Paid' :
            paymentStatus === 'pending' ? 'Pending' : 'Unpaid'
        ) : '-'}
        valueColor={getPaymentStatusColor(paymentStatus)}
        description={!paymentSlipUrl
          ? language === 'th' ? 'คลิกเพื่ออัพโหลดสลิป' : 'Click to upload slip'
          : language === 'th' ? 'รอตรวจสอบการชำระเงิน' : 'Waiting for verification'
        }
        onClick={onPaymentStatusClick}
        clickable={true}
      />

      {/* Verification Status */}
      <StatusBox
        icon={ShieldCheck}
        title={language === 'th' ? 'สถานะการยืนยัน' : 'Verification'}
        value={getVerificationStatusText(verificationStatus)}
        valueColor={getVerificationStatusColor(verificationStatus)}
      />
    </div>
  );
}