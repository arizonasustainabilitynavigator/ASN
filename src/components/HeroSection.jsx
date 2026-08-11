import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import zipcodes from "zipcodes";
import HeroIllustration from "@/components/HeroIllustration";
import ResourceCardMinimal from "@/components/ResourceCardMinimal";
import ResourceDetailPanel from "@/components/ResourceDetailPanel";
import { api } from "@/api/client";
import { CURATED_RESOURCE_FILTERS } from "@/lib/constants";

const SEARCH_RADIUS_MILES = 25;
const ZIP_PATTERN = /^\d{5}$/;

export default function HeroSection() {
  const [wasteType, setWasteType] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const data = await api.entities.BusinessProfile.list("-created_date", 100);
      setBusinesses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!wasteType || !zipCode.trim()) {
      setError("Please select a resource category and enter a zip code.");
      setHasSearched(false);
      return;
    }

    if (!ZIP_PATTERN.test(zipCode.trim())) {
      setError("Please enter a valid 5-digit zip code.");
      setHasSearched(false);
      return;
    }

    setError("");
    setHasSearched(true);
  };

  const normalizedZip = zipCode.trim();
  const nearbyZips = normalizedZip ? new Set(zipcodes.radius(normalizedZip, SEARCH_RADIUS_MILES)) : null;

  const selectedFilter = CURATED_RESOURCE_FILTERS.find((f) => f.label === wasteType);

  const filteredBusinesses = hasSearched
    ? businesses
        .filter((business) => {
          const matchesType =
            wasteType === "all" ||
            selectedFilter?.relatedWasteTypes.some((wt) => business.waste_types?.includes(wt));
          const businessZip = business.zip_code ? String(business.zip_code).trim() : "";
          const matchesZip = !normalizedZip || nearbyZips.has(businessZip);

          return matchesType && matchesZip;
        })
        .sort((a, b) => {
          if (!normalizedZip) return 0;
          const zipA = a.zip_code ? String(a.zip_code).trim() : "";
          const zipB = b.zip_code ? String(b.zip_code).trim() : "";
          const distA = zipcodes.distance(normalizedZip, zipA) ?? Infinity;
          const distB = zipcodes.distance(normalizedZip, zipB) ?? Infinity;

          return distA - distB;
        })
    : [];

  return (
    <>
      <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden bg-background">
        <HeroIllustration />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-6">
                Arizona Sustainability Navigator
              </p>
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.9] mb-8">
                NAVIGATE<br />
                <span className="text-[hsl(var(--accent))]">WASTE.</span>
              </h1>
              <p className="text-foreground/70 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
                Empowering Arizonans with personalized waste and sustainability guidance — delivering local programs, utility options, rebates, and practical next steps.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/quiz"
                  className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors"
                >
                  Sustainability Quiz <ArrowRight size={16} />
                </Link>
                <Link
                  to="/resource"
                  className="inline-flex items-center gap-3 border border-foreground text-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-foreground hover:text-background transition-colors"
                >
                  Browse Resources
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-background/80 backdrop-blur-xl border border-border p-8 md:p-10 shadow-[0_8px_32px_hsl(var(--primary)_/_0.08)]">
                <h3 className="font-heading text-xl text-foreground mb-6">Quick Connect</h3>
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">
                      Resource Category
                    </label>
                    <select
                      value={wasteType}
                      onChange={(event) => setWasteType(event.target.value)}
                      className="w-full bg-white border border-border px-4 py-3 text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select resource category</option>
                      <option value="all">All Resources</option>
                      {CURATED_RESOURCE_FILTERS.map((f) => (
                        <option key={f.label} value={f.label}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(event) => setZipCode(event.target.value)}
                      placeholder="Enter zip code"
                      className="w-full bg-white border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    className="block text-center bg-foreground text-background py-3.5 text-sm tracking-[0.1em] uppercase hover:bg-primary transition-colors w-full"
                  >
                    Find Resources
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {selectedBusiness && (
          <ResourceDetailPanel business={selectedBusiness} onClose={() => setSelectedBusiness(null)} />
        )}
      </section>

      {hasSearched && (
        <section className="relative bg-background">
          <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16 border-t border-border pt-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Available Resources</p>
                <h3 className="font-heading text-3xl text-foreground">
                  {wasteType === "all" ? "All resources" : `${wasteType} options`} near {zipCode}
                </h3>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="rounded border border-border bg-card/70 p-8 text-center">
                <p className="text-foreground/70 text-lg mb-2">No matching resources found.</p>
                <p className="text-foreground/60 text-sm">Try a different zip code or waste type.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBusinesses.slice(0, 6).map((business) => (
                    <ResourceCardMinimal
                      key={business.id}
                      business={business}
                      onClick={() => setSelectedBusiness(business)}
                    />
                  ))}
                </div>
                <div className="mt-8 flex justify-end border-t border-border pt-6">
                  <Link
                    to="/resource"
                    className="inline-flex items-center gap-2 text-primary text-sm tracking-[0.1em] uppercase hover:gap-4 transition-all"
                  >
                    View More <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}
