import React, { useState } from 'react';
import { Container } from '../../components/ui/Container';
import { MembersGallery } from './components/MembersGallery';
import { SearchBar } from '../../components/directory/SearchBar';
import { useLanguage } from '../../contexts/LanguageContext';
import { useMembers } from './hooks/useMembers';
import { CameraAnimation } from '../../components/shared/CameraAnimation';

export function MembersPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const { members, loading, error } = useMembers(searchQuery);

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-32 pb-16">
        <Container>
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                {language === 'th' ? 'สมาชิกสมาคมฯ' : 'Association Members'}
              </h1>
              <p className="text-lg text-gray-400">
                {language === 'th' 
                  ? 'รายชื่อผู้กำกับภาพยนตร์ที่ได้รับการรับรองจากสมาคมฯ' 
                  : 'Directory of verified film directors in the association'}
              </p>
            </div>

            <div className="mb-8">
              <SearchBar
                query={searchQuery}
                onSearch={setSearchQuery}
                onClear={() => setSearchQuery('')}
                disabled={loading}
                placeholder={language === 'th' 
                  ? 'ค้นหาชื่อผู้กำกับ...' 
                  : 'Search director names...'}
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
                    : 'Error loading members'}
                </p>
              </div>
            ) : (
              <MembersGallery members={members} />
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default MembersPage;