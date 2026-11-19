import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PolicySection from "@/components/PolicySection";
import PolicyLinks from "@/components/PolicyLinks";

const LAST_UPDATED = "November 16, 2026";

// Accessibility Statement
// Approved text from ASN_Policy_Pages_To_Publish.docx — do not edit the wording here.
export default function AccessibilityStatement() {
  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />

      <div className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
            Legal
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-foreground leading-tight mb-4">
            Accessibility Statement
          </h1>
          <p className="text-foreground/50 text-sm mb-10">
            Last updated: {LAST_UPDATED}
          </p>

          <p className="text-foreground/70 leading-relaxed mb-10">
            The Navigator exists to make sustainability resources easier to
            reach for every Arizona organization. That has to include
            people with disabilities.
          </p>

          <PolicySection heading="Our aim">
            <p>
              We are working to meet the Web Content Accessibility
              Guidelines, WCAG 2.1, at Level AA. That standard covers color
              contrast, keyboard navigation, screen reader support, text
              alternatives for images, form labels and clear structure.
            </p>
          </PolicySection>

          <PolicySection heading="Where we are">
            <p>
              We are reviewing the site against this standard. As each area
              is checked on the live site, we will list it here.
            </p>
          </PolicySection>

          <PolicySection heading="Known gaps">
            <p>
              Some documents on this site may be PDFs that are not fully
              readable by screen readers. If you need one in an accessible
              format, ask us and we will provide it.
            </p>
            <p>
              Logos uploaded by businesses may not include text
              descriptions. Programs and sites we link to are outside our
              control.
            </p>
          </PolicySection>

          <PolicySection heading="Tell us">
            <p>
              If something on this site does not work for you, we want to
              know. Write to{" "}
              <a
                href="mailto:connect@collaborationforgood.com"
                className="text-primary underline underline-offset-4 hover:no-underline"
              >
                connect@collaborationforgood.com
              </a>{" "}
              with the page and what happened, and we will respond within
              five business days and tell you what we can do. If you need
              any information from this site in a different format, ask and
              we will provide it at no cost.
            </p>
          </PolicySection>

          <PolicyLinks current="/accessibility" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
