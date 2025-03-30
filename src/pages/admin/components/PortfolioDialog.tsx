import React from 'react';
import { Film, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
} from '../../../components/ui/alert-dialog';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Director } from '../../../types/director';

interface PortfolioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  director: Director | null;
}

export function PortfolioDialog({ isOpen, onClose, director }: PortfolioDialogProps) {
  const { language } = useLanguage();

  if (!director) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Close Button - Absolute positioned */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Film className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-white">
              {language === 'th' ? 'ผลงานการกำกับ' : 'Directing Portfolio'}
            </h2>
          </div>

          {/* Portfolio Content */}
          <div className="space-y-4">
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
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}