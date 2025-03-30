import React from 'react';
import { useCrewStats } from '../../../../hooks/admin/useCrewStats';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { CameraAnimation } from '../../../../components/shared/CameraAnimation';
import { ROLE_COLORS } from '../../../../types/crew';

export function CrewStatistics() {
  const { stats, loading, error } = useCrewStats();
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <CameraAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  const total = stats.reduce((sum, stat) => sum + stat.count, 0);
  const chartSize = 240;
  const centerSize = chartSize * 0.6;
  let currentAngle = 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">
        {language === 'th' ? 'สถิติทีมงาน' : 'Crew Statistics'}
      </h2>

      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Donut Chart */}
          <div className="relative" style={{ width: chartSize, height: chartSize }}>
            <svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`}>
              {stats.map((stat, index) => {
                const percentage = (stat.count / total) * 100;
                const angle = (percentage / 100) * 360;
                const x1 = Math.cos((currentAngle * Math.PI) / 180) * (chartSize / 2) + chartSize / 2;
                const y1 = Math.sin((currentAngle * Math.PI) / 180) * (chartSize / 2) + chartSize / 2;
                const x2 = Math.cos(((currentAngle + angle) * Math.PI) / 180) * (chartSize / 2) + chartSize / 2;
                const y2 = Math.sin(((currentAngle + angle) * Math.PI) / 180) * (chartSize / 2) + chartSize / 2;
                
                const path = `
                  M ${chartSize / 2} ${chartSize / 2}
                  L ${x1} ${y1}
                  A ${chartSize / 2} ${chartSize / 2} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2}
                  Z
                `;

                currentAngle += angle;

                return (
                  <path
                    key={stat.role}
                    d={path}
                    fill={ROLE_COLORS[stat.role] || ROLE_COLORS.Other}
                    className="transition-opacity hover:opacity-80"
                  >
                    <title>{`${stat.role}: ${stat.count} (${stat.percentage.toFixed(1)}%)`}</title>
                  </path>
                );
              })}
              <circle
                cx={chartSize / 2}
                cy={chartSize / 2}
                r={centerSize / 2}
                fill="#1F2937"
              />
              <text
                x={chartSize / 2}
                y={chartSize / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-2xl font-bold"
              >
                {total}
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.role} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: ROLE_COLORS[stat.role] || ROLE_COLORS.Other }}
                />
                <div>
                  <p className="text-sm font-medium text-white">{stat.role}</p>
                  <p className="text-xs text-gray-400">
                    {stat.count} ({stat.percentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}