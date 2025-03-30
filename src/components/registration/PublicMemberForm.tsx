import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFirebase } from '../../contexts/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '../ui/button';
import type { PublicMemberType } from '../../types/public-member';

export function PublicMemberForm() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { db } = useFirebase();
  const [selected, setSelected] = useState<PublicMemberType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = [
    {
      value: 'school student',
      labelTh: 'นักเรียน',
      labelEn: 'Student (School)'
    },
    {
      value: 'college student',
      labelTh: 'นิสิตนักศึกษา',
      labelEn: 'College Student'
    },
    {
      value: 'general people',
      labelTh: 'ประชาชนทั่วไป',
      labelEn: 'General Public'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await setDoc(doc(db, 'users', user.uid), {
        occupation: selected,
        plan_selection: 'Public',
        verification_status: 'pending',
        updated_at: new Date().toISOString()
      }, { merge: true });

      window.location.href = '/edit-profile';
    } catch (err) {
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
          : 'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          {language === 'th'
            ? 'คุณต้องการสมัครเว็บไซท์นี้ในฐานะอะไรครับ?'
            : 'Which of the following describes you?'}
        </h2>

        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.value}
              className={`
                block relative p-4 rounded-lg border-2 cursor-pointer
                transition-all duration-200
                ${selected === option.value
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="occupation"
                    value={option.value}
                    checked={selected === option.value}
                    onChange={() => setSelected(option.value as PublicMemberType)}
                    className="sr-only"
                  />
                  <div
                    className={`
                      w-5 h-5 rounded-full border-2 mr-3
                      transition-colors duration-200
                      ${selected === option.value
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-500'
                      }
                    `}
                  >
                    {selected === option.value && (
                      <div className="w-full h-full rounded-full bg-white transform scale-[0.4]" />
                    )}
                  </div>
                  <span className="text-white">
                    {language === 'th' ? option.labelTh : option.labelEn}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!selected || isSubmitting}
        className={`
          w-full bg-red-500 hover:bg-red-600 text-white
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
        `}
      >
        {isSubmitting
          ? language === 'th'
            ? 'กำลังบันทึก...'
            : 'Saving...'
          : language === 'th'
          ? 'ยืนยัน'
          : 'Confirm'}
      </Button>
    </form>
  );
}