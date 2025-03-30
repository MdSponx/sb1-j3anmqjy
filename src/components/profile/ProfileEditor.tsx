import React, { useState, useRef } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { PhotoContainer } from './PhotoContainer';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ContactInfoForm } from './ContactInfoForm';
import { DocumentUploadBox } from './DocumentUploadBox';
import { DocumentUploadBoxCrew } from './DocumentUploadBoxCrew';
import { StatusBanner } from './StatusBanner';
import { StatusBannerCrew } from './StatusBannerCrew';
import { StatusBannerPublic } from './StatusBannerPublic';
import { DeleteProfileDialog } from './DeleteProfileDialog';
import { ReAuthDialog } from './ReAuthDialog';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFirebase } from '../../contexts/firebase';
import { uploadUserFile } from '../../lib/firebase/storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import type { ProfileFormData } from '../../types/profile';

interface ProfileEditorProps {
  initialData: ProfileFormData;
  title: string;
}

export function ProfileEditor({ initialData, title }: ProfileEditorProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { db } = useFirebase();
  const [formData, setFormData] = useState(initialData);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReAuthDialog, setShowReAuthDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Add refs for scrolling
  const paymentSlipRef = useRef<HTMLDivElement>(null);
  const idCardRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = async (type: string, file: File) => {
    if (!user) return;

    setUploadProgress(prev => ({ ...prev, [type]: 0 }));

    try {
      const url = await uploadUserFile(
        user.uid,
        file,
        type as 'profile_image' | 'cover_image' | 'id_card_image' | 'payment_slip',
        (progress) => {
          setUploadProgress(prev => ({ ...prev, [type]: progress }));
        }
      );

      const updates: Partial<ProfileFormData> = {
        [`${type}_url`]: url,
      };

      // Set payment status to pending when payment slip is uploaded
      if (type === 'payment_slip') {
        updates.payment_status = 'pending';
      }

      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updated_at: new Date().toISOString()
      });

      setFormData(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์ กรุณาลองใหม่อีกครั้ง'
          : 'An error occurred while uploading the file. Please try again.'
      );
    } finally {
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        updated_at: new Date().toISOString()
      });

      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง'
          : 'An error occurred while saving your profile. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      
      window.location.href = '/';
    } catch (err: any) {
      console.error('Error deleting profile:', err);
      
      if (err.code === 'auth/requires-recent-login') {
        setShowReAuthDialog(true);
      } else {
        setError(
          language === 'th'
            ? 'เกิดข้อผิดพลาดในการลบโปรไฟล์ กรุณาลองใหม่อีกครั้ง'
            : 'An error occurred while deleting your profile. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleViewProfile = () => {
    window.location.href = '/profile/public';
  };

  const handleContinueEditing = () => {
    setShowSuccessDialog(false);
  };

  // Add scroll handlers
  const handlePaymentStatusClick = () => {
    paymentSlipRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleMemberStatusClick = () => {
    idCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const isCrew = formData.occupation === 'crew';
  const isDirector = formData.occupation === 'director';
  const isStudent = ['school student', 'college student'].includes(formData.occupation || '');
  const isPublicMember = formData.occupation === 'general people';
  const shouldShowCrewDocuments = isCrew && formData.plan_selection === 'Pro';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isCrew ? (
        <StatusBannerCrew 
          occupation={formData.occupation}
          department_th={formData.department_th}
          department_en={formData.department_en}
          role_th={formData.role_th}
          role_en={formData.role_en}
          planSelection={formData.plan_selection}
          onRoleClick={() => window.location.href = '/register/department'}
        />
      ) : isPublicMember || isStudent ? (
        <StatusBannerPublic
          occupation={formData.occupation}
          planSelection={formData.plan_selection}
        />
      ) : (
        <StatusBanner 
          occupation={formData.occupation}
          memberStatus={formData.member_status}
          paymentStatus={formData.payment_status}
          planSelection={formData.plan_selection}
          verificationStatus={formData.verification_status}
          idCardUrl={formData.id_card_image_url}
          paymentSlipUrl={formData.payment_slip_url}
          onMemberStatusClick={handleMemberStatusClick}
          onPaymentStatusClick={handlePaymentStatusClick}
        />
      )}

      <PhotoContainer
        profileImage={formData.profile_image_url}
        coverImage={formData.cover_image_url}
        onProfileImageSelect={(file) => handleFileSelect('profile_image', file)}
        onCoverImageSelect={(file) => handleFileSelect('cover_image', file)}
        profileUploadProgress={uploadProgress.profile_image}
        coverUploadProgress={uploadProgress.cover_image}
      />

      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
        <PersonalInfoForm
          values={formData}
          onChange={handleInputChange}
          required={true}
        />
      </div>

      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
        <ContactInfoForm
          values={formData}
          onChange={handleInputChange}
          required={true}
        />
      </div>

      {/* Always show document upload for directors, show for crew only with Pro plan */}
      {(isDirector || shouldShowCrewDocuments) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div ref={idCardRef}>
            <DocumentUploadBox
              type="id_card"
              currentFile={null}
              currentUrl={formData.id_card_image_url}
              onFileSelect={(file) => handleFileSelect('id_card_image', file)}
              onConfirm={() => {}}
              isLoading={uploadProgress.id_card_image > 0}
              uploadProgress={uploadProgress.id_card_image}
            />
          </div>

          <div ref={paymentSlipRef}>
            {isCrew ? (
              <DocumentUploadBoxCrew
                type="payment_slip"
                currentFile={null}
                currentUrl={formData.payment_slip_url}
                onFileSelect={(file) => handleFileSelect('payment_slip', file)}
                onConfirm={() => {}}
                isLoading={uploadProgress.payment_slip > 0}
                uploadProgress={uploadProgress.payment_slip}
              />
            ) : (
              <DocumentUploadBox
                type="payment_slip"
                currentFile={null}
                currentUrl={formData.payment_slip_url}
                onFileSelect={(file) => handleFileSelect('payment_slip', file)}
                onConfirm={() => {}}
                isLoading={uploadProgress.payment_slip > 0}
                uploadProgress={uploadProgress.payment_slip}
              />
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button
          type="button"
          onClick={() => setShowDeleteDialog(true)}
          variant="outline"
          className="w-48 h-12 text-base bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 border-red-500/50"
        >
          {language === 'th' ? 'ลบโปรไฟล์' : 'Delete Profile'}
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-48 h-12 text-base bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
        >
          {isSubmitting
            ? language === 'th'
              ? 'กำลังบันทึก...'
              : 'Saving...'
            : language === 'th'
            ? 'บันทึกการเปลี่ยนแปลง'
            : 'Save Changes'}
        </Button>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'th' 
                ? 'บันทึกข้อมูลสำเร็จ' 
                : 'Profile Updated Successfully'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">
              {language === 'th'
                ? 'คุณต้องการดูโปรไฟล์สาธารณะหรือแก้ไขข้อมูลต่อ?'
                : 'Would you like to view your public profile or continue editing?'}
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              onClick={handleContinueEditing}
              variant="outline"
              className="flex-1"
            >
              {language === 'th' ? 'แก้ไขต่อ' : 'Continue Editing'}
            </Button>
            <Button
              onClick={handleViewProfile}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              {language === 'th' ? 'ดูโปรไฟล์' : 'View Profile'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteProfileDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteProfile}
        fullNameEn={formData.fullname_en || ''}
      />

      <ReAuthDialog
        isOpen={showReAuthDialog}
        onClose={() => setShowReAuthDialog(false)}
        onSuccess={handleDeleteProfile}
        user={user}
      />
    </form>
  );
}