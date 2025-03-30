import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../../components/ui/dialog';
import { Button } from '../../../../../components/ui/button';
import { ChevronLeft, ChevronRight, X, Film } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../components/ui/select';
import type { CreditRequest } from '../types';

interface CreditConfirmationDialogProps {
  credit: CreditRequest;
  onClose: () => void;
  onStatusUpdate: (creditId: string, status: string) => Promise<void>;
}

export function CreditConfirmationDialog({
  credit,
  onClose,
  onStatusUpdate
}: CreditConfirmationDialogProps) {
  const { language } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState(credit.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onStatusUpdate(credit.id, selectedStatus);
      onClose();
    } catch (err) {
      setError(language === 'th'
        ? 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
        : 'Error saving changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {language === 'th' ? 'ตรวจสอบเครดิตผลงาน' : 'Credit Verification'}
          </DialogTitle>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Gallery */}
          <div className="h-[calc(100vh-300px)] overflow-y-auto pr-4">
            {credit.images && credit.images.length > 0 ? (
              <div className="grid grid-cols-2 auto-rows-[200px] gap-4">
                {credit.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`rounded-lg overflow-hidden ${
                      index % 3 === 0 ? 'row-span-2' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Work sample ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full rounded-lg bg-gray-800 flex items-center justify-center">
                <p className="text-gray-400">
                  {language === 'th' ? 'ไม่มีรูปภาพ' : 'No images'}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Movie Details with Poster */}
            <div className="flex gap-4 bg-gray-800 rounded-lg p-4">
              <div className="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden bg-gray-700">
                {credit.moviePoster ? (
                  <img
                    src={credit.moviePoster}
                    alt={credit.movieTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {language === 'th' 
                    ? credit.movieTitle 
                    : credit.movieTitleEng || credit.movieTitle}
                </h3>
                <p className="text-sm text-gray-400">
                  {credit.year}
                </p>
              </div>
            </div>

            {/* Crew Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  {language === 'th' ? 'ทีมงาน' : 'Crew Member'}
                </h3>
                <p className="text-lg text-white">
                  {language === 'th' 
                    ? credit.userNameTh 
                    : credit.userNameEn || credit.userNameTh}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">
                  {language === 'th' ? 'ตำแหน่ง' : 'Position'}
                </h3>
                <p className="text-lg text-white">
                  {language === 'th' ? credit.role_th : credit.role_en}
                </p>
              </div>

              {credit.responsibilities && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    {language === 'th' ? 'หน้าที่ความรับผิดชอบ' : 'Responsibilities'}
                  </h3>
                  <p className="text-white">
                    {credit.responsibilities}
                  </p>
                </div>
              )}
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">
                {language === 'th' ? 'สถานะการรับรอง' : 'Verification Status'}
              </h3>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">
                    {language === 'th' ? 'อนุมัติ' : 'Approved'}
                  </SelectItem>
                  <SelectItem value="rejected">
                    {language === 'th' ? 'ปฏิเสธ' : 'Rejected'}
                  </SelectItem>
                  <SelectItem value="pending">
                    {language === 'th' ? 'รอตรวจสอบ' : 'Pending'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="border-gray-600"
              >
                {language === 'th' ? 'ยกเลิก' : 'Cancel'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-red-500 hover:bg-red-600"
              >
                {isSubmitting
                  ? language === 'th'
                    ? 'กำลังบันทึก...'
                    : 'Saving...'
                  : language === 'th'
                  ? 'บันทึกการเปลี่ยนแปลง'
                  : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}