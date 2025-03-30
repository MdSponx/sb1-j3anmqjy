import React, { useEffect } from 'react';
import { Container } from '../../components/ui/Container';
import { MembershipCard } from '../../components/registration/MembershipCard';
import { Film, Crown, Users, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { useFirebase } from '../../contexts/firebase';
import { createMembershipData } from '../../lib/firebase/membership';
import type { MembershipPlan } from '../../types/membership';

export function RegisterPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { db } = useFirebase();

  const handleMembershipSelect = async (plan: MembershipPlan, path: string) => {
    if (!user) {
      // Save intended destination and plan
      sessionStorage.setItem('redirectPath', path);
      sessionStorage.setItem('selectedPlan', plan);
      window.location.href = '/create-account';
      return;
    }

    try {
      // Update user document with plan selection
      const membershipData = createMembershipData(plan);
      await setDoc(doc(db, 'users', user.uid), membershipData, { merge: true });
      
      // Navigate to appropriate registration path
      window.location.href = path;
    } catch (error) {
      console.error('Error updating membership plan:', error);
    }
  };

  const memberships = [
    {
      title: language === 'th' ? 'ผู้กำกับภาพยนตร์ (Free Plan)' : 'Film Director (Free Plan)',
      description: language === 'th' ? 'สำหรับผู้กำกับภาพยนตร์ที่ต้องการติดตามกิจกรรมและข่าวสาร' : 'For general interest film directors',
      icon: <Film className="w-6 h-6 text-gray-400" />,
      benefits: language === 'th' ? [
        'ได้รับการยืนยันตัวตนใน Thai film database',
        'มีสิทธิ์ลงคะแนนรางวัลสมาคมผู้กำกับได้',
        'ได้รับการเสนอชื่อเข้าชิงรางวัลสมาคมผู้กำกับได้',
        'ได้รับข่าวสารจากสมาคมผู้กำกับ',
        'มีสิทธิ์ลงชื่อเพื่อสนับสนุนประเด็นต่างๆที่สมาคมฯกำลังผลักดัน',
        'ได้รับความช่วยเหลือเมื่ีอมีข้อร้องเรียนในกรณีที่ไม่ได้รับความเป็นธรรมในการทำงาน'
      ] : [
        'Identity verification in Thai film database',
        'Voting rights for TFDA awards',
        'Eligibility for TFDA award nominations',
        'Access to TFDA news and updates',
        'Right to sign petitions supporting TFDA advocacy initiatives',
        'Support and assistance for work-related grievances and unfair treatment cases'
      ],
      price: 'Free',
      onClick: () => handleMembershipSelect('Free', '/register/director-search')
    },
    {
      title: language === 'th' ? 'ผู้กำกับภาพยนตร์ (Pro Plan)' : 'Film Director (Pro Plan)',
      description: language === 'th' ? 'สำหรับผู้กำกับภาพยนตร์ที่จะมีส่วนร่วมในการพัฒนาวงการ' : 'For professional film directors',
      icon: <Crown className="w-6 h-6 text-yellow-500" />,
      benefits: language === 'th' ? [
        'ได้รับสิทธิประโยชน์ทุกอย่างเหมือน Collective Member',
        'สามารถจัดการ Profile สร้างช่องทางการติดต่อเพื่อเข้าถึงโอกาสใหม่ๆ',
        'เพิ่มเติมผลงานใน Filmography ได้หลากหลายประเภท',
        'สร้าง Profile บริษัทที่เป็นเจ้าของได้',
        'สามารถโวตเลือกนายกสมาคมผู้กำกับได้',
        'สามารถสมัครเข้ารับเลือกตั้งเป็นนายกสมาคมผู้กำกับได้',
        'มีสิทธิ์ในการเข้ารับเลือกเป็นคณะกรรมการของสมาคมฯ',
        'ประกาศจ้างงานในเว็บไซท์และเพจของสมาคมฯได้',
        'ส่งผลงานเข้าร่วมโครงการ หนังเลือกทาง และโครงการอื่นๆที่จะตามมาได้',
        'ได้รับเชิญเข้าร่วมกิจกรรมที่จัดโดยสมาคมผู้กำกับเป็นลำดับแรก'
      ] : [
        'All Collective Member benefits included',
        'Profile management with contact channels for new opportunities',
        'Add diverse content types to Filmography',
        'Create company profiles',
        'Voting rights for TFDA President',
        'Eligibility to run for TFDA President',
        'Eligibility for TFDA committee positions',
        'Post job opportunities on TFDA website and social media',
        'Submit works to "Film Path Selection" and future TFDA projects',
        'Priority invitation to TFDA events'
      ],
      price: '1,000 ฿',
      onClick: () => handleMembershipSelect('Pro', '/register/director-search')
    },
    {
      title: language === 'th' ? 'ทีมงานภาพยนตร์' : 'Film Crew',
      description: language === 'th' ? 'สำหรับผู้ทำงานในอุตสาหกรรมภาพยนตร์' : 'For film industry professionals',
      icon: <Users className="w-6 h-6 text-red-500" />,
      benefits: language === 'th' ? [
        'เครือข่ายผู้เชี่ยวชาญ',
        'โอกาสการจ้างงาน',
        'การอบรมพิเศษ'
      ] : [
        'Professional network',
        'Job opportunities',
        'Special training'
      ],
      price: 'Free',
      onClick: () => handleMembershipSelect('Crew', '/register/department')
    },
    {
      title: language === 'th' ? 'สมาชิกทั่วไป' : 'Public Member',
      description: language === 'th' ? 'สำหรับผู้สนใจวงการภาพยนตร์' : 'For film enthusiasts',
      icon: <User className="w-6 h-6 text-red-500" />,
      benefits: language === 'th' ? [
        'ข่าวสารวงการภาพยนตร์',
        'เข้าร่วมกิจกรรมสาธารณะ'
      ] : [
        'Film industry news',
        'Public event access'
      ],
      price: 'Free',
      onClick: () => handleMembershipSelect('Public', '/register/public-member')
    }
  ];

  // Check for stored plan after account creation
  useEffect(() => {
    if (user) {
      const storedPlan = sessionStorage.getItem('selectedPlan') as MembershipPlan;
      const storedPath = sessionStorage.getItem('redirectPath');
      
      if (storedPlan && storedPath) {
        handleMembershipSelect(storedPlan, storedPath);
        sessionStorage.removeItem('selectedPlan');
        sessionStorage.removeItem('redirectPath');
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {language === 'th' ? 'สมัครสมาชิก' : 'Membership Registration'}
            </h1>
            <p className="text-lg text-gray-400">
              {language === 'th' 
                ? 'เลือกประเภทสมาชิกที่เหมาะกับคุณ'
                : 'Choose the membership type that suits you'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {memberships.map((membership, index) => (
              <MembershipCard 
                key={index}
                {...membership}
                href="#"
                onClick={membership.onClick}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default RegisterPage;