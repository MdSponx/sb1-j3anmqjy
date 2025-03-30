import React from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../hooks/firebase/useAuth';

interface UserAvatarProps {
  className?: string;
}

export function UserAvatar({ className }: UserAvatarProps) {
  const { user } = useAuth();

  return (
    <Avatar className={className}>
      {user?.photoURL ? (
        <AvatarImage src={user.photoURL} alt={user.displayName || 'User avatar'} />
      ) : (
        <AvatarFallback>
          <User className="h-5 w-5 text-gray-400" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}