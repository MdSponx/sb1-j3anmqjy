import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../../components/ui/dialog';
import { X } from 'lucide-react';
import { MovieForm } from './MovieForm';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import type { Movie } from '../../../../../types/movie';

interface MovieDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movie?: Movie;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
}

export function MovieDialog({
  isOpen,
  onClose,
  movie,
  onSubmit,
  isSubmitting
}: MovieDialogProps) {
  const { language } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {movie
              ? language === 'th' ? 'แก้ไขข้อมูลภาพยนตร์' : 'Edit Movie'
              : language === 'th' ? 'เพิ่มภาพยนตร์' : 'Add Movie'}
          </DialogTitle>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>

        <MovieForm
          onSubmit={onSubmit}
          initialData={movie}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}