import React from "react";

// Decorative background illustration for the homepage hero
export default function HeroIllustration() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.16" />
          <stop offset="55%" stopColor="hsl(var(--accent))" stopOpacity="0.08" />
          <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="heroSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#heroSky)" />

      <circle cx="1000" cy="170" r="180" fill="url(#heroSun)" />
      <circle cx="1000" cy="170" r="55" fill="hsl(var(--primary))" opacity="0.45" />

      <polygon
        points="0,560 150,440 320,520 480,400 650,500 820,430 1000,510 1200,460 1200,800 0,800"
        fill="hsl(var(--accent))"
        opacity="0.10"
      />
      <polygon
        points="0,630 120,570 200,570 260,510 340,510 400,630 560,610 620,550 700,550 760,610 900,590 1200,650 1200,800 0,800"
        fill="hsl(var(--primary))"
        opacity="0.14"
      />

      <g fill="hsl(var(--accent))" opacity="0.22">
        <rect x="150" y="520" width="14" height="100" rx="7" />
        <rect x="128" y="558" width="12" height="42" rx="6" />
        <rect x="174" y="548" width="12" height="52" rx="6" />
        <rect x="1010" y="560" width="12" height="80" rx="6" />
        <rect x="994" y="592" width="10" height="30" rx="5" />
      </g>

      <g opacity="0.5">
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={610 + col * 66}
              y={648 + row * 34}
              width="58"
              height="26"
              rx="2"
              fill="hsl(var(--foreground))"
              fillOpacity="0.06"
              stroke="hsl(var(--primary))"
              strokeOpacity="0.3"
            />
          ))
        )}
      </g>
    </svg>
  );
}
