import React from 'react';
import { Container } from '../ui/Container';
import { useLanguage } from '../../contexts/LanguageContext';

export function HistoryContent() {
  const { language } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-black">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-invert">
            <p className="text-gray-300 text-lg leading-relaxed">
              {language === 'th' ? (
                'สมาคมผู้กำกับภาพยนตร์แห่งประเทศไทยก่อตั้งขึ้นในปี พ.ศ. 2551 โดยมีจุดประสงค์ในการส่งเสริมและสนับสนุนศิลปะการสร้างภาพยนตร์ไทย ซึ่งก่อนนั้นวงการภาพยนตร์ไทยไม่มีหน่วยงานอย่างเป็นทางการสำหรับผู้กำกับภาพยนตร์ ทำให้คนทำหนังจำนวนมากต้องเผชิญหน้ากับการเซ็นเซอร์ ความยากลำบากของการเข้าถึงแหล่งเงินทุน และการเผยแพร่ผลงานให้เป็นที่รู้จัก การก่อตั้งสมาคมผู้กำกับภาพยนตร์นั้นได้สร้างเครือข่ายที่แข็งแรง ที่จะเป็นปากเป็นเสียงในการต่อรองผลประโยชน์ของผู้ประกอบวิชานี้นี้ในอุตสาหกรรมภาพยนตร์'
              ) : (
                'The Thai Film Director Association (TFDA) was established in 2008 with the aim of promoting and supporting the art of filmmaking in Thailand. Prior to its establishment, there was no formal organization for film directors in the country, which left them facing a number of challenges such as censorship, limited funding opportunities, and a lack of recognition for their work. The TFDA was founded to provide a platform for directors to network, collaborate, and advocate for the interests of the industry.'
              )}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}