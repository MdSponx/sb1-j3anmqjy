import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ProfileSidebar } from '../../../components/profile/ProfileSidebar';
import { PhotoContainer } from '../../../components/profile/PhotoContainer';
import { PersonalInfoForm } from '../../../components/profile/PersonalInfoForm';
import { ContactInfoForm } from '../../../components/profile/ContactInfoForm';
import { DocumentUploadBox } from '../../../components/profile/DocumentUploadBox';
import { DocumentUploadBoxCrew } from '../../../components/profile/DocumentUploadBoxCrew';
import { StatusBanner } from '../../../components/profile/StatusBanner';
import { StatusBannerCrew } from '../../../components/profile/StatusBannerCrew';
import { StatusBannerPublic } from '../../../components/profile/StatusBannerPublic';
import { Button } from '../../../components/ui/button';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useFirebase } from '../../../contexts/firebase';
import { uploadUserFile } from '../../../lib/firebase/storage';
import type { ProfileFormData } from '../../../types/profile';

interface ProfileEditorProps {
  initialData: ProfileFormData | null;
  title: string;
}

export function ProfileEditor({ initialData, title }: ProfileEditorProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { db } = useFirebase();
  const [formData, setFormData] = useState(initialData || {});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      window.location.href = '/profile';
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

  const isCrew = formData.occupation === 'crew';
  const isDirector = formData.occupation === 'director';
  const isPublicMember = ['school student', 'college student', 'general people'].includes(formData.occupation || '');
  const shouldShowDocuments = (isDirector || isCrew) && formData.plan_selection === 'Pro';

  return (
    <>
      <div className="md:w-64 md:sticky md:top-32 md:self-start">
        <ProfileSidebar />
      </div>
      
      <div className="flex-1">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400">
            {language === 'th' ? 'อีเมล' : 'Email'}: {user?.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
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
          ) : isPublicMember ? (
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
            />
          </div>

          <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
            <ContactInfoForm
              values={formData}
              onChange={handleInputChange}
            />
          </div>

          {shouldShowDocuments && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DocumentUploadBox
                type="id_card"
                currentFile={null}
                currentUrl={formData.id_card_image_url}
                onFileSelect={(file) => handleFileSelect('id_card_image', file)}
                onConfirm={() => {}}
                isLoading={uploadProgress.id_card_image > 0}
                uploadProgress={uploadProgress.id_card_image}
              />

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
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              onClick={() => window.location.href = '/profile'}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3"
            >
              {language === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 disabled:opacity-50"
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
        </form>
      </div>
    </>
  );
}