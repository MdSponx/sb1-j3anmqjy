import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { CrewRecheckDialog } from '../crew/CrewRecheckDialog';
import { ImageViewDialog } from '../applications/ImageViewDialog';
import type { CrewApplication } from '../../types/application';

interface ApprovedCrewMembersTableProps {
  members: CrewApplication[];
  onMemberUpdate?: () => void;
}

export function ApprovedCrewMembersTable({ members, onMemberUpdate }: ApprovedCrewMembersTableProps) {
  const { language } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<CrewApplication | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          {language === 'th'
            ? 'ไม่มีทีมงานที่ได้รับการอนุมัติ'
            : 'No approved crew members'}
        </p>
      </div>
    );
  }

  const handleRowClick = (member: CrewApplication) => {
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
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-6 py-4 text-sm font-medium text-gray-400">
                {language === 'th' ? 'ทีมงาน' : 'Crew Member'}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400">
                {language === 'th' ? 'แผนก' : 'Department'}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400">
                {language === 'th' ? 'ตำแหน่ง' : 'Role'}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400">
                {language === 'th' ? 'อีเมล' : 'Email'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {members.map((member) => (
              <tr
                key={member.id}
                onClick={() => handleRowClick(member)}
                className="hover:bg-gray-800/50 cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
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
                    <div>
                      <p className="text-white font-medium">
                        {language === 'th' 
                          ? member.fullname_th 
                          : member.fullname_en || member.fullname_th}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-white">
                  {language === 'th' ? member.department_th : member.department_en}
                </td>
                <td className="px-6 py-4 text-white">
                  {language === 'th' ? member.role_th : member.role_en}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {member.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMember && (
        <CrewRecheckDialog
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