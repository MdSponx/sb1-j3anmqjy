import React, { useState, useEffect } from 'react';
import { X, Trash2, Upload } from 'lucide-react';
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useFirebase } from '../../../../../contexts/firebase';
import { useAuth } from '../../../../../contexts/AuthContext';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';
import { uploadEventFile } from '../../../../../lib/firebase/storage';
import { TagsSection } from './sections/TagsSection';
import type { Project, ProjectStatus } from '../../../../../types/project';

interface ProjectEditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSaveSuccess: () => void;
}

const initialFormState = {
  title: '',
  status: 'Open' as ProjectStatus,
  description: '',
  startDate: '',
  endDate: '',
  applicationDeadline: '',
  image: '',
  applicationUrl: '',
  organizer: '',
  is_tfda_event: false,
  registration_type: null as 'tfda' | 'external' | null,
  external_reg_url: '',
  unlimited_participants: false,
  max_participants: 100,
  tags: [] as string[],
  custom_tags: [] as string[],
  isHighlight: false
};

export function ProjectEditorPanel({
  isOpen,
  onClose,
  project,
  onSaveSuccess
}: ProjectEditorPanelProps) {
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

    if (project) {
      setFormData({
        title: project.title || '',
        status: project.status || 'Open',
        description: project.description || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        applicationDeadline: project.applicationDeadline || '',
        image: project.image || '',
        applicationUrl: project.applicationUrl || '',
        organizer: project.organizer || '',
        is_tfda_event: project.is_tfda_event || false,
        registration_type: project.registration_type || null,
        external_reg_url: project.external_reg_url || '',
        unlimited_participants: project.unlimited_participants || false,
        max_participants: project.max_participants || 100,
        tags: project.tags || [],
        custom_tags: project.custom_tags || [],
        isHighlight: project.isHighlight || false
      });
      setImagePreview(project.image || '');
    }
  }, [isOpen, project]);

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
    if (!project?.id || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'projects', project.id));
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการลบโครงการ'
          : 'Error deleting project'
      );
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !formData.title.trim()) {
      setError(language === 'th' 
        ? 'กรุณากรอกชื่อโครงการ' 
        : 'Please enter project title');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError(language === 'th'
        ? 'กรุณาเลือกวันที่เริ่มต้นและสิ้นสุด'
        : 'Please select start and end dates');
      return;
    }

    if (formData.registration_type === 'external' && !formData.external_reg_url) {
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

      const projectData = {
        ...formData,
        image: imageUrl,
        updated_at: new Date().toISOString(),
        updated_by: user.uid
      };

      if (project?.id) {
        await updateDoc(doc(db, 'projects', project.id), projectData);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          created_at: new Date().toISOString(),
          created_by: user.uid
        });
      }

      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving project:', err);
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
          : 'Error saving project data'
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
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {project
                ? language === 'th'
                  ? 'แก้ไขโครงการ'
                  : 'Edit Project'
                : language === 'th'
                ? 'เพิ่มโครงการ'
                : 'Add Project'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <Label className="block mb-2">
                {language === 'th' ? 'รูปภาพโครงการ' : 'Project Image'}
              </Label>
              <div
                className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative group cursor-pointer"
                onClick={() => document.getElementById('project-image')?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Project preview"
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
                  id="project-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="title" required>
                {language === 'th' ? 'ชื่อโครงการ' : 'Project Title'}
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

            <div>
              <Label htmlFor="status" required>
                {language === 'th' ? 'สถานะ' : 'Status'}
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as ProjectStatus,
                  }))
                }
              >
                <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                  <SelectValue placeholder={language === 'th' ? 'เลือกสถานะ' : 'Select Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">
                    {language === 'th' ? 'เปิดรับสมัคร' : 'Open'}
                  </SelectItem>
                  <SelectItem value="Ongoing">
                    {language === 'th' ? 'กำลังดำเนินการ' : 'Ongoing'}
                  </SelectItem>
                  <SelectItem value="Coming Soon">
                    {language === 'th' ? 'เร็วๆ นี้' : 'Coming Soon'}
                  </SelectItem>
                  <SelectItem value="Closed">
                    {language === 'th' ? 'ปิดรับสมัคร' : 'Closed'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" required>
                  {language === 'th' ? 'วันที่เริ่มต้น' : 'Start Date'}
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                      endDate: prev.endDate < e.target.value ? e.target.value : prev.endDate
                    }))
                  }
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate" required>
                  {language === 'th' ? 'วันที่สิ้นสุด' : 'End Date'}
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="bg-gray-800 border-gray-700"
                  min={formData.startDate}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="applicationDeadline">
                {language === 'th' ? 'วันปิดรับสมัคร' : 'Application Deadline'}
              </Label>
              <Input
                id="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    applicationDeadline: e.target.value,
                  }))
                }
                className="bg-gray-800 border-gray-700"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="description" required>
                {language === 'th' ? 'รายละเอียด' : 'Description'}
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_tfda_event: e.target.checked,
                      organizer: e.target.checked ? 'สมาคมผู้กำกับภาพยนตร์ไทย' : prev.organizer
                    }))
                  }
                  className="rounded border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500"
                />
                <span className="text-white">
                  {language === 'th' 
                    ? 'จัดโดยสมาคมผู้กำกับภาพยนตร์ไทย' 
                    : 'Organized by Thai Film Director Association'}
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isHighlight"
                checked={formData.isHighlight}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isHighlight: e.target.checked,
                  }))
                }
                className="rounded border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500"
              />
              <label htmlFor="isHighlight" className="text-white">
                {language === 'th' ? 'แสดงเป็นโครงการเด่น' : 'Featured Project'}
              </label>
            </div>

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
                    className="bg-gray-800 border-gray-700"
                    placeholder="https://"
                    required
                  />
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

            <TagsSection
              formData={formData}
              setFormData={setFormData}
              newCustomTag={newCustomTag}
              setNewCustomTag={setNewCustomTag}
              handleTagToggle={handleTagToggle}
              handleAddCustomTag={handleAddCustomTag}
              handleRemoveCustomTag={handleRemoveCustomTag}
            />

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
          </div>
        </div>

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
            
            {project && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                className="border-purple-600 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 hover:text-purple-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {language === 'th' ? 'ลบโครงการ' : 'Delete'}
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
              : project
              ? language === 'th'
                ? 'บันทึกการแก้ไข'
                : 'Save Changes'
              : language === 'th'
              ? 'บันทึก'
              : 'Save'}
          </Button>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                {language === 'th' 
                  ? 'ยืนยันการลบโครงการ' 
                  : 'Confirm Delete Project'}
              </h3>
              <p className="text-gray-300 mb-6">
                {language === 'th'
                  ? 'คุณแน่ใจหรือไม่ที่จะลบโครงการนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้'
                  : 'Are you sure you want to delete this project? This action cannot be undone.'}
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
                    ? 'ลบโครงการ'
                    : 'Delete Project'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}