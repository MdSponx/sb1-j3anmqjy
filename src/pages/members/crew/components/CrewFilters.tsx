import React from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { departments } from '../../../../data/professions';

interface CrewFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  disabled?: boolean;
}

export function CrewFilters({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  disabled
}: CrewFiltersProps) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={language === 'th' ? 'ค้นหาชื่อทีมงาน...' : 'Search crew members...'}
          className="w-full pl-12 pr-12 py-3 bg-gray-800 text-white rounded-lg 
                   border border-gray-600 focus:border-red-500
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={disabled}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                     hover:text-white transition-colors"
            disabled={disabled}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Role Filter */}
      <div className="w-full md:w-64">
        <Select
          value={selectedRole}
          onValueChange={onRoleChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full bg-gray-800 border-gray-700">
            <SelectValue placeholder={language === 'th' ? 'เลือกแผนก' : 'Select Department'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === 'th' ? 'ทุกแผนก' : 'All Departments'}
            </SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.en} value={dept.en}>
                {language === 'th' ? dept.th : dept.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}