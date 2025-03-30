import React from 'react';
import { Mail, Facebook, Youtube, Instagram, Video, Globe } from 'lucide-react';

interface SocialLinksProps {
  email?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  vimeo?: string;
  website?: string;
}

export function SocialLinks({
  email,
  facebook,
  youtube,
  instagram,
  vimeo,
  website
}: SocialLinksProps) {
  const links = [
    { url: `mailto:${email}`, icon: Mail, value: email },
    { url: facebook, icon: Facebook, value: facebook },
    { url: youtube, icon: Youtube, value: youtube },
    { url: instagram, icon: Instagram, value: instagram },
    { url: vimeo, icon: Video, value: vimeo },
    { url: website, icon: Globe, value: website }
  ].filter(link => link.value);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4">
      {links.map((link, index) => {
        const Icon = link.icon;
        return (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label={`Visit ${link.url}`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
          </a>
        );
      })}
    </div>
  );
}