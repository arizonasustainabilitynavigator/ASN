import React from "react";
import { Compass, BadgeCheck, BookOpen, CalendarDays } from "lucide-react";

// Feature list content
const features = [
{
  icon: Compass,
  title: "Personalized Sustainability Guidance",
  description: "Custom recommendations tailored to each Arizonan based on their location, needs, goals, and operations."
},
{
  icon: BadgeCheck,
  title: "Verified Programs, Utilities & Rebates",
  description: "Access to accurate, location-specific resources including utility programs, incentives, rebates, and statewide sustainability initiatives."
},
{
  icon: BookOpen,
  title: "Learning & Environmental Education",
  description: "Clear, approachable information on sustainability practices, waste reduction, energy and water efficiency, and greenhouse gas basics."
},
{
  icon: CalendarDays,
  title: "Community Events & Local Engagement",
  description: "Connections to Arizona sustainability events, workshops, and community opportunities that support learning and action."
}];


// Homepage "how it works" features section
export default function FeaturesSection() {
  return (
    <section className="py-24 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl mb-16 md:mb-24">
          <p className="tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))] text-sm">HOW IT WORKS</p>
          <h2 className="font-heading text-3xl md:text-5xl text-foreground leading-tight mb-6">
            Your link to custom waste resources
          </h2>
          <div className="h-[0.5px] w-24 bg-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {features.map((feature, i) =>
          <div
            key={i}
            className="group p-8 md:p-12 border border-border hover:border-primary/30 transition-colors">
            
              <feature.icon
              size={28}
              className="text-primary mb-6"
              strokeWidth={1.5} />
            
              <h3 className="font-heading text-xl text-foreground mb-3">{feature.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{feature.description}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}