import React from 'react';
import { Container } from '../ui/Container';

interface PageHeaderProps {
  image: string;
  title: string;
  subtitle?: string;
}

export function PageHeader({ image, title, subtitle }: PageHeaderProps) {
  return (
    <section className="relative h-[400px] sm:h-[500px]">
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover brightness-50"
        />
      </div>
      <div className="relative h-full flex items-center">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg sm:text-xl text-gray-200 font-light">
                {subtitle}
              </p>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
}