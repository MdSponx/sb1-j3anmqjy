import React from 'react';
import { Button } from '../../../../components/ui/button';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useApplicationApproval } from '../../hooks/useApplicationApproval';
import type { DirectorApplication } from '../../types/application';

interface ApplicationActionsProps {
  application: DirectorApplication;
  onSuccess?: () => void;
  className?: string;
}

export function ApplicationActions({ 
  application,
  onSuccess,
  className = ''
}: ApplicationActionsProps) {
  const { language } = useLanguage();
  const { handleApproval, handleRejection } = useApplicationApproval();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsLoading(true);
    setError(null);

    try {
      if (action === 'approve') {
        await handleApproval(application.id);
      } else {
        await handleRejection(application.id);
      }
      
      // Call onSuccess callback after successful update
      if (onSuccess) {
        setTimeout(onSuccess, 500); // Small delay to ensure DB update is complete
      }
    } catch (err) {
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
          : 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={() => handleAction('reject')}
          disabled={isLoading}
          className="bg-red-500/10 hover:bg-red-500/20 border-red-500/50 text-red-400 hover:text-red-300"
        >
          {language === 'th' ? 'ปฏิเสธ' : 'Reject'}
        </Button>
        
        <Button
          onClick={() => handleAction('approve')}
          disabled={isLoading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          {isLoading
            ? language === 'th'
              ? 'กำลังดำเนินการ...'
              : 'Processing...'
            : language === 'th'
            ? 'อนุมัติ'
            : 'Approve'}
        </Button>
      </div>
    </div>
  );
}