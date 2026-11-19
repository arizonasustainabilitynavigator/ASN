import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PolicySection from "@/components/PolicySection";
import PolicyLinks from "@/components/PolicyLinks";

const LAST_UPDATED = "November 16, 2026";

// Terms of Service
// Approved text from ASN_Policy_Pages_To_Publish.docx — do not edit the wording here.
export default function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="text-foreground/50 text-sm mb-10">
            Last updated: {LAST_UPDATED}
          </p>

          <p className="text-foreground/70 leading-relaxed mb-10">
            These terms govern your use of arizonasustainabilitynavigator.com.
            By using the site or creating an account, you accept them.
          </p>

          <PolicySection heading="Using this site">
            <p>
              The Navigator is free to use. You may read, share and link to
              anything published here. Please credit the Arizona
              Sustainability Navigator when you do.
            </p>
            <p>
              You may not scrape the directory or site at scale, republish
              our research or resource listings in bulk, use the site or its
              contents to train a machine learning model, send spam through
              listing or event contact details, or attempt to interfere with
              how the site runs.
            </p>
          </PolicySection>

          <PolicySection heading="Your account">
            <p>
              You are responsible for keeping your sign-in details secure
              and for activity on your account. Give accurate information.
              We may suspend or remove accounts that break these terms.
            </p>
          </PolicySection>

          <PolicySection heading="What you post">
            <p>
              You can create a business profile and submit events. When you
              do, you confirm that the information is accurate, that you
              have the right to share it, including any logo, and that it is
              not misleading, offensive or unlawful.
            </p>
            <p>
              You keep ownership of what you post. You give us permission to
              display it on the site, and to show it to other users as the
              listing or event settings allow, for as long as it stays on
              the site.
            </p>
            <p>
              We may edit, hide or remove any listing or event at our
              discretion, including content that is inaccurate, outdated,
              promotional rather than sustainability related, or that
              breaks these terms. We filter some language automatically, but
              we do not review every submission before it appears.
            </p>
          </PolicySection>

          <PolicySection heading="Listings are not endorsements">
            <p>
              The directory includes programs, incentives, organizations and
              businesses from public sources and from users. Including them
              does not mean we endorse, verify or recommend them. Check
              details, eligibility and deadlines with the provider before
              you rely on them.
            </p>
          </PolicySection>

          <PolicySection heading="Information, not advice">
            <p>
              Quiz results, resource listings and research on this site are
              general information. They are not legal, financial, tax,
              engineering or compliance advice. Programs and incentives
              change often. Do not act on anything here without advice
              specific to your situation.
            </p>
          </PolicySection>

          <PolicySection heading="Our content">
            <p>
              The Navigator name, logo, design, research, quiz and curated
              resource collection belong to Collaboration for Good and its
              partners, except where credited to someone else. Third party
              logos belong to their owners and appear here to identify those
              organizations.
            </p>
          </PolicySection>

          <PolicySection heading="No warranty">
            <p>
              The site is provided as is. We work to keep it accurate and
              current, but we do not warrant that it will be error free,
              complete, uninterrupted, or that any particular result will
              follow from using it.
            </p>
          </PolicySection>

          <PolicySection heading="Limitation of liability">
            <p>
              To the fullest extent the law allows, Collaboration for Good
              and its partners are not liable for any indirect or
              consequential loss arising from your use of this site or your
              reliance on any listing. Nothing in these terms limits
              liability that cannot be limited by law.
            </p>
          </PolicySection>

          <PolicySection heading="Links">
            <p>
              We link to other sites. We do not control them and we are not
              responsible for their content.
            </p>
          </PolicySection>

          <PolicySection heading="Governing law">
            <p>
              These terms are governed by the laws of the State of Arizona.
              Any dispute will be brought in the state or federal courts
              located in Maricopa County, Arizona.
            </p>
          </PolicySection>

          <PolicySection heading="Changes">
            <p>
              We may update these terms. The date at the top shows when they
              last changed. Continuing to use the site means you accept the
              current version.
            </p>
          </PolicySection>

          <PolicySection heading="Contact">
            <p>
              <a
                href="mailto:connect@collaborationforgood.com"
                className="text-primary underline underline-offset-4 hover:no-underline"
              >
                connect@collaborationforgood.com
              </a>
            </p>
          </PolicySection>

          <PolicyLinks current="/terms" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
