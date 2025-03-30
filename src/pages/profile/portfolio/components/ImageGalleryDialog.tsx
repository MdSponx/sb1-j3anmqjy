import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { ChevronLeft, ChevronRight, X, Upload, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { useFirebase } from '../../../../contexts/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface ImageGalleryDialogProps {
  creditId: string;
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function ImageGalleryDialog({
  creditId,
  images,
  isOpen,
  onClose,
  onUpdate
}: ImageGalleryDialogProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { db, storage } = useFirebase();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePrevious = () => {
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleFileSelect = useCallback(async (files: File[]) => {
    if (!user || !creditId || isUploading) return;

    setIsUploading(true);
    setError(null);

    try {
      const validFiles = files.filter(file => {
        const isValid = file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024;
        return isValid;
      });

      if (validFiles.length === 0) {
        throw new Error(language === 'th'
          ? 'กรุณาเลือกไฟล์รูปภาพที่มีขนาดไม่เกิน 10MB'
          : 'Please select image files under 10MB');
      }

      const uploadPromises = validFiles.map(async (file) => {
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name}`;
        const imageRef = ref(storage, `crew_album/${user.uid}/${creditId}/${filename}`);
        
        await uploadBytes(imageRef, file);
        return getDownloadURL(imageRef);
      });

      const newImageUrls = await Promise.all(uploadPromises);
      
      // Update credit document with new images
      const creditRef = doc(db, 'movie_credits', creditId);
      await updateDoc(creditRef, {
        images: [...images, ...newImageUrls],
        updated_at: new Date().toISOString()
      });

      onUpdate();
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(err instanceof Error ? err.message : 'Error uploading images');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setIsDragging(false);
    }
  }, [user, creditId, images, storage, db, language, onUpdate]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      handleFileSelect(files);
    }
    setIsDragging(false);
  }, [handleFileSelect]);

  const handleDeleteImage = async () => {
    if (!user || !creditId || images.length === 0) return;

    try {
      const imageUrl = images[currentIndex];
      
      // Delete from storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      // Update credit document
      const creditRef = doc(db, 'movie_credits', creditId);
      const updatedImages = images.filter((_, index) => index !== currentIndex);
      await updateDoc(creditRef, {
        images: updatedImages,
        updated_at: new Date().toISOString()
      });

      // Update current index if needed
      if (currentIndex >= updatedImages.length) {
        setCurrentIndex(Math.max(0, updatedImages.length - 1));
      }

      onUpdate();
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(language === 'th'
        ? 'เกิดข้อผิดพลาดในการลบรูปภาพ'
        : 'Error deleting image');
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {language === 'th' ? 'แกลเลอรีรูปภาพ' : 'Image Gallery'}
          </DialogTitle>
        </DialogHeader>

        <div 
          className={`relative ${isDragging ? 'ring-2 ring-red-500' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 z-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Display */}
          {images.length > 0 ? (
            <div className="relative aspect-video overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="w-full h-full flex-shrink-0"
                  >
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-contain bg-black"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevious}
                    disabled={isTransitioning}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    disabled={isTransitioning}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                    {language === 'th'
                      ? `${currentIndex + 1} จาก ${images.length}`
                      : `${currentIndex + 1} of ${images.length}`}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gray-900 flex flex-col items-center justify-center">
              <Upload className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-gray-400 mb-2">
                {language === 'th' 
                  ? 'ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์' 
                  : 'Drag and drop files here, or click to select'}
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleFileSelect(files);
                }}
                id="gallery-upload"
              />
              <label
                htmlFor="gallery-upload"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg cursor-pointer"
              >
                {language === 'th' ? 'เลือกรูปภาพ' : 'Choose Images'}
              </label>
            </div>
          )}

          {/* Footer with Actions */}
          {images.length > 0 && (
            <div className="p-4 border-t border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    handleFileSelect(files);
                  }}
                  id="gallery-upload-more"
                />
                <label
                  htmlFor="gallery-upload-more"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  {language === 'th' ? 'เพิ่มรูปภาพ' : 'Add More Images'}
                </label>

                <Button
                  variant="outline"
                  onClick={handleDeleteImage}
                  className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-red-500/50"
                >
                  <Trash2 className="w-4 h-4" />
                  {language === 'th' ? 'ลบรูปภาพ' : 'Delete Image'}
                </Button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border-t border-red-500">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-gray-900 rounded-lg p-4 w-64">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-gray-400 mt-2">
                  {language === 'th' ? 'กำลังอัพโหลด...' : 'Uploading...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}