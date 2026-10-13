import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Homepage mission section (with play-on-scroll video)
export default function MissionSection() {
  const videoRef = useRef(null);

  // Play/pause the video based on viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-40 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="tracking-[0.3em] uppercase mb-4 text-sm text-[hsl(var(--accent))]">OUR MISSION</p>
            <h2 className="font-heading text-3xl md:text-5xl text-foreground leading-tight mb-6">
              Helping Arizona thrive through sustainable action
            </h2>
            <div className="h-[0.5px] w-24 bg-primary mb-8" />
            <p className="text-foreground/70 leading-relaxed mb-8 max-w-lg">
              We inspire sustainable choices by making environmental action clearer, more accessible, and rooted in Arizona's local strengths — empowering communities to move forward together.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary text-sm tracking-[0.1em] uppercase hover:gap-4 transition-all">
              
              Learn More About Us <ArrowRight size={14} />
            </Link>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 aspect-[16/9] border-8 border-background">
            <video
              ref={videoRef}
              src={`${import.meta.env.BASE_URL}mission-video.mp4`}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>);

}