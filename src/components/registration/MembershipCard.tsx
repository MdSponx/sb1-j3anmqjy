import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

interface MembershipCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  price: string;
  href: string;
  onClick?: () => void;
}

export function MembershipCard({
  title,
  description,
  icon,
  benefits,
  price,
  onClick
}: MembershipCardProps) {
  const { language } = useLanguage();

  return (
    <Card className="relative overflow-hidden bg-gray-800 border-gray-700">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-red-500/10 rounded-lg">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-red-500 mt-1">•</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mb-6">
          <div className="text-2xl font-bold text-white">{price}</div>
          <div className="text-sm text-gray-400">
            {language === 'th' ? 'ต่อปี' : 'per year'}
          </div>
        </div>

        <Button 
          className="w-full bg-red-500 hover:bg-red-600 text-white"
          onClick={onClick}
        >
          {language === 'th' ? 'สมัครสมาชิก' : 'Register'}
        </Button>
      </div>
    </Card>
  );
}