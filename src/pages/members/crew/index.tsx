import React, { useState } from 'react';
import { Container } from '../../../components/ui/Container';
import { CrewGallery } from './components/CrewGallery';
import { CrewFilters } from './components/CrewFilters';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useCrewMembers } from './hooks/useCrewMembers';
import { CameraAnimation } from '../../../components/shared/CameraAnimation';

export function CrewPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const { members, loading, error } = useCrewMembers(searchQuery, selectedRole);

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-32 pb-16">
        <Container>
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                {language === 'th' ? 'ทีมงานภาพยนตร์' : 'Film Crew'}
              </h1>
              <p className="text-lg text-gray-400">
                {language === 'th' 
                  ? 'รายชื่อทีมงานภาพยนตร์ที่ได้รับการรับรองจากสมาคมฯ' 
                  : 'Directory of verified film crew members in the association'}
              </p>
            </div>

            <div className="mb-8">
              <CrewFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
                disabled={loading}
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <CameraAnimation />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">
                  {language === 'th'
                    ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
                    : 'Error loading crew members'}
                </p>
              </div>
            ) : (
              <CrewGallery members={members} />
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default CrewPage;