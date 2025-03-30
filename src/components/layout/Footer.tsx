import React from 'react';
import { Container } from '../ui/Container';
import { Logo } from './Logo';
import { SocialLinks } from './SocialLinks';
import { useLanguage } from '../../contexts/LanguageContext';

export function Footer() {
  const { language } = useLanguage();

  const quickLinks = [
    { 
      href: '/about/history', 
      label: language === 'th' ? 'ประวัติความเป็นมา' : 'History'
    },
    { 
      href: '/about/mission', 
      label: language === 'th' ? 'พันธกิจ' : 'Mission'
    },
    { 
      href: '/about/thaifilm', 
      label: language === 'th' ? 'นิยามภาพยนตร์ไทย' : 'Thai Film Definition'
    },
    { 
      href: '/members/committee', 
      label: language === 'th' ? 'กรรมการสมาคม' : 'Committee'
    },
    { 
      href: '/members/directory', 
      label: language === 'th' ? 'ทำเนียบผู้กำกับ' : 'Director Directory'
    },
    { 
      href: '/thaifilms', 
      label: language === 'th' ? 'ทำเนียบหนังไทย' : 'Thai Films'
    }
  ];

  return (
    <footer className="bg-black text-white">
      <Container className="py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div>
            <div className="mb-3 sm:mb-4">
              <div className="w-[100px] sm:w-[120px] lg:w-[140px]">
                <Logo />
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-400">
              {language === 'th' 
                ? 'สมาคมผู้กำกับภาพยนตร์ไทย เป็นองค์กรไม่แสวงหาผลกำไร ที่มุ่งมั่นส่งเสริมและพัฒนาวงการภาพยนตร์ไทย'
                : 'Thai Film Director Association is a non-profit organization dedicated to promoting and developing the Thai film industry'}
            </p>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {language === 'th' ? 'ติดต่อเรา' : 'Contact Us'}
            </h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-400 whitespace-pre-line">
              {language === 'th' 
                ? 'เลขที่ 25/1 ซอยลาดพร้าว 60\nถนนลาดพร้าว แขวงวังทองหลาง\nเขตวังทองหลาง\nกรุงเทพฯ 10310'
                : '25/1 Soi Ladprao 60\nLadprao Road\nWangtonglang, Wangtonglang\nBangkok 10310'}
              <br />
              {language === 'th' ? 'โทร: ' : 'Tel: '}+66966593969<br />
              {language === 'th' ? 'อีเมล: ' : 'Email: '}contact@thaifilmdirectors.com
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {language === 'th' ? 'ลิงก์ด่วน' : 'Quick Links'}
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="text-xs sm:text-sm lg:text-base text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Social Links */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              {language === 'th' ? 'ติดตามเรา' : 'Follow Us'}
            </h3>
            <SocialLinks />
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 sm:mt-8 lg:mt-12 pt-4 sm:pt-6 border-t border-gray-800 text-center text-xs sm:text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {language === 'th' 
              ? 'สมาคมผู้กำกับภาพยนตร์ไทย V.2.0' 
              : 'Thai Film Director Association V.2.0'
            }. {language === 'th' 
              ? 'สงวนลิขสิทธิ์' 
              : 'All rights reserved'
            }
          </p>
        </div>
      </Container>
    </footer>
  );
}