import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "@/lib/analytics";

const SITE_NAME = "Arizona Sustainability Navigator";

const PAGE_TITLES = {
  "/": SITE_NAME,
  "/about": "About",
  "/insights": "Insights",
  "/faq": "FAQ",
  "/quiz": "Sustainability Quiz",
  "/login": "Log In",
  "/register": "Register",
  "/forgot-password": "Forgot Password",
  "/reset-password": "Reset Password",
  "/events": "Events",
  "/resource": "Resources",
  "/profile": "Profile",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
  "/accessibility": "Accessibility Statement",
};

function getPageTitle(pathname) {
  const label = PAGE_TITLES[pathname];
  if (!label) return "Page Not Found | " + SITE_NAME;
  return label === SITE_NAME ? SITE_NAME : `${label} | ${SITE_NAME}`;
}

// Starts GA4 once, then sends a page_view on every route change
export default function PageViewTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  // Runs before the page_view effect below so trackPageView reports the right title
  useEffect(() => {
    document.title = getPageTitle(pathname);
  }, [pathname]);

  useEffect(() => {
    trackPageView(pathname + search);
  }, [pathname, search]);

  return null;
}
