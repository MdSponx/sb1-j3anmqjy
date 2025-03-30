import React from 'react';
import { Input } from '../../../../../../components/ui/input';
import { Label } from '../../../../../../components/ui/label';
import { useLanguage } from '../../../../../../contexts/LanguageContext';
import type { FormDataState } from '../types';

interface LocationSectionProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
}

export function LocationSection({ formData, setFormData }: LocationSectionProps) {
  const { language } = useLanguage();

  const handlePaidAdmissionChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_paid: checked,
      is_free: checked ? false : prev.is_free // Uncheck free admission if paid is checked
    }));
  };

  const handleFreeAdmissionChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_free: checked,
      is_paid: checked ? false : prev.is_paid // Uncheck paid admission if free is checked
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
        {language === 'th' ? 'สถานที่' : 'Location'}
      </h3>

      {/* Venue */}
      <div>
        <Label htmlFor="venue" required>
          {language === 'th' ? 'สถานที่' : 'Venue'}
        </Label>
        <Input
          id="venue"
          value={formData.venue}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, venue: e.target.value }))
          }
          className="bg-gray-800 border-gray-700"
          required
        />
      </div>

      {/* Location URL */}
      <div>
        <Label htmlFor="locationUrl">
          {language === 'th' ? 'ลิงก์แผนที่' : 'Location URL'}
        </Label>
        <Input
          id="locationUrl"
          type="url"
          value={formData.locationUrl}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              locationUrl: e.target.value,
            }))
          }
          className="bg-gray-800 border-gray-700"
          placeholder="https://goo.gl/maps/..."
        />
      </div>

      {/* Admission and Registration Checkboxes */}
      <div className="space-y-3 pt-4 border-t border-gray-700">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_free}
            onChange={(e) => handleFreeAdmissionChange(e.target.checked)}
            className="rounded border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500"
          />
          <span className="text-white">
            {language === 'th' ? 'เข้าชมฟรี' : 'Free Admission'}
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_paid}
            onChange={(e) => handlePaidAdmissionChange(e.target.checked)}
            className="rounded border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500"
          />
          <span className="text-white">
            {language === 'th' ? 'มีค่าใช้จ่าย' : 'Paid Admission'}
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.requires_registration}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                requires_registration: e.target.checked,
                // Reset registration fields when unchecked
                registration_type: e.target.checked ? prev.registration_type : null,
                external_reg_url: e.target.checked ? prev.external_reg_url : '',
                unlimited_participants: e.target.checked ? prev.unlimited_participants : false,
                max_participants: e.target.checked ? prev.max_participants : 100
              }))
            }
            className="rounded border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500"
          />
          <span className="text-white">
            {language === 'th' ? 'ต้องลงทะเบียนล่วงหน้า' : 'Registration Required'}
          </span>
        </label>
      </div>
    </div>
  );
}