import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

export function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 h-[140px] flex flex-col justify-between">
      <div className="flex items-center space-x-3">
        {icon}
        <h3 className="text-sm font-medium text-gray-200 line-clamp-2">{title}</h3>
      </div>
      <div className="flex items-end">
        <p className="text-3xl font-semibold text-white tabular-nums leading-none">
          {value}
        </p>
      </div>
    </div>
  );
}