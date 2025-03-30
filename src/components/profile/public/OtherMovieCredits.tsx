import React from 'react';
import { Film } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useOtherMovieCredits } from '../../../hooks/useOtherMovieCredits';
import { CameraAnimation } from '../../shared/CameraAnimation';

interface OtherMovieCreditsProps {
  userId: string;
}

export function OtherMovieCredits({ userId }: OtherMovieCreditsProps) {
  const { language } = useLanguage();
  const { credits, loading, error } = useOtherMovieCredits(userId);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <CameraAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        {language === 'th' 
          ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล' 
          : 'Error loading credits'}
      </div>
    );
  }

  if (!credits.length) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Film className="w-6 h-6 text-red-500" />
            {language === 'th' ? 'ผลงานอื่นๆ' : 'Other Movie Credits'}
          </h2>
          <span className="text-lg text-red-500 font-medium">
            {credits.length} {language === 'th' ? 'เรื่อง' : 'movies'}
          </span>
        </div>

        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    {language === 'th' ? 'ภาพยนตร์' : 'Movie'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    {language === 'th' ? 'ปี' : 'Year'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    {language === 'th' ? 'ตำแหน่ง' : 'Role'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    {language === 'th' ? 'หน้าที่' : 'Responsibilities'}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">
                    {language === 'th' ? 'สถานะ' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {credits.map((credit) => (
                  <tr key={credit.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-white">
                      {language === 'th' 
                        ? credit.movieTitle 
                        : credit.movieTitleEng || credit.movieTitle}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {credit.year}
                    </td>
                    <td className="px-6 py-4 text-red-400">
                      {language === 'th' ? credit.role_th : credit.role_en}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {credit.responsibilities || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`
                          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${credit.status === 'approved'
                            ? 'bg-green-500/20 text-green-400'
                            : credit.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                          }
                        `}>
                          {credit.status === 'approved'
                            ? language === 'th' ? 'ยืนยันแล้ว' : 'Verified'
                            : credit.status === 'pending'
                            ? language === 'th' ? 'รอตรวจสอบ' : 'Pending'
                            : language === 'th' ? 'ปฏิเสธ' : 'Rejected'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}