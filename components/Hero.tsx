'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const heroSlides = [
  { id: 1, title: 'Aura Flex SR', subtitle: 'Experience the Future of Comfort', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', buttonText: 'Shop Now' },
  { id: 2, title: 'Velocity Pro', subtitle: 'Engineered for Maximum Speed', imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop', buttonText: 'Explore Collection' },
  { id: 3, title: 'Urban Nomad X', subtitle: 'Style That Moves With You', imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1996&auto=format&fit=crop', buttonText: 'View Lookbook' },
];

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveSlide(current => (current + 1) % heroSlides.length);
  }, []);

  const prevSlide = () => {
    setActiveSlide(current => (current - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };
  
  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalId);
  }, [nextSlide]);

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
        {heroSlides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 h-full relative">
            <Image src={slide.imageUrl} alt={slide.title} layout="fill" objectFit="cover" objectPosition="center" priority={slide.id === 1} />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter">{slide.title}</h1>
              <p className="mt-4 max-w-lg text-lg md:text-xl text-gray-200">{slide.subtitle}</p>
              <button className="mt-8 px-8 py-3 bg-white text-black font-semibold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={prevSlide} className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm transition">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={nextSlide} className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm transition">
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => goToSlide(i)} className={`h-3 w-3 rounded-full transition-colors ${i === activeSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}></button>
        ))}
      </div>
    </section>
  );
}
