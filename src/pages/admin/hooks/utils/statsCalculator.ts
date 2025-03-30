import type { DashboardStats } from '../../types/dashboard';

interface User {
  occupation?: string;
  verification_status?: string;
}

export function calculateDashboardStats(users: User[]): DashboardStats {
  return {
    totalUsers: users.length,
    directors: users.filter(user => 
      user.occupation === 'director' && 
      user.verification_status === 'approved'
    ).length,
    crews: users.filter(user => 
      user.occupation === 'crew'
    ).length,
    students: users.filter(user => 
      user.occupation === 'school student' || 
      user.occupation === 'college student'
    ).length,
    generalPeople: users.filter(user => 
      user.occupation === 'general people'
    ).length,
    pendingDirectors: users.filter(user => 
      user.occupation === 'director' && 
      user.verification_status === 'pending'
    ).length,
    approvedDirectors: users.filter(user => 
      user.occupation === 'director' && 
      user.verification_status === 'approved'
    ).length,
    rejectedDirectors: users.filter(user => 
      user.occupation === 'director' && 
      user.verification_status === 'rejected'
    ).length,
  };
}