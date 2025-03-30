import React, { useState, useRef } from 'react';
import { Camera, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { UploadProgress } from './UploadProgress';

interface PhotoContainerProps {
  profileImage?: string;
  coverImage?: string;
  onProfileImageSelect: (file: File) => void;
  onCoverImageSelect: (file: File) => void;
  profileUploadProgress?: number;
  coverUploadProgress?: number;
}

export function PhotoContainer({
  profileImage,
  coverImage,
  onProfileImageSelect,
  onCoverImageSelect,
  profileUploadProgress,
  coverUploadProgress
}: PhotoContainerProps) {
  const { language } = useLanguage();
  const [showCoverUpload, setShowCoverUpload] = useState(false);
  const [showProfileUpload, setShowProfileUpload] = useState(false);

  const defaultCoverImage = "https://firebasestorage.googleapis.com/v0/b/tfda-member-list.firebasestorage.app/o/Web%20Asset%2FPhotos%2FDSC06976.jpg?alt=media&token=2d628cf3-9914-4df4-932d-74bba445f874";

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onProfileImageSelect(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCoverImageSelect(file);
    }
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg overflow-hidden">
      {/* Cover Photo Container */}
      <div 
        className="relative h-[300px] w-full"
        onMouseEnter={() => setShowCoverUpload(true)}
        onMouseLeave={() => setShowCoverUpload(false)}
      >
        <img
          src={coverImage || defaultCoverImage}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Profile Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Profile Photo */}
          <div 
            className="relative group mb-4"
            onMouseEnter={() => setShowProfileUpload(true)}
            onMouseLeave={() => setShowProfileUpload(false)}
          >
            <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-800 border-4 border-gray-900 shadow-xl">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-600" />
                </div>
              )}
            </div>

            {/* Profile Photo Upload Button */}
            <label 
              className={`
                absolute inset-0 
                flex items-center justify-center 
                rounded-full 
                transition-all duration-200 ease-in-out
                ${showProfileUpload ? 'bg-black/50' : 'bg-transparent'}
                cursor-pointer
              `}
              title={language === 'th' ? 'อัพโหลดรูปโปรไฟล์' : 'Upload profile photo'}
            >
              <Camera 
                className={`
                  w-8 h-8 text-white 
                  transition-all duration-200 ease-in-out
                  ${showProfileUpload ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                `} 
              />
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={handleProfileUpload}
              />
            </label>

            {/* Profile Upload Progress */}
            {profileUploadProgress !== undefined && profileUploadProgress > 0 && profileUploadProgress < 100 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
                <UploadProgress progress={profileUploadProgress} />
              </div>
            )}
          </div>
        </div>

        {/* Cover Photo Upload Button */}
        <label 
          className={`
            absolute bottom-4 right-4 
            p-3 rounded-full 
            bg-black/50 hover:bg-black/70 
            cursor-pointer 
            transform transition-all duration-200 ease-in-out
            ${showCoverUpload ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}
          title={language === 'th' ? 'อัพโหลดภาพปก' : 'Upload cover photo'}
        >
          <Camera className="w-5 h-5 text-white" />
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png"
            onChange={handleCoverUpload}
          />
        </label>

        {/* Cover Upload Progress */}
        {coverUploadProgress !== undefined && coverUploadProgress > 0 && coverUploadProgress < 100 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <UploadProgress progress={coverUploadProgress} />
          </div>
        )}
      </div>
    </div>
  );
}