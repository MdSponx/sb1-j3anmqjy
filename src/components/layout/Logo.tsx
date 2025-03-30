import React from 'react';

interface LogoProps {
  className?: string;  // เพิ่ม className prop
}

export function Logo({ className }: LogoProps) {
  return (
    <a href="/" className="flex items-center space-x-2">
      <div className="aspect-square flex items-center justify-center">
        <img 
          src="https://firebasestorage.googleapis.com/v0/b/tfda-member-list.firebasestorage.app/o/Web%20Asset%2FLogo%20and%20Icon%2FTFDA%20logo%20gray_edited_edited.png?alt=media&token=a24a38e6-7951-4847-923b-08b3edd2a7df"
          alt="TFDA Logo"
          className={`w-full h-full object-contain ${className}`}
        />
      </div>
      {/* ลบ text TFDA ออกจาก Logo component เพราะจะไปจัดการใน Navbar แทน */}
    </a>
  );
}