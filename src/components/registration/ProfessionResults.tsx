import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { departments, roles } from '../../data/professions';

interface ProfessionResultsProps {
  query: string;
  onSelect: (department: { th: string; en: string }, role: { th: string; en: string }) => void;
}

export function ProfessionResults({ query, onSelect }: ProfessionResultsProps) {
  const { language } = useLanguage();

  if (!query) {
    return (
      <div className="text-center py-8 text-gray-400">
        {language === 'th'
          ? 'พิมพ์เพื่อค้นหาตำแหน่งงาน (ได้ทั้งภาษาไทยและอังกฤษ)'
          : 'Type to search for a role. (You can use both Thai and English)'}
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

  const results = departments.flatMap(dept => {
    const deptRoles = roles[dept.en] || [];
    return deptRoles.map(role => ({
      department: dept,
      role,
      score: calculateMatchScore(query, dept, role)
    }));
  });

  const filteredResults = results
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  if (filteredResults.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        {language === 'th'
          ? 'ไม่พบผลการค้นหา'
          : 'No results found'}
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      {filteredResults.map((result, index) => (
        <button
          key={index}
          className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 
                   transition-colors duration-200 group"
          onClick={() => onSelect(result.department, result.role)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-gray-400 text-sm">
              {result.department[language === 'th' ? 'th' : 'en']}
            </span>
            <span className="hidden sm:block text-gray-400">•</span>
            <span className="text-white group-hover:text-red-300 transition-colors">
              {result.role[language === 'th' ? 'th' : 'en']}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

function calculateMatchScore(
  query: string,
  department: { th: string; en: string },
  role: { th: string; en: string }
): number {
  const lowerQuery = query.toLowerCase();
  let score = 0;

  // Check department matches
  if (department.th.toLowerCase().includes(lowerQuery)) score += 10;
  if (department.en.toLowerCase().includes(lowerQuery)) score += 10;

  // Check role matches (weighted higher)
  if (role.th.toLowerCase().includes(lowerQuery)) score += 20;
  if (role.en.toLowerCase().includes(lowerQuery)) score += 20;

  // Bonus for exact matches
  if (role.th.toLowerCase() === lowerQuery) score += 30;
  if (role.en.toLowerCase() === lowerQuery) score += 30;

  return score;
}