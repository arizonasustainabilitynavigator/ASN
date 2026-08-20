import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import MissionSection from "@/components/MissonSection";
import CTASection from "@/components/CTASection";
import PartnerLogos from "@/components/PartnerLogos";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />
      <HeroSection />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-[0.5px] bg-border" />
      </div>
      <FeaturesSection />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-[0.5px] bg-border" />
      </div>
      <MissionSection />
      <CTASection />
      <PartnerLogos />
      <Footer />
    </div>
  );
}