import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useFirebase } from '../../../../../contexts/firebase';
import { useAuth } from '../../../../../contexts/AuthContext';
import { Button } from '../../../../../components/ui/button';
import { uploadEventFile } from '../../../../../lib/firebase/storage';
import { GeneralSection } from './sections/GeneralSection';
import { DateTimeSection } from './sections/DateTimeSection';
import { LocationSection } from './sections/LocationSection';
import { RegistrationSection } from './sections/RegistrationSection';
import { TicketSection } from './sections/TicketSection';
import { TagsSection } from './sections/TagsSection';
import type { Event } from '../../../../activities/events/types';

interface EventEditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  event: Event | null;
  onSaveSuccess: () => void;
}

const PREDEFINED_TAGS = [
  'Discussion',
  'Workshop',
  'Film Screening',
  'Film Premiere',
  'OFOS',
  'Press Conference',
  'Recreation'
];

const initialFormState = {
  date: '',
  title: '',
  description: '',
  fullDescription: '',
  startTime: '09:00',
  endTime: '17:00',
  endDate: '',
  venue: '',
  locationUrl: '',
  image: '',
  ticketInfo: '',
  isLarge: false,
  is_free: true,
  is_paid: false,
  requires_registration: false,
  organizer: '',
  is_tfda_event: false,
  tags: [],
  custom_tags: [],
  registration_type: null,
  external_reg_url: '',
  unlimited_participants: false,
  max_participants: 100,
  ticket_purchase_url: '',
  original_url: '', // Added original_url field
};

