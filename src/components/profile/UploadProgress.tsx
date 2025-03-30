import React from 'react';

interface UploadProgressProps {
  progress: number;
}

export function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div className="w-4/5 max-w-[200px]">
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-red-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/50 to-red-500 animate-pulse" />
        </div>
      </div>
      <p className="text-xs text-white text-center mt-2">
        {Math.round(progress)}%
      </p>
    </div>
  );
}