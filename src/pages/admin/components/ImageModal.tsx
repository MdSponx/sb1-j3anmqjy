import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export function ImageModal({ isOpen, imageUrl, onClose }: ImageModalProps) {
  if (!imageUrl) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-0">
        <AlertDialogHeader className="absolute top-2 right-2 z-50">
          <AlertDialogTitle className="sr-only">View Image</AlertDialogTitle>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </AlertDialogHeader>
        <div className="relative w-full max-h-[80vh] rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Document"
            className="w-full h-full object-contain bg-black"
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}