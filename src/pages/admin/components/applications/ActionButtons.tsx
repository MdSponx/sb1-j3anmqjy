import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface ActionButtonsProps {
  onApprove: () => void;
  onReject: () => void;
}

export function ActionButtons({ onApprove, onReject }: ActionButtonsProps) {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-2 pt-2">
      <Button
        variant="outline"
        className="bg-red-500/10 hover:bg-red-500/20 border-red-500/50 text-red-400 hover:text-red-300"
        onClick={onReject}
      >
        <X className="w-4 h-4 mr-2" />
        {language === 'th' ? 'ปฏิเสธ' : 'Reject'}
      </Button>
      <Button
        className="bg-emerald-500 hover:bg-emerald-600 text-white"
        onClick={onApprove}
      >
        <Check className="w-4 h-4 mr-2" />
        {language === 'th' ? 'อนุมัติ' : 'Approve'}
      </Button>
    </div>
  );
}