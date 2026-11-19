import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PolicySection from "@/components/PolicySection";
import PolicyLinks from "@/components/PolicyLinks";

const LAST_UPDATED = "November 16, 2026";

// Privacy Policy
// Approved text from ASN_Policy_Pages_To_Publish.docx — do not edit the wording here.
export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-foreground/50 text-sm mb-10">
            Last updated: {LAST_UPDATED}
          </p>

          <p className="text-foreground/70 leading-relaxed mb-10">
            The Arizona Sustainability Navigator respects your privacy. This
            policy explains what information this site collects, why, and
            what you can do about it.
          </p>

          <PolicySection heading="Who we are">
            <p>
              The Arizona Sustainability Navigator is a free statewide
              resource that helps Arizona small businesses, nonprofits and
              government find sustainability programs, incentives,
              businesses and events. It is operated by Collaboration for
              Good, LLC, founded and led by Tyler Butler, at
              arizonasustainabilitynavigator.com. For any question about this
              policy, or about information we hold on you, write to{" "}
              <a
                href="mailto:connect@collaborationforgood.com"
                className="text-primary underline underline-offset-4 hover:no-underline"
              >
                connect@collaborationforgood.com
              </a>
              .
            </p>
          </PolicySection>

          <PolicySection heading="What we collect">
            <p>
              Your account. If you create an account, we collect your email
              address and a password. If you sign in with Google, we receive
              your name, email address and profile picture from Google. We
              send verification and password reset emails to the address you
              give us.
            </p>
            <p>
              Your quiz answers. The sustainability quiz asks about your ZIP
              code and county, your organization type and size, your
              location and facility, your day-to-day operations, the
              resources you rely on and the costs you would most like to
              reduce, the sustainability topics that matter to you, where you
              are today, the challenges you face, the support and incentives
              you want, and how you would like your action plan organized. If
              you are signed in, your answers are saved to your account. If
              you are not signed in, your answers are held temporarily in
              your browser and saved to your account only if you later sign
              in.
            </p>
            <p>
              Business listings. If you create a business profile, we collect
              what you enter: business name, tagline, description, phone,
              email, website, location type, street address, city, the
              resource types you handle, and a logo. If you choose to list
              your business, that information is shown to other signed-in
              users of the directory.
            </p>
            <p>
              Events. If you submit an event, we collect its title,
              organizing group, date, time, location, categories, the
              resource types it covers, a web link, contact details and
              description. Submitted events are public on the site.
            </p>
            <p>
              Information collected automatically. This site uses Google
              Analytics to understand how visitors find and use it, such as
              which pages are viewed, how long visits last, the site or
              search that sent you, your approximate location at city or
              region level, and your browser and device type. Google
              Analytics collects this information using cookies and does not
              tell us who you are. We use it in aggregate, and we do not send
              your account details, quiz answers or listing details to
              Google Analytics. We do not use advertising or tracking tools.
              Like every website, our host records standard technical
              information when a page is requested, such as your IP address,
              browser type and the page requested, to keep the site running
              and secure. Our pages load their typefaces from Google Fonts,
              which receives your IP address when it delivers them.
            </p>
            <p>
              We do not collect payment information. Please do not enter
              sensitive personal information, such as health, financial
              account or government ID details, in any field on this site.
            </p>
          </PolicySection>

          <PolicySection heading="Why we collect it">
            <p>
              To run your account. To match your quiz answers to relevant
              resources. To show business listings and events in the
              directory. To understand which pages and resources are useful,
              so we can improve them and report on the Navigator's reach. To
              keep the site secure and meet our legal obligations.
            </p>
            <p>
              We may use quiz responses, combined and with names and contact
              details removed, to understand the sustainability needs of
              Arizona organizations and to report on that in research and to
              partners. We will not publish or share an individual
              organization's quiz answers.
            </p>
            <p>
              Under GDPR, our lawful bases are your consent, where you
              submitted something to us, and our legitimate interest in
              running, securing and improving the site.
            </p>
          </PolicySection>

          <PolicySection heading="Who we share it with">
            <p>We do not sell your information.</p>
            <p>
              We use service providers who process information on our behalf
              and may only use it to provide their service to us. They
              currently include:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Supabase, for accounts, our database and logo storage</li>
              <li>Google, for Google sign-in, Google Analytics and Google Fonts</li>
              <li>GitHub, for website hosting</li>
              <li>
                Our email delivery provider, for account emails such as
                sign-up codes and password resets
              </li>
              <li>
                Our email provider, for messages you send to{" "}
                <a
                  href="mailto:connect@collaborationforgood.com"
                  className="text-primary underline underline-offset-4 hover:no-underline"
                >
                  connect@collaborationforgood.com
                </a>
              </li>
            </ul>
            <p>
              Information you choose to make public, such as a listed
              business profile or a submitted event, can be seen by other
              users. We will disclose information if we are legally required
              to.
            </p>
          </PolicySection>

          <PolicySection heading="Cookies and similar technology">
            <p>
              The site uses browser storage that is necessary for it to
              work, such as keeping you signed in and holding quiz answers
              before you sign in. These cannot be switched off. If you sign
              in with Google, Google may set its own cookies under its own
              policy.
            </p>
            <p>
              This site uses Google Analytics cookies (named _ga and
              _ga_&lt;ID&gt;) to measure visits. You can block these cookies
              in your browser settings or with Google's opt-out tool at{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:no-underline"
              >
                tools.google.com/dlpage/gaoptout
              </a>
              . If you follow a link to another site, such as a program,
              partner or listed business, that site may set its own cookies
              under its own policy.
            </p>
          </PolicySection>

          <PolicySection heading="How long we keep it">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Account, quiz answers, listings and events: for as long as
                your account is active, or until you ask us to delete them
              </li>
              <li>Google Analytics data: 14 months, then deleted automatically</li>
              <li>
                Emails you send us: up to 24 months after our last contact
                with you, then deleted
              </li>
            </ul>
          </PolicySection>

          <PolicySection heading="Your rights">
            <p>
              Wherever you are, you can ask us what information we hold on
              you, ask us to correct it, and ask us to delete it, including
              your account, quiz answers, business profile and events. Write
              to{" "}
              <a
                href="mailto:connect@collaborationforgood.com"
                className="text-primary underline underline-offset-4 hover:no-underline"
              >
                connect@collaborationforgood.com
              </a>{" "}
              from the email address on your account and we will respond
              within thirty days.
            </p>
            <p>
              If you are in the UK or Europe, you also have the right to
              object to processing, to restrict it, to receive your data in a
              portable format, and to complain to your data protection
              authority.
            </p>
            <p>
              If you are in California, you have the right to know what we
              collect, to request deletion, to correct inaccurate
              information, and not to be discriminated against for
              exercising those rights. We do not sell or share personal
              information as those terms are defined under the CCPA and
              CPRA.
            </p>
          </PolicySection>

          <PolicySection heading="Security">
            <p>
              We use reputable providers and keep access to information
              limited to those who need it. No website can promise perfect
              security, and we will not pretend otherwise.
            </p>
          </PolicySection>

          <PolicySection heading="International transfers">
            <p>
              We are based in the United States and our providers may store
              information there. If you use the site from outside the
              United States, your information may be transferred to and
              processed in the United States.
            </p>
          </PolicySection>

          <PolicySection heading="Children">
            <p>
              This site is not directed at children under 13 and we do not
              knowingly collect their information. If you believe a child
              has given us information, write to us and we will delete it.
            </p>
          </PolicySection>

          <PolicySection heading="Links to other sites">
            <p>
              The directory links to programs, organizations and businesses
              we do not run. We are not responsible for their privacy
              practices.
            </p>
          </PolicySection>

          <PolicySection heading="Changes">
            <p>
              If we change this policy we will update the date at the top.
              Material changes will be noted on this page.
            </p>
          </PolicySection>

          <PolicyLinks current="/privacy" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
