import React from "react";

// Node positions for the network diagram
const NODES = [
  { x: 90, y: 78, color: "hsl(var(--primary))" },
  { x: 310, y: 78, color: "hsl(var(--accent-light))" },
  { x: 90, y: 222, color: "hsl(var(--accent-light))" },
  { x: 310, y: 222, color: "hsl(var(--primary))" },
];

// Computes a pinwheel blade's position and rotation
function pinwheelBlade(centerX, centerY, orbitRadius, size, angleDeg) {
  const angle = (angleDeg * Math.PI) / 180;
  const x = centerX + orbitRadius * Math.cos(angle);
  const y = centerY + orbitRadius * Math.sin(angle);
  const rotate = angleDeg + 90;
  const points = `0,${-size} ${size * 0.87},${size * 0.5} ${-size * 0.87},${size * 0.5}`;
  return { x, y, rotate, points };
}

// Decorative network illustration for the About page
export default function SustainabilityIllustration() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="missionGlow" cx="50%" cy="48%" r="55%">
          <stop offset="0%" stopColor="hsl(var(--accent-light))" stopOpacity="0.22" />
          <stop offset="100%" stopColor="hsl(var(--accent-light))" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill="url(#missionGlow)" />

      <g stroke="hsl(var(--accent-light))" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 4">
        {NODES.map((n, i) => (
          <line key={i} x1="200" y1="150" x2={n.x} y2={n.y} />
        ))}
      </g>

      <circle cx="200" cy="150" r="46" fill="none" stroke="hsl(var(--accent-light))" strokeOpacity="0.5" strokeWidth="1.5" />

      <g opacity="0.9">
        {[0, 120, 240].map((deg) => {
          const blade = pinwheelBlade(200, 150, 18, 11, deg);
          return (
            <polygon
              key={deg}
              points={blade.points}
              fill="hsl(var(--accent-light))"
              transform={`translate(${blade.x} ${blade.y}) rotate(${blade.rotate})`}
            />
          );
        })}
      </g>

      {NODES.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="26" fill="hsl(var(--background))" fillOpacity="0.06" stroke={n.color} strokeOpacity="0.5" />
          <circle cx={n.x} cy={n.y} r="6" fill={n.color} />
        </g>
      ))}

      <g fill="hsl(var(--accent-light))" opacity="0.4">
        <circle cx="60" cy="150" r="2.5" />
        <circle cx="340" cy="150" r="2.5" />
        <circle cx="200" cy="40" r="2.5" />
        <circle cx="200" cy="260" r="2.5" />
      </g>
    </svg>
  );
}
