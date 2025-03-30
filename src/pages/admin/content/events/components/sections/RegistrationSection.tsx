import React from 'react';
import { Link } from 'lucide-react';
import { Input } from '../../../../../../components/ui/input';
import { Label } from '../../../../../../components/ui/label';
import { useLanguage } from '../../../../../../contexts/LanguageContext';
import type { FormDataState } from '../types';

interface RegistrationSectionProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
}

export function RegistrationSection({ formData, setFormData }: RegistrationSectionProps) {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
        {language === 'th' ? 'การลงทะเบียน' : 'Registration'}
      </h3>

      {/* Registration Type */}
      <div className="space-y-4">
        <Label>
          {language === 'th' ? 'ช่องทางการลงทะเบียน' : 'Registration Channel'}
        </Label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={formData.registration_type === 'tfda'}
              onChange={() =>
                setFormData(prev => ({
                  ...prev,
                  registration_type: 'tfda',
                  external_reg_url: ''
                }))
              }
              className="rounded-full border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500"
            />
            <span className="text-white">
              {language === 'th' 
                ? 'ลงทะเบียนผ่านระบบของสมาคมฯ' 
                : 'Register through TFDA system'}
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={formData.registration_type === 'external'}
              onChange={() =>
                setFormData(prev => ({
                  ...prev,
                  registration_type: 'external'
                }))
              }
              className="rounded-full border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500"
            />
            <span className="text-white">
              {language === 'th' 
                ? 'ลงทะเบียนผ่านช่องทางภายนอก' 
                : 'External registration'}
            </span>
          </label>
        </div>

        {formData.registration_type === 'external' && (
          <div>
            <Label htmlFor="external_reg_url" required>
              {language === 'th' ? 'ลิงก์ลงทะเบียน' : 'Registration URL'}
            </Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="external_reg_url"
                type="url"
                value={formData.external_reg_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    external_reg_url: e.target.value,
                  }))
                }
                className="pl-10 bg-gray-800 border-gray-700"
                placeholder="https://..."
                required
              />
            </div>
          </div>
        )}

        {formData.registration_type === 'tfda' && (
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.unlimited_participants}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    unlimited_participants: e.target.checked
                  }))
                }
                className="rounded border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500"
              />
              <span className="text-white">
                {language === 'th' 
                  ? 'ไม่จำกัดจำนวนผู้เข้าร่วม' 
                  : 'Unlimited participants'}
              </span>
            </label>

            {!formData.unlimited_participants && (
              <div>
                <Label htmlFor="max_participants">
                  {language === 'th' ? 'จำนวนผู้เข้าร่วมสูงสุด' : 'Maximum Participants'}
                </Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      max_participants: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}