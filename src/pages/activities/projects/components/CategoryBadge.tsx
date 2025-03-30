import React from 'react';

interface CategoryBadgeProps {
  category: string;
}

const categoryColors = {
  'Training': 'bg-blue-500/20 text-blue-400',
  'Funding': 'bg-green-500/20 text-green-400',
  'Workshop': 'bg-purple-500/20 text-purple-400',
  'Mentorship': 'bg-yellow-500/20 text-yellow-400',
  'International': 'bg-red-500/20 text-red-400'
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const colorClass = categoryColors[category as keyof typeof categoryColors] || 'bg-gray-500/20 text-gray-400';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {category}
    </span>
  );
}