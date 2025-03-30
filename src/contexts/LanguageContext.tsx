import React, { createContext, useContext, useState } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  th: {
    'nav.home': 'หน้าแรก',
    'nav.about': 'เกี่ยวกับเรา',
    'nav.about.history': 'ประวัติความเป็นมา',
    'nav.about.mission': 'พันธกิจ',
    'nav.about.provision': 'ข้อบัญญัติ',
    'nav.about.thaifilm': 'นิยามภาพยนตร์ไทย',
    'nav.news': 'ข่าวสาร',
    'nav.activities': 'กิจกรรม',
    'nav.activities.events': 'งานกิจกรรม',
    'nav.activities.projects': 'โครงการ',
    'nav.members': 'สมาชิก',
    'nav.members.committee': 'กรรมการสมาคม',
    'nav.members.list': 'รายชื่อสมาชิก',
    'nav.members.directory': 'ทำเนียบผู้กำกับ',
    'nav.members.crew': 'ทีมงาน',
    'nav.awards': 'รางวัลสมาคมฯ',
    'nav.thaifilms': 'ทำเนียบหนังไทย',
    'committee.president': 'นายกสมาคม',
    'committee.board': 'คณะกรรมการบริหาร',
    'committee.secretary': 'เลขาธิการและเลขานุการ',
    'committee.advisor': 'ที่ปรึกษา',
    'committee.honoraryAdvisor': 'ที่ปรึกษากิตติมศักดิ์',
    'committee.pr': 'ฝ่ายประชาสัมพันธ์',
    'committee.error': 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.about.history': 'History',
    'nav.about.mission': 'Mission',
    'nav.about.provision': 'Provision',
    'nav.about.thaifilm': 'Thai Film Definition',
    'nav.news': 'News',
    'nav.activities': 'Activities',
    'nav.activities.events': 'Events',
    'nav.activities.projects': 'Projects',
    'nav.members': 'Members',
    'nav.members.committee': 'Committee',
    'nav.members.list': 'Members List',
    'nav.members.directory': 'Director Directory',
    'nav.members.crew': 'Crew',
    'nav.awards': 'TFDA Awards',
    'nav.thaifilms': 'Thai Films',
    'committee.president': 'President',
    'committee.board': 'Executive Board',
    'committee.secretary': 'Secretary General & Secretary',
    'committee.advisor': 'Advisors',
    'committee.honoraryAdvisor': 'Honorary Advisors',
    'committee.pr': 'Public Relations',
    'committee.error': 'Error loading committee data'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('th');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['th']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}