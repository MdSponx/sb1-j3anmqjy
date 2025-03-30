import React, { useEffect, useState } from 'react';
import { Container } from '../../components/ui/Container';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUserData } from '../../hooks/useUserData';
import { useAuth } from '../../contexts/AuthContext';
import { useProfileViews } from '../../hooks/useProfileViews';
import { ProfileHeader } from '../../components/profile/public/ProfileHeader';
import { DirectorPortfolio } from '../../components/profile/public/DirectorPortfolio';
import { CrewPortfolio } from '../../components/profile/public/CrewPortfolio';
import { PublicMemberInfo } from '../../components/profile/public/PublicMemberInfo';
import { OtherMovieCredits } from '../../components/profile/public/OtherMovieCredits';
import { MovieCreditsTable } from '../../components/profile/public/MovieCreditsTable';
import { ProfileSidebar } from '../../components/profile/ProfileSidebar';
import { CameraAnimation } from '../../components/shared/CameraAnimation';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { useFirebase } from '../../contexts/firebase';

export function PublicProfile() {
  const { language } = useLanguage();
  const {
    userData,
    loading: userDataLoading,
    error: userDataError,
  } = useUserData();
  const { user } = useAuth();
  const { db } = useFirebase();
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalEndorsements, setTotalEndorsements] = useState(0);
  const [profileUserId, setProfileUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the raw profile ID from URL
  const urlProfileId = window.location.pathname.split('/').pop();

  // Fetch and validate profile user ID
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!urlProfileId) {
        setError('Profile ID not found');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile data for ID:', urlProfileId);

        // First try to fetch from users collection
        const userDoc = await getDoc(doc(db, 'users', urlProfileId));

        if (userDoc.exists()) {
          // If document exists, use its ID
          setProfileUserId(userDoc.id);
          console.log('Found user document with ID:', userDoc.id);
          setError(null);
        } else {
          console.log('No user document found for ID:', urlProfileId);
          // Fallback to current user if available
          if (user?.uid) {
            setProfileUserId(user.uid);
            setError(null);
          } else {
            setError('User profile not found');
          }
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err instanceof Error ? err.message : 'Error loading profile');
        setProfileUserId(user?.uid || '');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [db, urlProfileId, user]);

  // Use profile views hook with the confirmed user ID
  const { views: totalViews, loading: viewsLoading } =
    useProfileViews(profileUserId);

  // Fetch additional stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!profileUserId) return;

      try {
        console.log('Fetching stats for user ID:', profileUserId);

        // Fetch endorsements from profile_stats
        const statsDoc = await getDoc(doc(db, 'profile_stats', profileUserId));
        if (statsDoc.exists()) {
          const statsData = statsDoc.data();
          setTotalEndorsements(statsData.endorsements || 0);
          console.log('Found endorsements:', statsData.endorsements);
        } else {
          console.log('No stats document found');
          setTotalEndorsements(0);
        }

        // For crew members, fetch their approved credits count
        if (userData?.occupation === 'crew') {
          const creditsQuery = query(
            collection(db, 'movie_credits'),
            where('userId', '==', profileUserId),
            where('status', '==', 'approved')
          );
          const creditsSnapshot = await getDocs(creditsQuery);
          setTotalProjects(creditsSnapshot.size);
          console.log('Found total projects:', creditsSnapshot.size);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [db, profileUserId, userData?.occupation]);

  const handleProjectsCountChange = (count: number) => {
    setTotalProjects(count);
  };

  // Show loading state while any data is being fetched
  if (loading || userDataLoading || viewsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CameraAnimation />
      </div>
    );
  }

  // Show error state if any error occurs
  if (error || userDataError || !userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">
          {language === 'th' ? 'ไม่พบข้อมูลผู้ใช้' : 'User profile not found'}
        </p>
      </div>
    );
  }

  // Prepare social links
  const socialLinks = {
    facebook: userData.facebook_url,
    youtube: userData.youtube_url,
    instagram: userData.instagram_url,
    vimeo: userData.vimeo_url,
    website: userData.website_url,
  };

  // Only show stats for directors and crew members
  const isPublicMember = [
    'school student',
    'college student',
    'general people',
  ].includes(userData.occupation || '');
  const stats = !isPublicMember
    ? {
        views: totalViews,
        projects: totalProjects,
        endorsements: totalEndorsements,
      }
    : undefined;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          'url(https://firebasestorage.googleapis.com/v0/b/tfda-member-list.firebasestorage.app/o/Web%20Asset%2FPhotos%2FDSC06976.jpg?alt=media&token=2d628cf3-9914-4df4-932d-74bba445f874)',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="pt-32 pb-16">
        <Container>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-64 md:sticky md:top-32 md:self-start">
              <ProfileSidebar />
            </div>

            <div className="flex-1">
              <ProfileHeader
                coverImage={userData.cover_image_url}
                profileImage={userData.profile_image_url}
                name={
                  language === 'th'
                    ? userData.fullname_th
                    : userData.fullname_en
                }
                nickname={
                  language === 'th'
                    ? userData.nickname_th
                    : userData.nickname_en
                }
                occupation={userData.occupation}
                department={
                  language === 'th'
                    ? userData.department_th
                    : userData.department_en
                }
                role={language === 'th' ? userData.role_th : userData.role_en}
                email={userData.email}
                socialLinks={socialLinks}
                stats={stats}
              />

              <div className="max-w-4xl mx-auto space-y-12 mt-12">
                {userData.occupation === 'director' ? (
                  <>
                    <DirectorPortfolio
                      userId={userData.director_id}
                      fullname_th={userData.fullname_th}
                      onProjectsCountChange={handleProjectsCountChange}
                    />
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">
                          {language === 'th' ? 'ผลงานอื่นๆ' : 'Other Credits'}
                        </h2>
                      </div>
                      <MovieCreditsTable userId={profileUserId} />
                    </div>
                  </>
                ) : userData.occupation === 'crew' ? (
                  <>
                    <CrewPortfolio
                      department={
                        language === 'th'
                          ? userData.department_th
                          : userData.department_en
                      }
                      role={
                        language === 'th' ? userData.role_th : userData.role_en
                      }
                    />
                    <OtherMovieCredits userId={userData.id} />
                  </>
                ) : (
                  <PublicMemberInfo
                    occupation={userData.occupation}
                    planSelection={userData.plan_selection}
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default PublicProfile;