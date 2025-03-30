import React, { memo } from 'react';

interface RoleBadgeProps {
  type: 'role' | 'occupation';
  label: string;
}

export const RoleBadge = memo(function RoleBadge({ type, label }: RoleBadgeProps) {
  const getBadgeColors = () => {
    if (type === 'role') {
      switch (label.toLowerCase()) {
        case 'admin':
          return 'bg-red-500/10 text-red-400';
        case 'editor':
          return 'bg-blue-500/10 text-blue-400';
        case 'blogger':
          return 'bg-lime-500/10 text-lime-400';
        default:
          return 'bg-gray-500/10 text-gray-400';
      }
    } else {
      switch (label.toLowerCase()) {
        case 'director':
          return 'bg-red-500/10 text-red-400';
        case 'crew':
          return 'bg-amber-500/10 text-amber-400';
        case 'school student':
          return 'bg-yellow-500/10 text-yellow-400';
        case 'college student':
          return 'bg-green-500/10 text-green-400';
        case 'general people':
          return 'bg-pink-500/10 text-pink-400';
        default:
          return 'bg-gray-500/10 text-gray-400';
      }
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getBadgeColors()}`}
    >
      {label}
    </span>
  );
});