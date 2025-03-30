import React from 'react';
import { Calendar as CalendarIcon, Upload, Link } from 'lucide-react';
import { Input } from '../../../../../../components/ui/input';
import { Label } from '../../../../../../components/ui/label';
import { Button } from '../../../../../../components/ui/button';
import { useLanguage } from '../../../../../../contexts/LanguageContext';
import type { FormDataState } from '../types';

interface GeneralSectionProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  handleDateChange: (date: string) => void;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string;
  uploadProgress: number;
}

export function GeneralSection({
  formData,
  setFormData,
  handleDateChange,
  handleImageSelect,
  imagePreview,
  uploadProgress
}: GeneralSectionProps) {
  const { language } = useLanguage();

  const handleTfdaOrganizerChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_tfda_event: checked,
      organizer: checked ? 'สมาคมผู้กำกับภาพยนตร์ไทย' : prev.organizer
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
        {language === 'th' ? 'ข้อมูลทั่วไป' : 'General Information'}
      </h3>

      {/* Event Date */}
      <div>
        <Label htmlFor="date" required>
          {language === 'th' ? 'วันที่จัดกิจกรรม' : 'Event Date'}
        </Label>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700"
            required
          />
        </div>
      </div>

      {/* Event Image */}
      <div>
        <Label className="block mb-2">
          {language === 'th' ? 'รูปภาพกิจกรรม' : 'Event Image'}
        </Label>
        <div
          className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative group cursor-pointer"
          onClick={() => document.getElementById('event-image')?.click()}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Event preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Upload className="w-12 h-12 text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">
                {language === 'th'
                  ? 'คลิกเพื่ออัพโหลด'
                  : 'Click to upload'}
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          <input
            id="event-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="title" required>
          {language === 'th' ? 'ชื่อกิจกรรม' : 'Event Title'}
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="bg-gray-800 border-gray-700"
          required
        />
      </div>

      {/* Organizer */}
      <div className="space-y-2">
        <Label htmlFor="organizer" required>
          {language === 'th' ? 'ผู้จัดงาน' : 'Organizer'}
        </Label>
        <Input
          id="organizer"
          value={formData.organizer}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, organizer: e.target.value }))
          }
          className="bg-gray-800 border-gray-700"
          required
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_tfda_event}
            onChange={(e) => handleTfdaOrganizerChange(e.target.checked)}
            className="rounded border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500"
          />
          <span className="text-white">
            {language === 'th' 
              ? 'จัดโดยสมาคมผู้กำกับภาพยนตร์ไทย' 
              : 'Organized by Thai Film Director Association'}
          </span>
        </label>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" required>
          {language === 'th' ? 'คำอธิบายสั้น' : 'Short Description'}
        </Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          className="bg-gray-800 border-gray-700"
          required
        />
      </div>

      {/* Full Description */}
      <div>
        <Label htmlFor="fullDescription">
          {language === 'th' ? 'รายละเอียดเพิ่มเติม' : 'Full Description'}
        </Label>
        <textarea
          id="fullDescription"
          value={formData.fullDescription}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              fullDescription: e.target.value,
            }))
          }
          rows={4}
          className="w-full rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      {/* Original Link */}
      <div>
        <Label htmlFor="original_url">
          {language === 'th' ? 'ลิงก์ต้นฉบับ' : 'Original Link'}
        </Label>
        <div className="relative">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="original_url"
            type="url"
            value={formData.original_url || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                original_url: e.target.value,
              }))
            }
            className="pl-10 bg-gray-800 border-gray-700"
            placeholder="https://"
          />
        </div>
      </div>
    </div>
  );
}