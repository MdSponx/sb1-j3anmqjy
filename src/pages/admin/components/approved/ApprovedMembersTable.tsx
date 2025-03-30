import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { DirectorRecheckDialog } from './DirectorRecheckDialog';
import { ImageViewDialog } from '../applications/ImageViewDialog';
import { TableHeader } from './table/TableHeader';
import { TableRow } from './table/TableRow';
import type { DirectorApplication } from '../../types/application';

interface ApprovedMembersTableProps {
  members: DirectorApplication[];
  onMemberUpdate?: () => void;
}

export function ApprovedMembersTable({ members, onMemberUpdate }: ApprovedMembersTableProps) {
  const { language } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<DirectorApplication | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          {language === 'th'
            ? 'ไม่มีสมาชิกที่ได้รับการอนุมัติ'
            : 'No approved members'}
        </p>
      </div>
    );
  }

  const handleRowClick = (member: DirectorApplication) => {
    setSelectedMember(member);
  };

  const handleDialogClose = () => {
    setSelectedMember(null);
    if (onMemberUpdate) {
      onMemberUpdate();
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <TableHeader />
          <tbody className="divide-y divide-gray-700">
            {members.map((member) => (
              <TableRow
                key={member.id}
                member={member}
                onClick={() => handleRowClick(member)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedMember && (
        <DirectorRecheckDialog
          isOpen={!!selectedMember}
          onClose={handleDialogClose}
          member={selectedMember}
          onImageSelect={setSelectedImage}
        />
      )}

      <ImageViewDialog
        isOpen={!!selectedImage}
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}