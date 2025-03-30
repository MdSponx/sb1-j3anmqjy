import React from 'react';
import {
  Phone,
  Mail,
  Facebook,
  Globe,
  Youtube,
  Instagram,
  Music2,
  Video,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface ContactInfoFormProps {
  values: {
    phone?: string;
    email?: string;
    facebook_url?: string;
    tiktok_url?: string;
    youtube_url?: string;
    instagram_url?: string;
    vimeo_url?: string;
    website_url?: string;
  };
  onChange: (field: string, value: string) => void;
}

export function ContactInfoForm({ values, onChange }: ContactInfoFormProps) {
  const { language } = useLanguage();

  // Ensure default values for all form fields
  const formValues = {
    phone: values.phone || '',
    email: values.email || '',
    facebook_url: values.facebook_url || '',
    tiktok_url: values.tiktok_url || '',
    youtube_url: values.youtube_url || '',
    instagram_url: values.instagram_url || '',
    vimeo_url: values.vimeo_url || '',
    website_url: values.website_url || '',
  };
  const RequiredLabel = ({
    htmlFor,
    children,
  }: {
    htmlFor: string;
    children: React.ReactNode;
  }) => (
    <Label htmlFor={htmlFor}>
      {children} <span className="text-red-500">*</span>
    </Label>
  );

  const socialFields = [
    {
      id: 'facebook_url',
      icon: <Facebook className="w-5 h-5 text-red-500" />,
      label: 'Facebook URL',
    },
    {
      id: 'tiktok_url',
      icon: <Music2 className="w-5 h-5 text-red-500" />,
      label: 'TikTok URL',
    },
    {
      id: 'youtube_url',
      icon: <Youtube className="w-5 h-5 text-red-500" />,
      label: 'YouTube URL',
    },
    {
      id: 'instagram_url',
      icon: <Instagram className="w-5 h-5 text-red-500" />,
      label: 'Instagram URL',
    },
    {
      id: 'vimeo_url',
      icon: <Video className="w-5 h-5 text-red-500" />,
      label: 'Vimeo URL',
    },
    {
      id: 'website_url',
      icon: <Globe className="w-5 h-5 text-red-500" />,
      label: 'Website URL',
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">
        {language === 'th' ? 'ข้อมูลการติดต่อ' : 'Contact Information'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <RequiredLabel htmlFor="phone" required>
            {language === 'th' ? 'เบอร์โทรศัพท์' : 'Phone Number'}
          </RequiredLabel>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
            <Input
              id="phone"
              type="tel"
              value={formValues.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" required>
            {language === 'th' ? 'อีเมล' : 'Email'}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
            <Input
              id="email"
              type="email"
              value={formValues.email}
              onChange={(e) => onChange('email', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {socialFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {field.icon}
              </div>
              <Input
                id={field.id}
                type="url"
                value={formValues[field.id as keyof typeof formValues]}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="pl-10"
                placeholder="https://"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
