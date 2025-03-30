import React from 'react';
import { Container } from '../../components/ui/Container';
import { useLanguage } from '../../contexts/LanguageContext';

export function History() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-black">
      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tfda-member-list.firebasestorage.app/o/Web%20Asset%2FPhotos%2Fhistorymain.jpg?alt=media&token=cac10def-144e-482d-8b82-bdf5a3cdf785"
            alt={language === 'th' ? 'ประวัติความเป็นมา' : 'History'}
            className="w-full h-full object-cover object-center brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        
        <div className="relative min-h-screen flex items-center">
          <Container>
            <div className="max-w-3xl pt-24 sm:pt-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
                {language === 'th' ? 'ประวัติความเป็นมา' : 'Our History'}
              </h1>
              <div className="prose prose-lg prose-invert">
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-light leading-relaxed mb-8">
                  {language === 'th' ? (
                    'สมาคมผู้กำกับภาพยนตร์แห่งประเทศไทยก่อตั้งขึ้นในปี พ.ศ. 2551 โดยมีจุดประสงค์ในการส่งเสริมและสนับสนุนศิลปะการสร้างภาพยนตร์ไทย'
                  ) : (
                    'The Thai Film Director Association (TFDA) was established in 2008 with the aim of promoting and supporting the art of filmmaking in Thailand.'
                  )}
                </p>
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8">
                  {language === 'th' ? (
                    'ก่อนการก่อตั้งสมาคมฯ วงการภาพยนตร์ไทยไม่มีหน่วยงานอย่างเป็นทางการสำหรับผู้กำกับภาพยนตร์ ทำให้คนทำหนังจำนวนมากต้องเผชิญหน้ากับการเซ็นเซอร์ ความยากลำบากของการเข้าถึงแหล่งเงินทุน และการเผยแพร่ผลงานให้เป็นที่รู้จัก'
                  ) : (
                    'Prior to its establishment, there was no formal organization for film directors in the country, which left them facing challenges such as censorship, limited funding opportunities, and a lack of recognition for their work.'
                  )}
                </p>
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                  {language === 'th' ? (
                    'การก่อตั้งสมาคมผู้กำกับภาพยนตร์นั้นได้สร้างเครือข่ายที่แข็งแรง ที่จะเป็นปากเป็นเสียงในการต่อรองผลประโยชน์ของผู้ประกอบวิชาชีพนี้ในอุตสาหกรรมภาพยนตร์'
                  ) : (
                    'The TFDA was founded to provide a platform for directors to network, collaborate, and advocate for the interests of the industry.'
                  )}
                </p>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </div>
  );
}