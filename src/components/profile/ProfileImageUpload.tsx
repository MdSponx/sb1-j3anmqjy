import React, { useState, useRef } from 'react';
import { User, Upload } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProfileImageUploadProps {
  currentImage?: string;
  onImageSelect: (file: File) => void;
  isLoading?: boolean;
  uploadProgress?: number;
}

export function ProfileImageUpload({
  currentImage,
  onImageSelect,
  isLoading,
  uploadProgress
}: ProfileImageUploadProps) {
  const { language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);

  // Update preview when currentImage changes
  React.useEffect(() => {
    setPreviewUrl(currentImage);
  }, [currentImage]);

  const handleClick = () => {
    if (!isLoading) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelect(file);

      // Cleanup preview URL when component unmounts
      return () => URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700
                   hover:border-red-500 transition-colors cursor-pointer group"
        onClick={handleClick}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={() => setPreviewUrl(undefined)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-20 h-20 text-gray-600" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center 
                      opacity-0 group-hover:opacity-100 transition-opacity">
          <Upload className="w-8 h-8 text-white" />
        </div>

        {uploadProgress !== undefined && uploadProgress > 0 && uploadProgress < 100 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="w-4/5">
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-red-500 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/50 to-red-500 animate-pulse" />
                </div>
              </div>
              <p className="text-xs text-white text-center mt-2">
                {Math.round(uploadProgress)}%
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="text-center">
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className="text-red-500 hover:text-red-400 text-sm font-medium disabled:opacity-50"
        >
          {language === 'th' ? 'อัพโหลดรูปภาพ' : 'Upload new image'}
        </button>
        <p className="text-gray-400 text-xs mt-1">
          {language === 'th' 
            ? 'ขนาดที่แนะนำ 800x800px (JPG, PNG)' 
            : 'Recommended size 800x800px (JPG, PNG)'}
        </p>
      </div>
    </div>
  );
}