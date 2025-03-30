import React from 'react';
import { Film, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { Director } from '../../../../types/director';

interface PortfolioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  director: Director | null;
}

export function PortfolioDialog({ isOpen, onClose, director }: PortfolioDialogProps) {
  const { language } = useLanguage();

  if (!director) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Film className="w-5 h-5 text-red-500" />
            <span>
              {language === 'th' ? 'ผลงานการกำกับ' : 'Directing Portfolio'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label={language === 'th' ? 'ปิด' : 'Close'}
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-400 border-b border-gray-700 pb-2">
            <span>{language === 'th' ? 'ผลงานทั้งหมด' : 'Total Works'}</span>
            <span className="text-red-500 font-medium">{director.totalWorks}</span>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {director.movies.map((movie, index) => (
              <div 
                key={index}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <p className="text-white">{movie}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}