export function EventEditorPanel({
  isOpen,
  onClose,
  selectedDate,
  event,
  onSaveSuccess,
}: EventEditorPanelProps) {
  const { language } = useLanguage();
  const { db } = useFirebase();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newCustomTag, setNewCustomTag] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setImageFile(null);
      setImagePreview('');
      setUploadProgress(0);
      setError(null);
      setShowDeleteConfirm(false);
      setNewCustomTag('');
      return;
    }

    if (event) {
      // Load existing event data
      const [startTime = '09:00', endTime = '17:00'] = event.time?.split(' - ') || [];
      setFormData({
        date: event.date,
        title: event.title || '',
        description: event.description || '',
        fullDescription: event.fullDescription || '',
        startTime,
        endTime,
        endDate: event.endDate || event.date || '',
        venue: event.venue || '',
        locationUrl: event.locationUrl || '',
        image: event.image || '',
        ticketInfo: event.ticketInfo || '',
        isLarge: event.isLarge || false,
        is_free: event.is_free || false,
        is_paid: event.is_paid || false,
        requires_registration: event.requires_registration || false,
        organizer: event.organizer || '',
        is_tfda_event: event.is_tfda_event || false,
        tags: event.tags || [],
        custom_tags: event.custom_tags || [],
        registration_type: event.registration_type || null,
        external_reg_url: event.external_reg_url || '',
        unlimited_participants: event.unlimited_participants || false,
        max_participants: event.max_participants || 100,
        ticket_purchase_url: event.ticket_purchase_url || '',
        original_url: event.original_url || '', // Load original_url
      });
      setImagePreview(event.image || '');
    } else if (selectedDate) {
      // Initialize new event with selected date
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormData({
        ...initialFormState,
        date: formattedDate,
        endDate: formattedDate,
      });
    }
  }, [isOpen, event, selectedDate]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleAddCustomTag = () => {
    if (newCustomTag.trim() && !formData.custom_tags.includes(newCustomTag.trim())) {
      setFormData(prev => ({
        ...prev,
        custom_tags: [...prev.custom_tags, newCustomTag.trim()]
      }));
      setNewCustomTag('');
    }
  };

  const handleRemoveCustomTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      custom_tags: prev.custom_tags.filter(t => t !== tag)
    }));
  };

  const handleDelete = async () => {
    if (!event?.id || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'events', event.id));
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการลบกิจกรรม'
          : 'Error deleting event'
      );
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !formData.date) {
      setError(language === 'th' 
        ? 'กรุณาเลือกวันที่จัดกิจกรรม' 
        : 'Please select an event date');
      return;
    }

    // Validate required fields
    if (!formData.title.trim()) {
      setError(language === 'th' 
        ? 'กรุณากรอกชื่อกิจกรรม' 
        : 'Please enter event title');
      return;
    }

    if (!formData.venue.trim()) {
      setError(language === 'th'
        ? 'กรุณากรอกสถานที่จัดกิจกรรม'
        : 'Please enter event venue');
      return;
    }

    if (formData.requires_registration && formData.registration_type === 'external' && !formData.external_reg_url) {
      setError(language === 'th'
        ? 'กรุณากรอกลิงก์สำหรับลงทะเบียน'
        : 'Please enter registration URL');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        imageUrl = await uploadEventFile(imageFile, (progress) => {
          setUploadProgress(progress);
        });
      }

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim(),
        date: formData.date,
        endDate: formData.endDate || formData.date,
        time: `${formData.startTime} - ${formData.endTime}`,
        venue: formData.venue.trim(),
        locationUrl: formData.locationUrl.trim(),
        image: imageUrl,
        ticketInfo: formData.ticketInfo.trim(),
        isLarge: formData.isLarge,
        is_free: formData.is_free,
        is_paid: formData.is_paid,
        requires_registration: formData.requires_registration,
        organizer: formData.organizer.trim(),
        is_tfda_event: formData.is_tfda_event,
        tags: formData.tags,
        custom_tags: formData.custom_tags,
        registration_type: formData.registration_type,
        external_reg_url: formData.external_reg_url.trim(),
        unlimited_participants: formData.unlimited_participants,
        max_participants: formData.max_participants,
        ticket_purchase_url: formData.ticket_purchase_url.trim(),
        original_url: formData.original_url.trim(), // Save original_url
        updated_at: new Date().toISOString(),
        updated_by: user.uid,
      };

      if (event?.id) {
        await updateDoc(doc(db, 'events', event.id), eventData);
      } else {
        await addDoc(collection(db, 'events'), {
          ...eventData,
          created_at: new Date().toISOString(),
          created_by: user.uid,
        });
      }

      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving event:', err);
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
          : 'Error saving event data'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-[600px] bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {event
                ? language === 'th'
                  ? 'แก้ไขกิจกรรม'
                  : 'Edit Event'
                : language === 'th'
                ? 'เพิ่มกิจกรรม'
                : 'Add Event'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            <GeneralSection
              formData={formData}
              setFormData={setFormData}
              handleImageSelect={handleImageSelect}
              imagePreview={imagePreview}
              uploadProgress={uploadProgress}
            />

            <DateTimeSection
              formData={formData}
              setFormData={setFormData}
            />

            <LocationSection
              formData={formData}
              setFormData={setFormData}
            />

            {formData.requires_registration && (
              <RegistrationSection
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {formData.is_paid && (
              <TicketSection
                formData={formData}
                setFormData={setFormData}
              />
            )}

            <TagsSection
              formData={formData}
              setFormData={setFormData}
              newCustomTag={newCustomTag}
              setNewCustomTag={setNewCustomTag}
              handleTagToggle={handleTagToggle}
              handleAddCustomTag={handleAddCustomTag}
              handleRemoveCustomTag={handleRemoveCustomTag}
              predefinedTags={PREDEFINED_TAGS}
            />

            {/* Featured Event Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isLarge"
                checked={formData.isLarge}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isLarge: e.target.checked,
                  }))
                }
                className="rounded border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500"
              />
              <label htmlFor="isLarge" className="text-white">
                {language === 'th' ? 'แสดงเป็นกิจกรรมเด่น' : 'Featured Event'}
              </label>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-gray-700 text-white hover:bg-gray-800 w-32"
            >
              {language === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Button>
            
            {event && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                className="border-purple-600 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 hover:text-purple-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {language === 'th' ? 'ลบกิจกรรม' : 'Delete'}
              </Button>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-red-500 hover:bg-red-600 w-32"
          >
            {isSubmitting
              ? language === 'th'
                ? 'กำลังบันทึก...'
                : 'Saving...'
              : event
              ? language === 'th'
                ? 'บันทึกการแก้ไข'
                : 'Save Changes'
              : language === 'th'
              ? 'บันทึก'
              : 'Save'}
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                {language === 'th' 
                  ? 'ยืนยันการลบกิจกรรม' 
                  : 'Confirm Delete Event'}
              </h3>
              <p className="text-gray-300 mb-6">
                {language === 'th'
                  ? 'คุณแน่ใจหรือไม่ที่จะลบกิจกรรมนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้'
                  : 'Are you sure you want to delete this event? This action cannot be undone.'}
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="border-gray-600"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting
                    ? language === 'th'
                      ? 'กำลังลบ...'
                      : 'Deleting...'
                    : language === 'th'
                    ? 'ลบกิจกรรม'
                    : 'Delete Event'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}