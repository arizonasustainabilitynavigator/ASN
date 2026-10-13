import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Sample event content for the homepage preview
const previewEvents = [
{
  date: "Jul 15",
  title: "Zero Waste Business Workshop",
  location: "Phoenix Convention Center",
  category: "workshop"
},
{
  date: "Jul 22",
  title: "Arizona Green Economy Networking",
  location: "Scottsdale Civic Center",
  category: "networking"
},
{
  date: "Aug 05",
  title: "Sustainable Supply Chain Conference",
  location: "Tempe Mission Palms",
  category: "conference"
}];


// Homepage events preview section
export default function EventsPreview() {
  return (
    <section className="py-24 md:py-40 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Community</p>
            <h2 className="font-heading text-3xl md:text-5xl text-foreground leading-tight mb-6">
              Upcoming events across Arizona
            </h2>
            <div className="h-[0.5px] w-24 bg-primary mb-10" />

            <div className="space-y-0">
              {previewEvents.map((event, i) =>
              <div key={i} className="py-6 border-b border-border group">
                  <div className="flex items-start gap-6">
                    <span className="font-heading text-2xl font-semibold min-w-[80px] text-[hsl(var(--accent))]">
                      {event.date}
                    </span>
                    <div>
                      <h4 className="text-foreground font-medium text-lg group-hover:text-primary transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-foreground/70 text-sm mt-1">{event.location}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/events"
              className="inline-flex items-center gap-2 mt-8 text-primary text-sm tracking-[0.1em] uppercase hover:gap-4 transition-all">
              
              View All Events <ArrowRight size={14} />
            </Link>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
            <div className="h-full aspect-[4/3]" />
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-background text-lg font-semibold">
              Arizona sustainability events and community gatherings
            </div>
          </div>
        </div>
      </div>
    </section>);

}