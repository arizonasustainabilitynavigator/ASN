import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Homepage "join the network" call-to-action section
export default function CTASection() {
  return (
    <section className="relative py-24 md:py-40 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(132,204,22,0.15),_transparent_30%),bg-slate-950]">
      
      <div className="absolute inset-0 bg-foreground/85" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <p className="tracking-[0.3em] uppercase mb-6 text-accent-light text-sm">JOIN THE NETWORK</p>
        <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-background leading-tight mb-6 max-w-3xl mx-auto">
          Your engagement drives a more sustainable Arizona
        </h2>
        <p className="text-background/60 text-lg max-w-xl mx-auto mb-10">
          Sign up to access personalized sustainability tools and join a statewide community working toward meaningful environmental progress.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-3 bg-primary text-background px-10 py-4 text-sm tracking-[0.1em] uppercase hover:bg-background hover:text-foreground transition-colors">
          
          Create Your Account <ArrowRight size={16} />
        </Link>
      </div>
    </section>);

}