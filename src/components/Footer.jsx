import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <img
              src={`${import.meta.env.BASE_URL}ASN_logo_full.png`}
              alt="Arizona Sustainability Navigator"
              className="h-20 w-auto mb-4"
            />

            <p className="text-background/70 text-sm italic mb-4">
              A Collaboration for Good Initiative.
            </p>

            <p className="text-background/60 text-sm max-w-sm leading-relaxed">
              Connecting Arizonans to sustainability resources that support a
              cleaner future.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-background/60 mb-6">
              Navigate
            </h4>

            <div className="flex flex-col gap-3">
              {[
                { label: "Home", to: "/" },
                { label: "Resources", to: "/resource" },
                { label: "Events", to: "/events" },
                { label: "Profile", to: "/profile" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-primary text-sm underline underline-offset-4 hover:no-underline transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-background/60 mb-6">
              Connect
            </h4>

            <div className="flex flex-col gap-3">
              <a
                href="https://www.collaborationforgood.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm underline underline-offset-4 hover:no-underline"
              >
                www.collaborationforgood.com
              </a>

              <a
                href="mailto:connect@collaborationforgood.com"
                className="text-primary text-sm underline underline-offset-4 hover:no-underline"
              >
                connect@collaborationforgood.com
              </a>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.facebook.com/arizonasustainabilitynavigator/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-background/60 hover:text-primary transition-colors"
              >
                <FaFacebook size={18} />
              </a>

              <a
                href="https://www.instagram.com/arizonasustainabilitynavigator/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-background/60 hover:text-primary transition-colors"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://www.linkedin.com/company/arizonasustainabilitynavigator/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-background/60 hover:text-primary transition-colors"
              >
                <FaLinkedin size={18} />
              </a>

              <a
                href="https://x.com/azsustainnav"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="text-background/60 hover:text-primary transition-colors"
              >
                <FaXTwitter size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="h-[0.5px] bg-background/10 mt-16 mb-8" />

        <div className="flex items-center justify-between">
          <p className="text-background/60 text-xs">
            © {new Date().getFullYear()} Arizona Sustainability Navigator. All
            rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex flex-col items-center gap-1 text-primary hover:text-background transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
            <div className="w-[2px] h-8 bg-primary group-hover:bg-background transition-colors" />
          </button>
        </div>
      </div>
    </footer>
  );
}