import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SustainabilityIllustration from "@/components/SustainabilityIllustration";

// About page
export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />

      <div className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Our Mission</p>
          <h1 className="font-heading text-4xl md:text-6xl text-foreground leading-tight mb-6 max-w-3xl">
            Helping Arizona thrive through sustainable action
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl leading-relaxed">
            The Arizona Sustainability Navigator exists to give every Arizonan clear, personalized guidance on sustainability — connecting them to local programs, utilities, rebates, and practical next steps.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-[0.5px] bg-border mb-16 md:mb-24" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center mb-24 md:mb-32">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-6">Why we exist</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              Across Arizona, sustainability can feel out of reach — the right program, rebate, or resource is often scattered across agencies, utilities, and websites, leaving people unsure where to start.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              We built the Navigator to change that — delivering clear, personalized guidance so every Arizonan can turn good intentions into practical, everyday action.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 aspect-[4/3]">
            <SustainabilityIllustration />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-24 md:mb-32">
          {[
            {
              title: "Guide",
              text: "Personalized recommendations tailored to your location, needs, and goals — no guesswork required."
            },
            {
              title: "Learn",
              text: "Access to verified programs, utilities, rebates, and clear education on sustainability practices across the state."
            },
            {
              title: "Engage",
              text: "A calendar of sustainability events, workshops, and community opportunities that keep Arizonans learning and connected year-round."
            }
          ].map((item) => (
            <div key={item.title} className="p-8 md:p-10 border border-border">
              <h3 className="font-heading text-xl text-foreground mb-3">{item.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center pb-24 md:pb-32">
          <h2 className="font-heading text-2xl md:text-4xl text-foreground mb-6 max-w-xl mx-auto">
            Your engagement drives a more sustainable Arizona
          </h2>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors"
          >
            Create Your Account <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}