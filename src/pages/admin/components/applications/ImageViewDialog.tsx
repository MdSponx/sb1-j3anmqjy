import React from 'react';
import { X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogTitle 
} from '../../../../components/ui/dialog';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface ImageViewDialogProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export function ImageViewDialog({ isOpen, imageUrl, onClose }: ImageViewDialogProps) {
  const { language } = useLanguage();

  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-transparent border-0 max-w-4xl">
        <DialogTitle className="sr-only">
          {language === 'th' ? 'ดูรูปภาพ' : 'View Image'}
        </DialogTitle>
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label={language === 'th' ? 'ปิด' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={imageUrl}
            alt={language === 'th' ? 'ภาพเอกสาร' : 'Document Preview'}
            className="w-full max-h-[80vh] object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}