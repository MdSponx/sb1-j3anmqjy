import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface DocumentUploadProps {
  id: string;
  label: string;
  currentFile?: File;
  currentUrl?: string;
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  uploadProgress?: number;
}

export function DocumentUpload({
  id,
  label,
  currentFile,
  currentUrl,
  onFileSelect,
  isLoading,
  uploadProgress
}: DocumentUploadProps) {
  const { language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentUrl);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUrl(currentUrl);
  }, [currentUrl]);

  const handleClick = () => {
    if (!isLoading) {
      inputRef.current?.click();
    }
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError(language === 'th' 
        ? 'กรุณาอัพโหลดไฟล์ JPG หรือ PNG เท่านั้น'
        : 'Please upload only JPG or PNG files');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError(language === 'th'
        ? 'ขนาดไฟล์ต้องไม่เกิน 10MB กรุณาเลือกไฟล์ที่มีขนาดเล็กกว่านี้'
        : 'File size must not exceed 10MB. Please choose a smaller file.');
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (file && validateFile(file)) {
      onFileSelect(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6
          flex flex-col items-center justify-center space-y-2
          cursor-pointer transition-all duration-200
          ${isDragging ? 'border-red-500 bg-red-500/20' :
            previewUrl 
              ? 'border-red-500 bg-red-500/10' 
              : 'border-gray-700 hover:border-gray-600 bg-gray-800'
          }
        `}
      >
        {previewUrl ? (
          <div className="w-full">
            <img 
              src={previewUrl} 
              alt={label}
              className="w-full h-48 object-cover rounded-lg"
              onError={() => {
                setPreviewUrl(undefined);
                setError(language === 'th'
                  ? 'ไม่สามารถแสดงรูปภาพได้'
                  : 'Unable to display image');
              }}
            />
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm text-gray-300">
                {language === 'th' 
                  ? 'ลากไฟล์มาวางที่นี่ หรือคลิกเพื่ออัพโหลด' 
                  : 'Drag and drop here, or click to upload'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'th'
                  ? 'รองรับไฟล์ JPG และ PNG ขนาดไม่เกิน 10MB'
                  : 'JPG and PNG files up to 10MB are supported'}
              </p>
            </div>
          </>
        )}

        {uploadProgress !== undefined && uploadProgress > 0 && uploadProgress < 100 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
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

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        disabled={isLoading}
        className="hidden"
      />
    </div>
  );
}