import React from "react";

// One section within a policy page (heading + body copy), marked with a
// short accent rule instead of a repeated full-width divider
export default function PolicySection({ heading, children }) {
  return (
    <section className="pt-10 first:pt-0">
      <div className="w-10 h-[2px] bg-primary mb-5" />
      <h2 className="font-heading text-xl md:text-2xl text-foreground mb-4">
        {heading}
      </h2>
      <div className="text-foreground/70 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}
