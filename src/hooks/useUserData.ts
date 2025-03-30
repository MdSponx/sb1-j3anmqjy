import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../contexts/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { ProfileFormData } from '../types/profile';

export function useUserData() {
  const { db } = useFirebase();
  const { user } = useAuth();
  const [userData, setUserData] = useState<ProfileFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          
          // Calculate age if birthdate exists
          let age = 0;
          if (data.birthdate) {
            const birthDate = new Date(data.birthdate);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
          }

          // Handle both old and new field names during transition
          setUserData({
            ...data,
            fullname_th: data.fullname_th || data.fullname_TH || '',
            fullname_en: data.fullname_en || data.fullname_EN || '',
            nickname_th: data.nickname_th || data.nickname_TH || '',
            nickname_en: data.nickname_en || data.nickname_EN || '',
            birthdate: data.birthdate || '',
            gender: data.gender || 'male',
            phone: data.phone || '',
            email: user.email || '',
            facebook_url: data.facebook_url || '',
            tiktok_url: data.tiktok_url || '',
            youtube_url: data.youtube_url || '',
            instagram_url: data.instagram_url || '',
            vimeo_url: data.vimeo_url || '',
            website_url: data.website_url || '',
            occupation: data.occupation || '',
            department_th: data.department_th || '',
            department_en: data.department_en || '',
            role_th: data.role_th || '',
            role_en: data.role_en || '',
            age: age,
            profile_image_url: data.profile_image_url || '',
            id_card_image_url: data.id_card_image_url || '',
            payment_slip_url: data.payment_slip_url || '',
            member_status: data.member_status || '',
            payment_status: data.payment_status || '',
            verification_status: data.verification_status || '',
            plan_selection: data.plan_selection || ''
          });
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, db]);

  return { userData, loading, error };
}