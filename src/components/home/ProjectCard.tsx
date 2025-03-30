import React from 'react';
import { Button } from '../ui/Button';
import { Calendar } from 'lucide-react';
import { Project } from '../../types/project';

export function ProjectCard({ image, date, title, description }: Project) {
  const formattedDate = new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden h-full transform transition-transform hover:scale-[1.02] duration-300">
      <div className="aspect-[16/9] relative">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-400 mb-3">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{formattedDate}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-400 text-base mb-6 line-clamp-2">
          {description}
        </p>
        <Button 
          variant="secondary" 
          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2.5"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}