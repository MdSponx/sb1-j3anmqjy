import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Users, UserCheck, Briefcase, GraduationCap, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { StatCard } from './dashboard/StatCard';
import { CrewStatistics } from './dashboard/CrewStatistics';

export function AdminDashboard() {
  const { language } = useLanguage();
  const { stats, loading, error, refreshData } = useAdminDashboard();

  const userOverviewStats = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: language === 'th' ? 'จำนวนสมาชิกทั้งหมด' : 'Total Users',
      value: stats.totalUsers.toString(),
    },
    {
      icon: <UserCheck className="w-6 h-6 text-green-500" />,
      title: language === 'th' ? 'ผู้กำกับ' : 'Directors',
      value: stats.directors.toString(),
    },
    {
      icon: <Briefcase className="w-6 h-6 text-purple-500" />,
      title: language === 'th' ? 'ทีมงาน' : 'Crew Members',
      value: stats.crews.toString(),
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-yellow-500" />,
      title: language === 'th' ? 'นักเรียนนักศึกษา' : 'Students',
      value: stats.students.toString(),
    },
    {
      icon: <User className="w-6 h-6 text-gray-500" />,
      title: language === 'th' ? 'ประชาชนทั่วไป' : 'General People',
      value: stats.generalPeople.toString(),
    }
  ];

  const directorMemberStats = [
    {
      icon: <Clock className="w-6 h-6 text-yellow-500" />,
      title: language === 'th' ? 'คำขอที่รอการดำเนินการ' : 'Pending Requests',
      value: stats.pendingDirectors.toString(),
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      title: language === 'th' ? 'อนุมัติแล้ว' : 'Approved',
      value: stats.approvedDirectors.toString(),
    },
    {
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      title: language === 'th' ? 'ปฏิเสธแล้ว' : 'Rejected',
      value: stats.rejectedDirectors.toString(),
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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

  return (
    <div className="space-y-8">
      {/* Refresh Button */}
      <button
        onClick={refreshData}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {language === 'th' ? 'รีเฟรชข้อมูล' : 'Refresh Data'}
      </button>

      {/* Users Overview Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          {language === 'th' ? 'ภาพรวมผู้ใช้งาน' : 'Users Overview'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {userOverviewStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Director Members Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          {language === 'th' ? 'สมาชิกผู้กำกับ' : 'Director Members'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {directorMemberStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Crew Statistics Section */}
      <CrewStatistics />
    </div>
  );
}