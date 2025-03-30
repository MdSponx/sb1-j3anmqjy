import React, { forwardRef, useImperativeHandle } from 'react';
import { Trash2, Image as ImageIcon, Clock } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useMovieCredits } from '../hooks/useMovieCredits';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ImageGalleryDialog } from './ImageGalleryDialog';
import { CameraAnimation } from '../../../../components/shared/CameraAnimation';
import type { MovieCredit } from '../../../../types/movieCredits';

export interface CreditsTableRef {
  refreshCredits: () => void;
}

export const CreditsTable = forwardRef<CreditsTableRef>((_, ref) => {
  const { language } = useLanguage();
  const { credits, loading, error, deleteCredit, refreshCredits } = useMovieCredits();
  const [creditToDelete, setCreditToDelete] = React.useState<string | null>(null);
  const [selectedCredit, setSelectedCredit] = React.useState<MovieCredit | null>(null);

  useImperativeHandle(ref, () => ({
    refreshCredits
  }));

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      approved: 'bg-green-500/20 text-green-400',
      rejected: 'bg-red-500/20 text-red-400'
    };

    const statusText = {
      pending: language === 'th' ? 'รอตรวจสอบ' : 'Pending',
      approved: language === 'th' ? 'อนุมัติแล้ว' : 'Approved',
      rejected: language === 'th' ? 'ปฏิเสธ' : 'Rejected'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        <Clock className="w-3 h-3" />
        {statusText[status as keyof typeof statusText]}
      </span>
    );
  };

  const handleDeleteCredit = async () => {
    if (creditToDelete) {
      const success = await deleteCredit(creditToDelete);
      if (success) {
        setCreditToDelete(null);
      }
    }
  };

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
        <button
          onClick={refreshCredits}
          className="mt-2 text-sm text-red-400 hover:text-red-300"
        >
          {language === 'th' ? 'ลองใหม่อีกครั้ง' : 'Try again'}
        </button>
      </div>
    );
  }

  if (!credits || credits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          {language === 'th'
            ? 'ยังไม่มีผลงานในระบบ'
            : 'No credits found'}
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
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">
                  {language === 'th' ? 'รูปภาพ' : 'Photos'}
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-400 w-20">
                  {language === 'th' ? 'จัดการ' : 'Actions'}
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
                  <td className="px-6 py-4 text-gray-300">
                    {language === 'th' ? credit.role_th : credit.role_en}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {credit.responsibilities || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(credit.status)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedCredit(credit)}
                      className="mx-auto flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>{credit.images?.length || 0}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setCreditToDelete(credit.id)}
                      className="mx-auto flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={!!creditToDelete}
        onClose={() => setCreditToDelete(null)}
        onConfirm={handleDeleteCredit}
      />

      {selectedCredit && (
        <ImageGalleryDialog
          creditId={selectedCredit.id}
          images={selectedCredit.images || []}
          isOpen={!!selectedCredit}
          onClose={() => setSelectedCredit(null)}
          onUpdate={refreshCredits}
        />
      )}
    </>
  );
});

CreditsTable.displayName = 'CreditsTable';