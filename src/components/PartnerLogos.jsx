import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Fill in `url` for each partner once the link document is available.
// Leave as null and the logo renders without a link (no click-through).
const PARTNERS = [
  { name: "Collaboration for Good", file: "cfg.png", url: "https://www.collaborationforgood.com" },
  { name: "City of Phoenix", file: "city-of-phoenix.png", url: "https://www.phoenix.gov/" },
  { name: "City of Surprise", file: "city-of-surprise.png", url: "https://surpriseaz.gov/economic-development" },
  { name: "Arizona Sustainable Economic Lab", file: "az-sustainable-economic-lab.png", url: "https://www.iedconline.org/pages/az-sustainable/" },
  { name: "IEDC", file: "iedc.png", url: "https://www.iedconline.org/" },
  { name: "Local First Arizona", file: "local-first-arizona.png", url: "https://localfirstaz.com/" },
  { name: "Flinn Foundation", file: "flinn.png", url: "https://www.flinn.org/" },
  { name: "HMA", file: "hma.png", url: "https://hmapr.com/" },
  { name: "2025 Breakthrough", file: "breakthrough.png", url: "https://www.ignitesparkedbybbb.org/bbb-breakthrough-accelerator" },
  { name: "Arizona Forward", file: "horizontal-fullcolor.png", url: "https://arizonaforward.org/" },
  { name: "University of Advancing Technology", file: "uat-university.png", url: "https://www.uat.edu/" },
];

const VISIBLE_COUNT = 3;
const ROTATE_MS = 6000;
const FADE_MS = 400;

function chunk(list, size) {
  const groups = [];
  for (let i = 0; i < list.length; i += size) {
    groups.push(list.slice(i, i + size));
  }
  return groups;
}

export default function PartnerLogos() {
  const groups = useMemo(() => chunk(PARTNERS, VISIBLE_COUNT), []);
  const [groupIndex, setGroupIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef(null);
  const fadeTimeoutRef = useRef(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const goTo = (direction) => {
    // Only clear a *pending* fade timeout (one that hasn't fired yet) — never
    // interrupts a transition already mid-flight, so hovering can't freeze
    // the section at opacity 0.
    clearTimeout(fadeTimeoutRef.current);
    setVisible(false);
    fadeTimeoutRef.current = setTimeout(() => {
      setGroupIndex((prev) => (prev + direction + groups.length) % groups.length);
      setVisible(true);
    }, FADE_MS);
  };

  // A single interval runs for the component's lifetime. Pausing just skips
  // the tick (checked fresh via the ref each time) instead of tearing down
  // and rebuilding the timer — so a hover during a transition never cancels
  // the fade-back-in that's already in progress.
  useEffect(() => {
    if (groups.length <= 1) return undefined;

    intervalRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      goTo(1);
    }, ROTATE_MS);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(fadeTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups.length]);

  const handleManualNav = (direction) => {
    goTo(direction);
  };

  const current = groups[groupIndex] ?? [];

  return (
    <section
      className="bg-background border-t border-border"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
        <p className="text-center text-xs tracking-[0.3em] uppercase text-[hsl(var(--accent))] mb-10">
          Our Partners
        </p>

        <div className="flex items-center justify-center gap-4 md:gap-10">
          <button
            type="button"
            onClick={() => handleManualNav(-1)}
            disabled={groups.length <= 1}
            aria-label="Previous partners"
            className="shrink-0 text-foreground/40 hover:text-primary transition-colors disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            className="flex items-center justify-center gap-10 md:gap-24"
            style={{
              opacity: visible ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease`,
            }}
          >
            {current.map((partner) => {
              const logo = (
                <img
                  src={`${import.meta.env.BASE_URL}partners/${partner.file}`}
                  alt={partner.name}
                  title={partner.name}
                  className="max-h-full max-w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              );

              return (
                <div
                  key={partner.file}
                  className="h-20 w-40 md:h-28 md:w-56 flex items-center justify-center"
                >
                  {partner.url ? (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={partner.name}
                      className="h-full w-full flex items-center justify-center"
                    >
                      {logo}
                    </a>
                  ) : (
                    logo
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleManualNav(1)}
            disabled={groups.length <= 1}
            aria-label="Next partners"
            className="shrink-0 text-foreground/40 hover:text-primary transition-colors disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
}
