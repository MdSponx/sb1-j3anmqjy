import React from 'react';
import { Container } from '../../components/ui/Container';
import { useLanguage } from '../../contexts/LanguageContext';

export function ThaiFilmDefinition() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-black">
      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/tfda-member-list.firebasestorage.app/o/Web%20Asset%2FPhotos%2F20220919-DSC09422.jpg?alt=media&token=a63c3359-fe58-49dc-887f-99ae613f9b7a"
            alt={language === 'th' ? 'นิยามภาพยนตร์ไทย' : 'Thai Film Definition'}
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="relative min-h-screen flex items-center">
          <Container>
            <div className="max-w-3xl pt-32 sm:pt-32">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {language === 'th' ? 'นิยามภาพยนตร์ไทย' : 'Thai Film Definition'}
              </h1>
              <div className="prose prose-lg prose-invert">
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 font-light leading-relaxed mb-8">
                  {language === 'th' 
                    ? 'ภาพยนตร์ไทยในคำจำกัดความของสมาคมผู้กำกับกำหนดขึ้นเพื่อเป็นบรรทัดฐานในการเป็นสมาชิกภาพของสมาคมฯ โดยภาพยนตร์นั้นต้องมีคุณสมบัติครบ 3 ใน 5 ข้อ ที่กำหนดมาจึงจะถือว่าเป็นภาพยนตร์ไทย'
                    : 'The definition of Thai films, as established by the Thai Film Director Association, serves as a criterion for membership eligibility. A film must meet at least 3 out of 5 specified requirements to be considered a Thai film.'}
                </p>
                <ol className="text-gray-200 space-y-4 list-decimal pl-4">
                  {language === 'th' ? (
                    <>
                      <li className="text-base sm:text-lg leading-relaxed">ภาพยนตร์ที่มีความยาวไม่น้อยกว่า 60 นาที ที่มีการฉายเชิงพานิชย์</li>
                      <li className="text-base sm:text-lg leading-relaxed">ภาพยนตร์ที่มีการใช้ภาษาไทยหรือภาษาท้องถิ่นในประเทศไทยเป็นหลัก</li>
                      <li className="text-base sm:text-lg leading-relaxed">ทุนสร้างและลิขสิทธิ์ของภาพยนตร์เป็นของบริษัทหรือบุคคลที่มีสัญชาติไทย</li>
                      <li className="text-base sm:text-lg leading-relaxed">เรื่องราวและสถานที่ตามท้องเรื่องเกิดขึ้นมีฉากหลังหรือเกี่ยวข้องกับประเทศไทย</li>
                      <li className="text-base sm:text-lg leading-relaxed">ผู้กำกับภาพยนตร์ นักแสดง และทีมงานหลัก มากกว่าร้อยละ 51 มีสัญชาติไทย</li>
                    </>
                  ) : (
                    <>
                      <li className="text-base sm:text-lg leading-relaxed">The film must be at least 60 minutes in length and have been commercially screened</li>
                      <li className="text-base sm:text-lg leading-relaxed">The primary language used in the film must be Thai or local Thai dialects</li>
                      <li className="text-base sm:text-lg leading-relaxed">The film's funding and copyright must belong to Thai nationals or Thai companies</li>
                      <li className="text-base sm:text-lg leading-relaxed">The story and locations must have settings or connections to Thailand</li>
                      <li className="text-base sm:text-lg leading-relaxed">More than 51% of the film's director, actors, and core crew members must be Thai nationals</li>
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