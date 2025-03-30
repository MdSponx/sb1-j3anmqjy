import React from 'react';
import { Container } from '../../components/ui/Container';
import { useLanguage } from '../../contexts/LanguageContext';

export function Mission() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-black">
      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tfda-member-list.firebasestorage.app/o/Web%20Asset%2FPhotos%2FDSC06793.jpg?alt=media&token=3226dc53-6277-40a8-8ac9-bf265c0c6d0f"
            alt={t('nav.about.mission')}
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="relative min-h-screen flex items-center">
          <Container>
            <div className="max-w-3xl pt-32 sm:pt-40">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {t('nav.about.mission')}
              </h1>
              <div className="prose prose-lg prose-invert">
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 font-light leading-relaxed mb-6">
                  {language === 'th' ? 'พันธกิจของสมาคมผู้กำกับภาพยนตร์ไทยได้ถูกสรุปไว้ดังนี้' : 
                    'The missions of the Thai Film Director Association are summarized as follows:'}
                </p>
                <ol className="text-gray-200 space-y-3 list-decimal pl-4">
                  {language === 'th' ? (
                    <>
                      <li className="text-base sm:text-lg leading-relaxed">ส่งเสริมและพัฒนาความรู้และความสามารถของผู้กำกับภาพยนตร์ในประเทศไทย</li>
                      <li className="text-base sm:text-lg leading-relaxed">ส่งเสริมและพัฒนาศิลปะการกำกับภาพยนตร์ในประเทศไทย</li>
                      <li className="text-base sm:text-lg leading-relaxed">สร้างและพัฒนาความสัมพันธ์ระหว่างสมาคมผู้กำกับภาพยนตร์ไทยกับองค์กรภาพยนตร์ต่างๆในประเทศและต่างประเทศ</li>
                      <li className="text-base sm:text-lg leading-relaxed">ส่งเสริมและพัฒนาการสร้างผลงานภาพยนตร์ที่มีคุณภาพสูงและสามารถแข่งขันได้ในตลาดโลก</li>
                    </>
                  ) : (
                    <>
                      <li className="text-base sm:text-lg leading-relaxed">Promote and develop the knowledge and capabilities of film directors in Thailand</li>
                      <li className="text-base sm:text-lg leading-relaxed">Promote and develop the art of film directing in Thailand</li>
                      <li className="text-base sm:text-lg leading-relaxed">Build and develop relationships between TFDA and various film organizations both domestically and internationally</li>
                      <li className="text-base sm:text-lg leading-relaxed">Promote and develop the creation of high-quality films that can compete in the global market</li>
                    </>
                  )}
                </ol>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </div>
  );
}