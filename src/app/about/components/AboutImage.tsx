'use client';

import Image from 'next/image';
import { useState } from 'react';

const AboutImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="px-4 lg:px-12 py-10 max-w-4xl mx-auto w-full">
      <div className={`relative w-full rounded-2xl shadow-2xl border border-teal-500/10 overflow-hidden transition-all duration-700 ${
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <Image
          src="/About.jpeg"
          alt="Apex Capita trading infrastructure"
          width={1200}
          height={600}
          className="w-full object-cover max-h-80 lg:max-h-96"
          onLoad={() => setIsLoaded(true)}
          priority
        />
        
        {/* Loading Shimmer */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse"></div>
        )}
        
        {/* Image Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default AboutImage;