import React, { useState } from 'react';
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
import { useProjectRegistration } from '../../hooks/useProjectRegistration';
import type { Project } from '../../../../../types/project';

interface ProjectRegistrationDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

type RegistrationStep = 'status-check' | 'form' | 'success';

export function ProjectRegistrationDialog({ project, isOpen, onClose }: ProjectRegistrationDialogProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('status-check');
  const [isClosing, setIsClosing] = useState(false);
  const { 
    checkRegistrationStatus, 
    registerForProject,
    cancelRegistration,
    loading, 
    error 
  } = useProjectRegistration(project.id);

  // Reset step when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep('status-check');
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
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
  };

  const handleStatusCheckComplete = () => {
    setCurrentStep('form');
  };

  const handleRegistrationSubmit = async (formData: any) => {
    if (!user) return;

    try {
      await registerForProject({
        ...formData,
        userId: user.uid,
        projectId: project.id
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
            project={project}
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
            project={project}
            onSubmit={handleRegistrationSubmit}
            loading={loading}
            error={error}
          />
        );
      case 'success':
        return (
          <RegistrationSuccess
            project={project}
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
            {language === 'th' ? 'ลงทะเบียนเข้าร่วมโครงการ' : 'Project Registration'}
          </DialogTitle>
        </DialogHeader>

        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}