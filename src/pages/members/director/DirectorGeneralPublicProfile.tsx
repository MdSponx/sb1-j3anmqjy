import React, { useState, useEffect } from 'react';
import { Container } from '../../../components/ui/Container';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useFirebase } from '../../../contexts/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useProfileViews } from '../../../hooks/useProfileViews';
import { ProfileHeader } from '../../../components/profile/public/ProfileHeader';
import { DirectorPortfolio } from '../../../components/profile/public/DirectorPortfolio';
import { MovieCreditsTable } from '../../../components/profile/public/MovieCreditsTable';
import { CameraAnimation } from '../../../components/shared/CameraAnimation';

export function DirectorGeneralPublicProfile() {
  const { language } = useLanguage();
  const { db } = useFirebase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [directorData, setDirectorData] = useState<any>(null);
  const [totalWorks, setTotalWorks] = useState(0);
  const [totalEndorsements, setTotalEndorsements] = useState(0);

  // Get director ID from URL
  const directorId = window.location.pathname.split('/').pop();
  
  // Use profile views hook with the user ID
  const { views } = useProfileViews(directorId || '');

  useEffect(() => {
    const fetchDirectorData = async () => {
      if (!directorId) {
        setError('Director ID not found');
        setLoading(false);
        return;
      }

      try {
        // Fetch user data
        const userDoc = await getDoc(doc(db, 'users', directorId));

        if (!userDoc.exists()) {
          throw new Error('Director not found');
        }

        const userData = userDoc.data();

        // If director_id exists, fetch additional data from directors collection
        if (userData.director_id) {
          const directorDoc = await getDoc(doc(db, 'directors', userData.director_id));
          if (directorDoc.exists()) {
            const directorInfo = directorDoc.data();
            setTotalWorks(directorInfo['Total Work'] || 0);
          }
        }

        // Fetch endorsements count
        const endorsementsQuery = await getDoc(doc(db, 'profile_stats', directorId));
        if (endorsementsQuery.exists()) {
          setTotalEndorsements(endorsementsQuery.data().endorsements || 0);
        }

        setDirectorData(userData);
        setError(null);
      } catch (err) {
        console.error('Error fetching director data:', err);
        setError(err instanceof Error ? err.message : 'Error loading director profile');
        setDirectorData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectorData();
  }, [db, directorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CameraAnimation />
      </div>
    );
  }

  if (error || !directorData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">
          {language === 'th' 
            ? 'ไม่พบข้อมูลผู้กำกับ' 
            : 'Director profile not found'}
        </p>
      </div>
    );
  }

  // Prepare data for profile header
  const socialLinks = {
    facebook: directorData.facebook_url,
    youtube: directorData.youtube_url,
    instagram: directorData.instagram_url,
    vimeo: directorData.vimeo_url,
    website: directorData.website_url,
  };

  const stats = {
    views,
    projects: totalWorks,
    endorsements: totalEndorsements,
  };

  return (
    <div className="min-h-screen bg-black">
      <ProfileHeader 
        coverImage={directorData.cover_image_url}
        profileImage={directorData.profile_image_url}
        name={language === 'th' ? directorData.fullname_th : directorData.fullname_en}
        nickname={language === 'th' ? directorData.nickname_th : directorData.nickname_en}
        occupation={directorData.occupation}
        email={directorData.email}
        socialLinks={socialLinks}
        stats={stats}
      />

      <Container className="py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {directorData && directorId && (
            <>
              <DirectorPortfolio 
                userId={directorData.director_id} 
                fullname_th={directorData.fullname_th}
              />
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white hover:text-red-500 transition-colors">
                    {language === 'th' ? 'ผลงานอื่นๆ' : 'Other Credits'}
                  </h2>
                </div>
                <MovieCreditsTable userId={directorId} />
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

export default DirectorGeneralPublicProfile;