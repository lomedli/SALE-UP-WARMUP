import React, { useState } from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-32" }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* 
        Displays the logo image if available at /logo.png.
        Falls back to a CSS/SVG representation if the image fails to load.
      */}
      {!imageError ? (
        <img 
          src="logo.png" 
          alt="SaleUp Logo" 
          className="w-24 h-24 mb-2 object-contain"
          onError={() => setImageError(true)}
        />
      ) : (
        <svg viewBox="0 0 100 100" className="w-20 h-20 mb-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" /> {/* teal-500 */}
              <stop offset="100%" stopColor="#38bdf8" /> {/* sky-400 */}
            </linearGradient>
          </defs>
          
          {/* Stylized S Logo */}
          <path 
            d="M70 20 C 70 5, 30 5, 30 35 C 30 65, 70 65, 70 95 C 70 110, 30 110, 30 90" 
            stroke="url(#brandGradient)" 
            strokeWidth="5" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span className="text-2xl font-bold tracking-wider text-slate-900 uppercase">
        SALE UP
      </span>
    </div>
  );
};
