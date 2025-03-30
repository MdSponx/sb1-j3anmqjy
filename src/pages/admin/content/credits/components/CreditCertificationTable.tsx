import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useCreditCertification } from '../hooks/useCreditCertification';
import { CreditConfirmationDialog } from './CreditConfirmationDialog';
import { Button } from '../../../../../components/ui/button';
import { CameraAnimation } from '../../../../../components/shared/CameraAnimation';
import type { CreditRequest } from '../types';

export function CreditCertificationTable() {
  const { language } = useLanguage();
  const { credits, loading, error, updateCreditStatus } = useCreditCertification();
  const [selectedCredit, setSelectedCredit] = useState<CreditRequest | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <CameraAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500">
        <p className="text-sm text-red-500">
          {language === 'th'
            ? `เกิดข้อผิดพลาดในการโหลดข้อมูล: ${error}`
            : `Error loading credits: ${error}`}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'th' ? 'ทีมงาน' : 'Crew Member'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'th' ? 'ภาพยนตร์' : 'Movie'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'th' ? 'ตำแหน่ง' : 'Position'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  {language === 'th' ? 'สถานะ' : 'Status'}
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-400 w-32">
                  {language === 'th' ? 'จัดการ' : 'Manage'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {credits.map((credit) => (
                <tr key={credit.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                        {credit.userProfileImage ? (
                          <img
                            src={credit.userProfileImage}
                            alt={credit.userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {language === 'th' 
                            ? credit.userNameTh 
                            : credit.userNameEn || credit.userNameTh}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">
                    {language === 'th' 
                      ? credit.movieTitle 
                      : credit.movieTitleEng || credit.movieTitle}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {language === 'th' ? credit.role_th : credit.role_en}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${credit.status === 'approved'
                        ? 'bg-green-500/20 text-green-400'
                        : credit.status === 'rejected'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                      }
                    `}>
                      {credit.status === 'approved'
                        ? language === 'th' ? 'อนุมัติแล้ว' : 'Approved'
                        : credit.status === 'rejected'
                        ? language === 'th' ? 'ปฏิเสธ' : 'Rejected'
                        : language === 'th' ? 'รอตรวจสอบ' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      onClick={() => setSelectedCredit(credit)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {language === 'th' ? 'จัดการ' : 'Manage'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCredit && (
        <CreditConfirmationDialog
          credit={selectedCredit}
          onClose={() => setSelectedCredit(null)}
          onStatusUpdate={updateCreditStatus}
        />
      )}
    </>
  );
}