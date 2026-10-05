import React from 'react';

/**
 * Cute Red Alarm Clock Component
 * Faithfully matches the user's reference clock icon with:
 * - Two rounded ears/bells at top
 * - Two cute angled feet at bottom
 * - Circular vibrant red body
 * - Clean white Flash Lightning Bolt in center (Zero Chinese text!)
 */
export const RedAlarmClock = ({ className = "w-10 h-10", animated = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      <svg 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        {/* Top-Left Bell / Ear */}
        <circle 
          cx="12" 
          cy="12" 
          r="6.5" 
          fill="#FF6B6B" 
          className={animated ? "animate-pulse" : ""}
        />
        
        {/* Top-Right Bell / Ear */}
        <circle 
          cx="36" 
          cy="12" 
          r="6.5" 
          fill="#FF6B6B" 
          className={animated ? "animate-pulse delay-100" : ""}
        />

        {/* Bottom-Left Leg / Foot */}
        <rect 
          x="10.5" 
          y="35" 
          width="4.5" 
          height="8" 
          rx="2.25" 
          transform="rotate(28 10.5 35)" 
          fill="#D60024" 
        />

        {/* Bottom-Right Leg / Foot */}
        <rect 
          x="33.5" 
          y="37" 
          width="4.5" 
          height="8" 
          rx="2.25" 
          transform="rotate(-28 33.5 37)" 
          fill="#D60024" 
        />

        {/* Main Alarm Clock Body (Vibrant Red matching reference photo) */}
        <circle 
          cx="24" 
          cy="25" 
          r="16.5" 
          fill="#E00028" 
        />
        
        {/* Soft inner radial highlight for a sleek 3D tactile finish */}
        <circle 
          cx="24" 
          cy="25" 
          r="14.5" 
          fill="#FF2442" 
        />

        {/* Center Flash Lightning Bolt (No Chinese Text!) */}
        <path 
          d="M25.5 15.5L18 25.5H23.5L22.5 34.5L31 22.5H25L25.5 15.5Z" 
          fill="white" 
        />
      </svg>
    </div>
  );
};
