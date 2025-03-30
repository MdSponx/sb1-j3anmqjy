import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Film, X, Search, Edit2, Upload, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { useFirebase } from '../../../../contexts/firebase';
import { useUserData } from '../../../../hooks/useUserData';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { departments, roles } from '../../../../data/professions';
import type { Movie } from '../../../../types/movie';

interface RoleSelectionDialogProps {
  movie: Movie;
  onClose: () => void;
  onSuccess: () => void;
}

export function RoleSelectionDialog({ movie, onClose, onSuccess }: RoleSelectionDialogProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { userData } = useUserData();
  const { db, storage } = useFirebase();
  const [responsibilities, setResponsibilities] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<{
    department_th: string;
    department_en: string;
    role_th: string;
    role_en: string;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(!selectedRole);
  const [query, setQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const uploadImages = async () => {
    if (!user || selectedFiles.length === 0) return [];

    const uploadPromises = selectedFiles.map(async (file) => {
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const imageRef = ref(storage, `crew_album/${user.uid}/${filename}`);
      
      await uploadBytes(imageRef, file);
      return getDownloadURL(imageRef);
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    if (!user || !selectedRole || !userData?.fullname_th) {
      setError(language === 'th' 
        ? 'ข้อมูลไม่ครบถ้วน' 
        : 'Missing required information');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload images first
      const imageUrls = await uploadImages();

      // Create credit document with status field and fullname_th
      await addDoc(collection(db, 'movie_credits'), {
        userId: user.uid,
        fullname_th: userData.fullname_th, // Add fullname_th from userData
        movieId: movie.id,
        movieTitle: movie.title,
        movieTitleEng: movie.titleEng,
        department_th: selectedRole.department_th,
        department_en: selectedRole.department_en,
        role_th: selectedRole.role_th,
        role_en: selectedRole.role_en,
        responsibilities,
        images: imageUrls,
        year: new Date(movie.release_date).getFullYear(),
        created_at: new Date().toISOString(),
        status: 'pending'
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error adding credit:', err);
      setError(language === 'th'
        ? 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
        : 'Error saving credit information');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (department: { th: string; en: string }, role: { th: string; en: string }) => {
    setSelectedRole({
      department_th: department.th,
      department_en: department.en,
      role_th: role.th,
      role_en: role.en
    });
    setIsSearching(false);
    setQuery('');
    setSelectedDepartment(null);
  };

  const getFilteredDepartments = () => {
    if (!query) return departments;

    return departments.filter(dept => {
      const deptMatch = 
        dept.th.toLowerCase().includes(query.toLowerCase()) ||
        dept.en.toLowerCase().includes(query.toLowerCase());

      const departmentRoles = roles[dept.en] || [];
      const hasMatchingRole = departmentRoles.some(role =>
        role.th.toLowerCase().includes(query.toLowerCase()) ||
        role.en.toLowerCase().includes(query.toLowerCase())
      );

      return deptMatch || hasMatchingRole;
    });
  };

  const filteredDepartments = getFilteredDepartments();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Film className="w-5 h-5 text-red-500" />
            <span>
              {language === 'th' ? 'เพิ่มผลงาน' : 'Add Credit'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Movie Info */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-white mb-1">
              {language === 'th' ? movie.title : movie.titleEng || movie.title}
            </h3>
            <p className="text-sm text-gray-400">
              {new Date(movie.release_date).getFullYear()}
            </p>
          </div>

          {/* Role Selection Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>
                {language === 'th' ? 'ตำแหน่งงาน' : 'Role'}
              </Label>
              {selectedRole && !isSearching && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearching(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {language === 'th' ? 'แก้ไข' : 'Edit'}
                </Button>
              )}
            </div>

            {isSearching ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={language === 'th' 
                      ? 'ค้นหาแผนกหรือตำแหน่งงาน' 
                      : 'Search departments or roles'}
                    className="pl-10 bg-gray-800 border-gray-700"
                  />
                </div>

                {/* Departments and Roles List - 2 Columns */}
                <div className="bg-gray-800 rounded-lg">
                  <div className="max-h-[400px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 p-4">
                      {filteredDepartments.map((dept, index) => {
                        const departmentRoles = roles[dept.en] || [];
                        return (
                          <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                            {/* Department Header */}
                            <div 
                              className="text-red-500 font-medium mb-2 cursor-pointer hover:text-red-400"
                              onClick={() => setSelectedDepartment(selectedDepartment === dept.en ? null : dept.en)}
                            >
                              {language === 'th' ? dept.th : dept.en}
                            </div>

                            {/* Roles */}
                            {(selectedDepartment === dept.en || query) && (
                              <div className="space-y-1">
                                {departmentRoles.map((role, roleIndex) => (
                                  <button
                                    key={roleIndex}
                                    onClick={() => handleRoleSelect(dept, role)}
                                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-600 transition-colors"
                                  >
                                    <span className="text-white text-sm">
                                      {language === 'th' ? role.th : role.en}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedRole && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-400">
                      {language === 'th' ? 'แผนก' : 'Department'}:
                    </span>
                    <span className="text-white ml-2">
                      {language === 'th' 
                        ? selectedRole.department_th 
                        : selectedRole.department_en}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">
                      {language === 'th' ? 'ตำแหน่ง' : 'Role'}:
                    </span>
                    <span className="text-white ml-2">
                      {language === 'th' 
                        ? selectedRole.role_th 
                        : selectedRole.role_en}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <Label htmlFor="responsibilities">
              {language === 'th' ? 'หน้าที่ความรับผิดชอบ' : 'Responsibilities'}
            </Label>
            <textarea
              id="responsibilities"
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder={language === 'th' 
                ? 'อธิบายหน้าที่และความรับผิดชอบของคุณในภาพยนตร์เรื่องนี้'
                : 'Describe your roles and responsibilities in this movie'
              }
            />
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-4">
            <Label>
              {language === 'th' ? 'รูปภาพผลงาน' : 'Work Photos'}
            </Label>
            
            {/* Drag and Drop Area */}
            <div 
              className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label 
                htmlFor="photos"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-500 mb-2" />
                <p className="text-gray-400 mb-1">
                  {language === 'th' 
                    ? 'ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์' 
                    : 'Drag and drop files here, or click to select'}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'th'
                    ? 'รองรับไฟล์ JPG และ PNG ขนาดไม่เกิน 10MB'
                    : 'Supports JPG and PNG files up to 10MB'}
                </p>
              </label>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-400">
            <ImageIcon className="w-4 h-4" />
            <span className="text-sm">
              {selectedFiles.length} {language === 'th' ? 'รูปที่เลือก' : 'photos selected'}
            </span>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600"
            >
              {language === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedRole || isSearching}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting
                ? language === 'th'
                  ? 'กำลังบันทึก...'
                  : 'Saving...'
                : language === 'th'
                ? 'บันทึก'
                : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}