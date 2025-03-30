import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { MovieCredit } from '../../../types/movieCredits';

interface ImageGalleryDialogProps {
  credit: MovieCredit;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageGalleryDialog({
  credit,
  isOpen,
  onClose
}: ImageGalleryDialogProps) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePrevious = () => {
    if (isTransitioning || !credit.images?.length) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + credit.images!.length) % credit.images!.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning || !credit.images?.length) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % credit.images!.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {language === 'th' ? 'แกลเลอรีรูปภาพ' : 'Image Gallery'}
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Display */}
          <div className="relative aspect-video overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {credit.images?.map((image, index) => (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0"
                >
                  <img
                    src={image}
                    alt={`${credit.movieTitle} - Image ${index + 1}`}
                    className="w-full h-full object-contain bg-black"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {credit.images && credit.images.length > 1 && (
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
                    ? `${currentIndex + 1} จาก ${credit.images.length}`
                    : `${currentIndex + 1} of ${credit.images.length}`}
                </div>
              </>
            )}
          </div>

          {/* Movie Info Footer */}
          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <h3 className="text-lg font-medium text-white mb-1">
              {language === 'th' 
                ? credit.movieTitle 
                : credit.movieTitleEng || credit.movieTitle}
            </h3>
            <p className="text-sm text-gray-400">
              {language === 'th' ? credit.role_th : credit.role_en}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}