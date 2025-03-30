import React from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import type { DirectorApplication } from '../../../types/application';

interface TableRowProps {
  member: DirectorApplication;
  onClick: () => void;
}

export function TableRow({ member, onClick }: TableRowProps) {
  const { language } = useLanguage();

  return (
    <tr 
      className="hover:bg-gray-800/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="py-3 px-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
          {member.profile_image_url ? (
            <img
              src={member.profile_image_url}
              alt={member.fullname_th}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-white">{member.fullname_th}</td>
      <td className="py-3 px-4 text-gray-300">{member.email}</td>
      <td className="py-3 px-4 text-gray-300">{member.phone}</td>
      <td className="py-3 px-4">
        <span className="px-2 py-1 text-sm rounded-full bg-blue-500/10 text-blue-400">
          {member.member_status}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 text-sm rounded-full ${
          member.payment_status === 'paid'
            ? 'bg-green-500/10 text-green-400'
            : member.payment_status === 'pending'
            ? 'bg-yellow-500/10 text-yellow-400'
            : 'bg-red-500/10 text-red-400'
        }`}>
          {member.payment_status === 'paid'
            ? language === 'th' ? 'ชำระแล้ว' : 'Paid'
            : member.payment_status === 'pending'
            ? language === 'th' ? 'รอตรวจสอบ' : 'Pending'
            : language === 'th' ? 'ยังไม่ชำระ' : 'Unpaid'}
        </span>
      </td>
    </tr>
  );
}