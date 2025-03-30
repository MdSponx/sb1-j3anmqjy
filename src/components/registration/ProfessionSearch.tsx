import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFirebase } from '../../contexts/firebase';
import { SearchBar } from '../directory/SearchBar';
import { ProfessionResults } from './ProfessionResults';

export function ProfessionSearch() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { db } = useFirebase();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleProfessionSelect = async (
    department: { th: string; en: string },
    role: { th: string; en: string }
  ) => {
    if (!user) return;

    try {
      await setDoc(doc(db, 'users', user.uid), {
        department_th: department.th,
        department_en: department.en,
        role_th: role.th,
        role_en: role.en,
        occupation: 'crew',
        plan_selection: 'Crew',
        verification_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { merge: true });

      window.location.href = '/edit-profile';
    } catch (error) {
      console.error('Error updating profession:', error);
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง'
          : 'An error occurred while saving. Please try again.'
      );
    }
  };

  const placeholder = language === 'th' 
    ? 'ค้นหาตำแหน่งงานของคุณ...'
    : 'Search for your role...';

  return (
    <div className="space-y-6">
      <SearchBar
        query={query}
        onSearch={setQuery}
        onClear={() => setQuery('')}
        placeholder={placeholder}
      />

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <ProfessionResults
        query={query}
        onSelect={handleProfessionSelect}
      />
    </div>
  );
}