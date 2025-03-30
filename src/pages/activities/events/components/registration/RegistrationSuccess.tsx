import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import type { Event } from '../../types';

interface RegistrationSuccessProps {
  event: Event;
  onClose: () => void;
}

export function RegistrationSuccess({ event, onClose }: RegistrationSuccessProps) {
  const { language } = useLanguage();

  return (
    <div className="py-6 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">
        {language === 'th'
          ? 'ลงทะเบียนสำเร็จ'
          : 'Registration Successful'}
      </h3>

      <p className="text-gray-400 mb-6">
        {language === 'th'
          ? 'ขอบคุณที่ลงทะเบียนเข้าร่วมกิจกรรม เราจะส่งรายละเอียดเพิ่มเติมไปยังอีเมลของคุณ'
          : 'Thank you for registering. We will send more details to your email.'}
      </p>

      <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
        <h4 className="font-medium text-white mb-2">
          {event.title}
        </h4>
        <p className="text-sm text-gray-400">
          {new Date(event.date).toLocaleDateString(
            language === 'th' ? 'th-TH' : 'en-US',
            {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }
          )}
        </p>
        <p className="text-sm text-gray-400">{event.time}</p>
      </div>

      <Button
        onClick={onClose}
        className="bg-red-500 hover:bg-red-600"
      >
        {language === 'th' ? 'ปิด' : 'Close'}
      </Button>
    </div>
  );
}