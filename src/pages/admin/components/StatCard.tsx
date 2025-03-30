import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
}

export function StatCard({ icon, title, value, trend }: StatCardProps) {
  const isPositive = trend.startsWith('+');

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-800 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm font-medium ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend}
        </span>
      </div>
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}