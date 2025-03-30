import React, { useState } from 'react';
import { Image } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useMovieCredits } from '../../../hooks/useMovieCredits';
import { CameraAnimation } from '../../shared/CameraAnimation';
import { ImageGalleryDialog } from './ImageGalleryDialog';
import type { MovieCredit } from '../../../types/movieCredits';

interface MovieCreditsTableProps {
  userId: string;
}

export function MovieCreditsTable({ userId }: MovieCreditsTableProps) {
  const { language } = useLanguage();
  const { credits, loading, error } = useMovieCredits(userId);
  const [selectedCredit, setSelectedCredit] = useState<MovieCredit | null>(null);
  
  if (!userId) {
    return null;
  }

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

  if (!credits || credits.length === 0) {
    return (
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg overflow-hidden p-8">
        <div className="text-center">
          <p className="text-gray-400">
            {language === 'th' ? 'ยังไม่มีผลงานในระบบ' : 'No credits found'}
          </p>
        </div>
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
                  {language === 'th' ? 'รูปภาพ' : 'Photos'}
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
                  <td className="px-6 py-4 text-gray-300">{credit.year}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {language === 'th' ? credit.role_th : credit.role_en}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {credit.responsibilities || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedCredit(credit)}
                      disabled={!credit.images?.length}
                      className={`
                        mx-auto flex items-center justify-center gap-2 px-3 py-1 rounded-full 
                        ${credit.images?.length 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-600 cursor-not-allowed text-gray-400'
                        } 
                        transition-colors text-sm
                      `}
                    >
                      <Image className="w-4 h-4" />
                      <span>{credit.images?.length || 0}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCredit && (
        <ImageGalleryDialog
          credit={selectedCredit}
          isOpen={!!selectedCredit}
          onClose={() => setSelectedCredit(null)}
        />
      )}
    </>
  );
}