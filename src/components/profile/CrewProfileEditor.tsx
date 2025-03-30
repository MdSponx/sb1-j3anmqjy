import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { PhotoContainer } from './PhotoContainer';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ContactInfoForm } from './ContactInfoForm';
import { StatusBannerCrew } from './StatusBannerCrew';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFirebase } from '../../contexts/firebase';
import { uploadUserFile } from '../../lib/firebase/storage';
import type { ProfileFormData } from '../../types/profile';

interface CrewProfileEditorProps {
  initialData: ProfileFormData;
}

export function CrewProfileEditor({ initialData }: CrewProfileEditorProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { db } = useFirebase();
  const [formData, setFormData] = useState(initialData);
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
        type as 'profile_image' | 'cover_image',
        (progress) => {
          setUploadProgress(prev => ({ ...prev, [type]: progress }));
        }
      );

      await updateDoc(doc(db, 'users', user.uid), {
        [`${type}_url`]: url,
        updated_at: new Date().toISOString()
      });

      setFormData(prev => ({ ...prev, [`${type}_url`]: url }));
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StatusBannerCrew
        occupation={formData.occupation}
        department_th={formData.department_th}
        department_en={formData.department_en}
        role_th={formData.role_th}
        role_en={formData.role_en}
        planSelection={formData.plan_selection}
        onRoleClick={() => window.location.href = '/register/department'}
      />

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
  );
}