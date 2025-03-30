import React from 'react';
import { Container } from '../../ui/Container';
import { User } from 'lucide-react';
import { ProfileStats } from './ProfileStats';
import { SocialLinks } from './SocialLinks';

interface ProfileHeaderProps {
  coverImage?: string;
  profileImage?: string;
  name: string;
  nickname: string;
  occupation?: string;
  department?: string;
  role?: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    vimeo?: string;
    website?: string;
  };
  stats?: {
    views?: number;
    projects?: number;
    endorsements?: number;
  };
}

export function ProfileHeader({
  coverImage,
  profileImage,
  name,
  nickname,
  occupation,
  department,
  role,
  email,
  socialLinks,
  stats
}: ProfileHeaderProps) {
  const defaultCover = "https://firebasestorage.googleapis.com/v0/b/tfda-member-list.firebasestorage.app/o/Web%20Asset%2FPhotos%2FDSC06976.jpg?alt=media&token=2d628cf3-9914-4df4-932d-74bba445f874";

  const renderBadges = () => (
    <div className="flex flex-wrap gap-2">
      {occupation && (
        <div className="inline-block px-4 py-1.5 bg-red-500 rounded-full">
          <p className="text-sm font-medium text-white">{occupation}</p>
        </div>
      )}
      
      {occupation === 'crew' && department && (
        <div className="inline-block px-4 py-1.5 bg-blue-500 rounded-full">
          <p className="text-sm font-medium text-white">{department}</p>
        </div>
      )}
      
      {occupation === 'crew' && role && (
        <div className="inline-block px-4 py-1.5 bg-purple-500 rounded-full">
          <p className="text-sm font-medium text-white">{role}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-[300px] sm:h-[350px] md:h-[400px] relative">
        <img
          src={coverImage || defaultCover}
          alt="Profile Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Profile Info */}
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Profile Info Box - Desktop */}
          <div className="hidden sm:block relative -mt-40">
            <div className="flex items-center gap-8">
              {/* Profile Image */}
              <div className="w-48 h-48 flex-shrink-0 rounded-full overflow-hidden border-4 border-black bg-gray-900 shadow-xl">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-24 h-24 text-gray-700" />
                  </div>
                )}
              </div>

              {/* Name and Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{name}</h1>
                <p className="text-xl text-gray-300 mb-4">{nickname}</p>
                <div className="mb-6">
                  {renderBadges()}
                </div>
                
                {/* Social Links */}
                <div>
                  <SocialLinks
                    email={email}
                    {...socialLinks}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            {stats && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <ProfileStats {...stats} />
              </div>
            )}
          </div>

          {/* Profile Info Box - Mobile */}
          <div className="sm:hidden bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 -mt-32">
            <div className="flex flex-col items-center text-center">
              {/* Profile Image */}
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-black bg-gray-900 shadow-xl -mt-24 mb-4">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-20 h-20 text-gray-700" />
                  </div>
                )}
              </div>

              {/* Name and Info */}
              <h1 className="text-2xl font-bold text-white mb-1">{name}</h1>
              <p className="text-lg text-gray-300 mb-3">{nickname}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {renderBadges()}
              </div>
              
              {/* Social Links */}
              <div className="mb-6">
                <SocialLinks
                  email={email}
                  {...socialLinks}
                />
              </div>

              {/* Stats */}
              {stats && (
                <div className="w-full pt-6 border-t border-gray-700">
                  <ProfileStats {...stats} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}