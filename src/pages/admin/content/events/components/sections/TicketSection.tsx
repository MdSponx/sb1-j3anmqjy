import React from 'react';
import { Link } from 'lucide-react';
import { Input } from '../../../../../../components/ui/input';
import { Label } from '../../../../../../components/ui/label';
import { useLanguage } from '../../../../../../contexts/LanguageContext';
import type { FormDataState } from '../types';

interface TicketSectionProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
}

export function TicketSection({ formData, setFormData }: TicketSectionProps) {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
        {language === 'th' ? 'ข้อมูลบัตร' : 'Ticket Information'}
      </h3>

      <div>
        <Label htmlFor="ticketInfo">
          {language === 'th' ? 'รายละเอียดบัตร' : 'Ticket Details'}
        </Label>
        <Input
          id="ticketInfo"
          value={formData.ticketInfo}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              ticketInfo: e.target.value,
            }))
          }
          className="bg-gray-800 border-gray-700"
          placeholder={language === 'th' 
            ? 'เช่น ราคาบัตร 500 - 2,000 บาท' 
            : 'ex. Ticket price 500 - 2,000 THB'}
        />
      </div>

      <div>
        <Label htmlFor="ticket_purchase_url">
          {language === 'th' ? 'ลิงก์สำหรับซื้อบัตร' : 'Ticket Purchase URL'}
        </Label>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="ticket_purchase_url"
            type="url"
            value={formData.ticket_purchase_url}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                ticket_purchase_url: e.target.value,
              }))
            }
            className="pl-10 bg-gray-800 border-gray-700"
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  );
}