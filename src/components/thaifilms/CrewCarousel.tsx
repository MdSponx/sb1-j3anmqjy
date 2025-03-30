import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

interface CrewMember {
  name: string;
  role: string;
  photo?: string;
}

interface CrewCarouselProps {
  crew: CrewMember[];
}

export function CrewCarousel({ crew }: CrewCarouselProps) {
  const { language } = useLanguage();
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateArrows = () => {
    if (!scrollContainer.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainer.current;
    if (container) {
      container.addEventListener('scroll', updateArrows);
      updateArrows();
      
      const images = container.getElementsByTagName('img');
      Array.from(images).forEach(img => {
        img.addEventListener('load', updateArrows);
      });

      return () => {
        container.removeEventListener('scroll', updateArrows);
        Array.from(images).forEach(img => {
          img.removeEventListener('load', updateArrows);
        });
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainer.current) return;
    
    const container = scrollContainer.current;
    const scrollAmount = container.clientWidth * 0.8;
    const scrollTo = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
  };

  if (!crew.length) return null;

  return (
    <div className="relative group">
      <h3 className="text-xl font-semibold text-white mb-4">
        {language === 'th' ? 'ทีมงาน' : 'Crew'}
      </h3>

      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 hover:bg-black/70 h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Crew Cards Container */}
        <div 
          ref={scrollContainer}
          className="grid grid-flow-col auto-cols-[140px] gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {crew.map((member, index) => (
            <div 
              key={index}
              className="snap-start bg-gray-800/20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center space-y-2 hover:bg-gray-800/30 transition-colors duration-200"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800/50 border border-gray-700">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm text-white font-medium line-clamp-1">
                  {member.name}
                </p>
                <p className="text-xs text-gray-400 line-clamp-1">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 hover:bg-black/70 h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}