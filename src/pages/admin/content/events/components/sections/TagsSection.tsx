import React from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '../../../../../../components/ui/input';
import { Label } from '../../../../../../components/ui/label';
import { Button } from '../../../../../../components/ui/button';
import { useLanguage } from '../../../../../../contexts/LanguageContext';
import type { FormDataState } from '../types';

interface TagsSectionProps {
  formData: FormDataState;
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
  newCustomTag: string;
  setNewCustomTag: React.Dispatch<React.SetStateAction<string>>;
  handleTagToggle: (tag: string) => void;
  handleAddCustomTag: () => void;
  handleRemoveCustomTag: (tag: string) => void;
  predefinedTags: string[];
}

// Define multilingual tags structure
const MULTILINGUAL_TAGS = [
  { en: 'Discussion', th: 'เสวนา' },
  { en: 'Workshop', th: 'เวิร์คช็อป' },
  { en: 'Film Screening', th: 'ฉายภาพยนตร์' },
  { en: 'Film Premiere', th: 'รอบปฐมทัศน์' },
  { en: 'OFOS', th: 'ฉายรอบพิเศษ' },
  { en: 'Press Conference', th: 'แถลงข่าว' },
  { en: 'Recreation', th: 'สันทนาการ' }
] as const;

export function TagsSection({
  formData,
  setFormData,
  newCustomTag,
  setNewCustomTag,
  handleTagToggle,
  handleAddCustomTag,
  handleRemoveCustomTag
}: TagsSectionProps) {
  const { language } = useLanguage();

  return (
    <div className="space-y-4">
      <Label>
        {language === 'th' ? 'ประเภทกิจกรรม' : 'Event Tags'}
      </Label>

      {/* Predefined Tags */}
      <div className="flex flex-wrap gap-2">
        {MULTILINGUAL_TAGS.map((tag) => (
          <button
            key={tag.en}
            onClick={() => handleTagToggle(tag.en)} // Store English version as key
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${formData.tags.includes(tag.en)
                ? 'bg-red-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            {language === 'th' ? tag.th : tag.en}
          </button>
        ))}
      </div>

      {/* Custom Tags */}
      <div className="space-y-2">
        <Label>
          {language === 'th' ? 'แท็กที่กำหนดเอง' : 'Custom Tags'}
        </Label>
        <div className="flex gap-2">
          <Input
            value={newCustomTag}
            onChange={(e) => setNewCustomTag(e.target.value)}
            placeholder={language === 'th' ? 'เพิ่มแท็กใหม่' : 'Add new tag'}
            className="bg-gray-800 border-gray-700"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomTag();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddCustomTag}
            className="px-3 bg-gray-700 hover:bg-gray-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Display Custom Tags */}
        {formData.custom_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.custom_tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700 text-sm"
              >
                {tag}
                <button
                  onClick={() => handleRemoveCustomTag(tag)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}