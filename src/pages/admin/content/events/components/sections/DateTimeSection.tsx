import React from 'react';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '../../../../../../components/ui/input';
import { Label } from '../../../../../../components/ui/label';
import { useLanguage } from '../../../../../../contexts/LanguageContext';
import type { FormDataState } from '../types';

interface DateTimeSectionProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
}

export function DateTimeSection({ formData, setFormData }: DateTimeSectionProps) {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
        {language === 'th' ? 'วันและเวลา' : 'Date & Time'}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Start Time */}
        <div>
          <Label htmlFor="startTime" required>
            {language === 'th' ? 'เวลาเริ่ม' : 'Start Time'}
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  startTime: e.target.value,
                }))
              }
              className="pl-10 bg-gray-800 border-gray-700"
              required
            />
          </div>
        </div>

        {/* End Time */}
        <div>
          <Label htmlFor="endTime">
            {language === 'th' ? 'เวลาสิ้นสุด' : 'End Time'}
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  endTime: e.target.value,
                }))
              }
              className="pl-10 bg-gray-800 border-gray-700"
            />
          </div>
        </div>
      </div>

      {/* End Date */}
      <div>
        <Label htmlFor="endDate">
          {language === 'th' ? 'วันที่สิ้นสุด' : 'End Date'}
        </Label>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                endDate: e.target.value,
              }))
            }
            className="pl-10 bg-gray-800 border-gray-700"
            min={formData.date}
          />
        </div>
      </div>
    </div>
  );
}