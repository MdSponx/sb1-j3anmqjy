import React, { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../../components/ui/dialog';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useAuth } from '../../../../../contexts/AuthContext';
import { RegistrationStatus } from './RegistrationStatus';
import { RegistrationForm } from './RegistrationForm';
import { RegistrationSuccess } from './RegistrationSuccess';
import { useEventRegistration } from '../../hooks/useEventRegistration';
import type { Event } from '../../types';

interface RegistrationDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

type RegistrationStep = 'status-check' | 'form' | 'success';

export function RegistrationDialog({ event, isOpen, onClose }: RegistrationDialogProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('status-check');
  const [isClosing, setIsClosing] = useState(false);
  const { 
    checkRegistrationStatus, 
    registerForEvent,
    cancelRegistration,
    loading, 
    error 
  } = useEventRegistration(event.id);

  // Reset step when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep('status-check');
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Add a small delay before actually closing
    setTimeout(() => {
      onClose();
      // Reset step after dialog is fully closed
      setTimeout(() => {
        setCurrentStep('status-check');
        setIsClosing(false);
      }, 200);
    }, 100);
  }, [onClose]);

  const handleStatusCheckComplete = useCallback(() => {
    setCurrentStep('form');
  }, []);

  const handleRegistrationSubmit = async (formData: any) => {
    if (!user) return;

    try {
      await registerForEvent({
        ...formData,
        userId: user.uid,
        eventId: event.id
      });
      setCurrentStep('success');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const renderStep = () => {
    if (isClosing) return null;

    switch (currentStep) {
      case 'status-check':
        return (
          <RegistrationStatus
            event={event}
            onComplete={handleStatusCheckComplete}
            onClose={handleClose}
            checkStatus={checkRegistrationStatus}
            onCancelRegistration={cancelRegistration}
            loading={loading}
            error={error}
          />
        );
      case 'form':
        return (
          <RegistrationForm
            event={event}
            onSubmit={handleRegistrationSubmit}
            loading={loading}
            error={error}
          />
        );
      case 'success':
        return (
          <RegistrationSuccess
            event={event}
            onClose={handleClose}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {language === 'th' ? 'ลงทะเบียนเข้าร่วมกิจกรรม' : 'Event Registration'}
          </DialogTitle>
        </DialogHeader>

        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}