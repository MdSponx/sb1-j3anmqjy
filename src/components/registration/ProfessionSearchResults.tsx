import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFirebase } from '../../contexts/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { SearchResult } from '../../types/profession';

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
}

export function SearchResults({ query, results }: SearchResultsProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { db } = useFirebase();

  if (!query) {
    return (
      <div className="text-center py-8 text-gray-400">
        {language === 'th'
          ? 'พิมพ์เพื่อค้นหาตำแหน่งงาน'
          : 'Type to search for a role'}
      </div>
    );
  }

  if (query.length < 2) {
    return (
      <div className="text-center py-8 text-gray-400">
        {language === 'th'
          ? 'พิมพ์อย่างน้อย 2 ตัวอักษร'
          : 'Type at least 2 characters'}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        {language === 'th'
          ? 'ไม่พบผลการค้นหา'
          : 'No results found'}
      </div>
    );
  }

  const handleSelect = async (result: SearchResult) => {
    if (!user) return;

    try {
      await setDoc(doc(db, 'users', user.uid), {
        department_th: result.department.name_th,
        department_en: result.department.name_en,
        role_th: result.role.title_th,
        role_en: result.role.title_en,
        type: result.role.type,
        occupation: 'crew',
        verification_status: 'pending',
        updated_at: new Date().toISOString()
      }, { merge: true });

      // Navigate to next step
      window.location.href = '/register/basic-info';
    } catch (error) {
      console.error('Error updating profession:', error);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {results.map((result, index) => (
        <button
          key={index}
          className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 
                   transition-colors duration-200 group"
          onClick={() => handleSelect(result)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-gray-400 text-sm">
              {result.department.name_th} / {result.department.name_en}
            </span>
            <span className="hidden sm:block text-gray-400">•</span>
            <span className="text-white group-hover:text-blue-300 transition-colors">
              {result.role.title_th} / {result.role.title_en}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}