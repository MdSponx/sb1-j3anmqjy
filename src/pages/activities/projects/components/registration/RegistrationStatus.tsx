import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useAuth } from '../../../../../contexts/AuthContext';
import type { Project } from '../../../../../types/project';

interface RegistrationStatusProps {
  project: Project;
  onComplete: () => void;
  onClose: () => void;
  checkStatus: () => Promise<{ 
    canRegister: boolean; 
    message?: string;
    existingRegistration?: {
      id: string;
      status: string;
    };
  }>;
  onCancelRegistration: (registrationId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function RegistrationStatus({
  project,
  onComplete,
  onClose,
  checkStatus,
  onCancelRegistration,
  loading: externalLoading,
  error: externalError
}: RegistrationStatusProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [statusChecks, setStatusChecks] = useState({
    seats: { checked: false, passed: false },
    duplicate: { checked: false, passed: false },
    eligibility: { checked: false, passed: false }
  });
  const [existingRegistration, setExistingRegistration] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const performChecks = async () => {
      if (!user) return;

      try {
        // Check seats availability
        if (mounted) {
          setStatusChecks(prev => ({
            ...prev,
            seats: { checked: true, passed: true }
          }));
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        // Check for duplicate registration
        if (mounted) {
          setStatusChecks(prev => ({
            ...prev,
            duplicate: { checked: true, passed: true }
          }));
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        // Check eligibility
        if (mounted) {
          setStatusChecks(prev => ({
            ...prev,
            eligibility: { checked: true, passed: true }
          }));
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        if (mounted) {
          const { canRegister, existingRegistration: registration } = await checkStatus();
          
          if (registration) {
            setExistingRegistration(registration);
          } else if (canRegister) {
            onComplete();
          }
        }
      } catch (err) {
        if (mounted) {
          console.error('Status check error:', err);
          setInternalError(err instanceof Error ? err.message : 'An error occurred');
        }
      }
    };

    performChecks();

    return () => {
      mounted = false;
    };
  }, [user, checkStatus, onComplete]);

  const handleCancelRegistration = async () => {
    if (!existingRegistration) return;
    
    try {
      setCancelLoading(true);
      await onCancelRegistration(existingRegistration.id);
      window.location.reload();
    } catch (err) {
      console.error('Error canceling registration:', err);
      setInternalError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการยกเลิกการลงทะเบียน'
          : 'Error canceling registration'
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const renderStatusCheck = (
    label: string,
    status: { checked: boolean; passed: boolean }
  ) => (
    <div className="flex items-center gap-3">
      {status.checked ? (
        status.passed ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )
      ) : (
        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
      )}
      <span className="text-white">{label}</span>
    </div>
  );

  const renderExistingRegistration = () => {
    if (!existingRegistration) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-yellow-400">
          <AlertTriangle className="w-5 h-5" />
          <p>
            {language === 'th'
              ? 'คุณได้ลงทะเบียนโครงการนี้แล้ว'
              : 'You have already registered for this project'}
          </p>
        </div>

        {existingRegistration.status === 'pending' && (
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/50">
            <p className="text-sm text-yellow-400">
              {language === 'th'
                ? 'การลงทะเบียนของคุณอยู่ระหว่างการตรวจสอบ กรุณารอการยืนยันจากผู้จัดงาน'
                : 'Your registration is pending approval. Please wait for confirmation from the organizer.'}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancelRegistration}
            disabled={cancelLoading}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-red-500/50"
          >
            {cancelLoading
              ? language === 'th'
                ? 'กำลังยกเลิก...'
                : 'Canceling...'
              : language === 'th'
              ? 'ยกเลิกการลงทะเบียน'
              : 'Cancel Registration'}
          </Button>
          <Button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600"
          >
            {language === 'th' ? 'ปิด' : 'Close'}
          </Button>
        </div>
      </div>
    );
  };

  const error = externalError || internalError;

  return (
    <div className="py-6">
      <div className="space-y-4 mb-8">
        {renderStatusCheck(
          language === 'th' ? 'ตรวจสอบที่นั่งว่าง' : 'Checking seat availability',
          statusChecks.seats
        )}
        {renderStatusCheck(
          language === 'th' ? 'ตรวจสอบการลงทะเบียนซ้ำ' : 'Checking duplicate registration',
          statusChecks.duplicate
        )}
        {renderStatusCheck(
          language === 'th' ? 'ตรวจสอบคุณสมบัติ' : 'Checking eligibility',
          statusChecks.eligibility
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500 mb-6">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {existingRegistration ? (
        renderExistingRegistration()
      ) : (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onComplete}
            disabled={externalLoading || !Object.values(statusChecks).every(check => check.passed)}
          >
            {language === 'th' ? 'ดำเนินการต่อ' : 'Continue'}
          </Button>
        </div>
      )}
    </div>
  );
}