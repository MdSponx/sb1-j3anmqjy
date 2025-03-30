import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUserData } from '../../hooks/useUserData';
import { CameraAnimation } from '../shared/CameraAnimation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { userData, loading: userDataLoading } = useUserData();
  const { language } = useLanguage();
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  const isContentRoute = window.location.pathname.startsWith('/admin/content');

  useEffect(() => {
    if (!loading && !user) {
      sessionStorage.setItem('redirectPath', window.location.pathname);
      window.location.href = '/login';
      return;
    }

    // Check access for admin routes
    if (!loading && !userDataLoading && isAdminRoute) {
      const hasAccess = isContentRoute 
        ? ['admin', 'editor'].includes(userData?.web_role || '')
        : userData?.web_role === 'admin';

      if (!hasAccess) {
        window.location.href = '/';
        return;
      }
    }
  }, [user, loading, userData, userDataLoading, isAdminRoute, isContentRoute]);

  if (loading || userDataLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CameraAnimation />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}