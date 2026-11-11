// Google Analytics 4 (gtag.js) integration.
// Measurement ID comes from VITE_GA_MEASUREMENT_ID; analytics stay off if it's unset
// (e.g. local dev without the env var) so we never report local sessions to GA.
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;

// Loads gtag.js and starts the dataLayer. Page views are sent manually (see
// trackPageView) since this is a HashRouter SPA and gtag's automatic
// pageview tracking doesn't know about route changes.
export function initAnalytics() {
  if (initialized || !GA_MEASUREMENT_ID || typeof window === "undefined") return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

// Generic event helper; no-ops when analytics isn't initialized.
export function trackEvent(name, params = {}) {
  if (!initialized || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export function trackPageView(path) {
  trackEvent("page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackSearch(searchTerm) {
  if (!searchTerm) return;
  trackEvent("search", { search_term: searchTerm });
}

// Only the content type is sent — no listing id or name, so individual
// businesses/resources stay unidentifiable in GA.
export function trackResourceClick(type) {
  trackEvent("select_content", {
    content_type: type, // "business" | "curated_resource"
  });
}
