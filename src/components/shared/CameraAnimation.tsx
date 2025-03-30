import React from 'react';
import { Film } from 'lucide-react';

export function CameraAnimation() {
  return (
    <div className="relative">
      <div className="animate-spin-slow">
        <Film className="w-16 h-16 sm:w-24 sm:h-24 text-red-500" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
    </div>
  );
}