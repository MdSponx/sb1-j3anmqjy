import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProjectCard } from './ProjectCard';
import { Project } from '../../types/project';

interface ProjectSliderProps {
  projects: Project[];
}

export function ProjectSlider({ projects }: ProjectSliderProps) {
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

  return (
    <div className="relative group">
      {showLeftArrow && (
        <Button
          variant="secondary"
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-black/50 hover:bg-black/70"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      
      <div 
        ref={scrollContainer}
        className="grid grid-flow-col auto-cols-[80%] sm:auto-cols-[45%] lg:auto-cols-[400px] gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {projects.map((project, index) => (
          <div 
            key={index}
            className="snap-start"
          >
            <ProjectCard {...project} />
          </div>
        ))}
      </div>

      {showRightArrow && (
        <Button
          variant="secondary"
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-black/50 hover:bg-black/70"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}