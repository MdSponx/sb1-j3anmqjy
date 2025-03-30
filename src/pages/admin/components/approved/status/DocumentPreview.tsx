import React from 'react';
import { Eye } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';

interface DocumentPreviewProps {
  label: string;
  imageUrl?: string;
  onImageSelect: (url: string) => void;
}

export function DocumentPreview({ label, imageUrl, onImageSelect }: DocumentPreviewProps) {
  const { language } = useLanguage();

  return (
    <div>
      <label className="text-sm text-gray-400 mb-2 block">{label}</label>
      <button
        onClick={() => imageUrl && onImageSelect(imageUrl)}
        disabled={!imageUrl}
        className={`w-full aspect-[3/2] rounded-lg overflow-hidden flex items-center justify-center ${
          imageUrl ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-800 cursor-not-allowed'
        }`}
      >
        {imageUrl ? (
          <div className="relative w-full h-full">
            <img
              src={imageUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
              <Eye className="w-8 h-8 text-white" />
            </div>
          </div>
        ) : (
          <span className="text-gray-500">
            {language === 'th' ? 'ไม่มีรูปภาพ' : 'No image'}
          </span>
        )}
      </button>
    </div>
  );
}