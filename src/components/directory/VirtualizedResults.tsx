import React from 'react';
import { Director } from '../../types/director';
import { DirectorCard } from './DirectorCard';

interface VirtualizedResultsProps {
  results: Director[];
  containerRef: React.RefObject<HTMLDivElement>;
}

export function VirtualizedResults({ results, containerRef }: VirtualizedResultsProps) {
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: 20 });

  React.useEffect(() => {
    const updateVisibleRange = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const height = container.clientHeight;
      const itemHeight = 300; // Approximate height of DirectorCard
      
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
      const end = Math.min(
        results.length,
        Math.ceil((scrollTop + height) / itemHeight) + 5
      );
      
      setVisibleRange({ start, end });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateVisibleRange);
      window.addEventListener('resize', updateVisibleRange);
      updateVisibleRange();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateVisibleRange);
        window.removeEventListener('resize', updateVisibleRange);
      }
    };
  }, [results.length, containerRef]);

  const totalHeight = results.length * 300; // Total scrollable height
  const visibleItems = results.slice(visibleRange.start, visibleRange.end);

  return (
    <div
      style={{ height: totalHeight }}
      className="relative w-full"
    >
      <div
        style={{
          position: 'absolute',
          top: visibleRange.start * 300,
          left: 0,
          right: 0,
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {visibleItems.map((director) => (
          <DirectorCard key={director.id} director={director} />
        ))}
      </div>
    </div>
  );
}