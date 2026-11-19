import React from "react";
import { Link } from "react-router-dom";

const POLICIES = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Accessibility Statement", to: "/accessibility" },
];

// "Our policies" cross-link box shown at the end of each policy page
export default function PolicyLinks({ current }) {
  return (
    <div className="mt-16 pt-8 border-t border-border">
      <p className="text-xs tracking-[0.2em] uppercase text-foreground/50 mb-4">
        Our policies
      </p>
      <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Policy pages">
        {POLICIES.map((policy) =>
          policy.to === current ? (
            <span
              key={policy.to}
              aria-current="page"
              className="text-sm text-primary font-medium"
            >
              {policy.label}
            </span>
          ) : (
            <Link
              key={policy.to}
              to={policy.to}
              className="text-sm text-foreground/70 underline underline-offset-4 hover:text-primary transition-colors"
            >
              {policy.label}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
