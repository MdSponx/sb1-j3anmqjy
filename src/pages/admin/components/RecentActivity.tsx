import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

export function RecentActivity() {
  const { language } = useLanguage();

  const activities = [
    {
      type: 'member_approval',
      user: 'สมชาย ใจดี',
      time: '2 นาทีที่แล้ว',
      timeEn: '2 minutes ago'
    },
    {
      type: 'payment_verified',
      user: 'วิชัย รักดี',
      time: '15 นาทีที่แล้ว',
      timeEn: '15 minutes ago'
    },
    {
      type: 'role_assigned',
      user: 'สมศรี มีสุข',
      time: '1 ชั่วโมงที่แล้ว',
      timeEn: '1 hour ago'
    }
  ];

  const getActivityText = (activity: typeof activities[0]) => {
    if (language === 'th') {
      switch (activity.type) {
        case 'member_approval':
          return `อนุมัติสมาชิกใหม่: ${activity.user}`;
        case 'payment_verified':
          return `ยืนยันการชำระเงิน: ${activity.user}`;
        case 'role_assigned':
          return `กำหนดสิทธิ์ผู้ใช้: ${activity.user}`;
        default:
          return '';
      }
    } else {
      switch (activity.type) {
        case 'member_approval':
          return `New member approved: ${activity.user}`;
        case 'payment_verified':
          return `Payment verified: ${activity.user}`;
        case 'role_assigned':
          return `Role assigned to: ${activity.user}`;
        default:
          return '';
      }
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div 
          key={index}
          className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
        >
          <p className="text-gray-300">{getActivityText(activity)}</p>
          <span className="text-sm text-gray-500">
            {language === 'th' ? activity.time : activity.timeEn}
          </span>
        </div>
      ))}
    </div>
  );
}