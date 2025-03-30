import React from 'react';
import { Award, Film, Users, Newspaper } from 'lucide-react';
import { Container } from '../ui/Container';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    icon: <Film className="h-8 w-8" />,
    title: 'โครงการพัฒนาผู้กำกับ',
    description: 'สนับสนุนผู้กำกับรุ่นใหม่ผ่านโครงการอบรมและเวิร์คช็อป'
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: 'รางวัลภาพยนตร์',
    description: 'มอบรางวัลเพื่อยกย่องผลงานที่โดดเด่นในวงการภาพยนตร์ไทย'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'เครือข่ายผู้กำกับ',
    description: 'สร้างเครือข่ายระหว่างผู้กำกับและผู้เชี่ยวชาญในวงการ'
  },
  {
    icon: <Newspaper className="h-8 w-8" />,
    title: 'ข่าวสารวงการหนัง',
    description: 'อัพเดทข่าวสารและความเคลื่อนไหวในวงการภาพยนตร์ไทย'
  }
];

export function Features() {
  return (
    <section className="py-24 bg-gray-900">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}