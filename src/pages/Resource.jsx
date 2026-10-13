import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/api/client";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import zipcodes from "zipcodes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import ResourceDetailPanel from "@/components/ResourceDetailPanel";
import CuratedResourceCard from "@/components/CuratedResourceCard";
import CuratedResourceDetailPanel from "@/components/CuratedResourceDetailPanel";
import { CURATED_RESOURCE_FILTERS } from "@/lib/constants";

const SEARCH_RADIUS_MILES = 25;
const ZIP_PATTERN = /^\d{5}$/;
const PAGE_SIZE = 27;

// Resource directory page (businesses + curated resources, combined and paginated)
export default function Resource() {
  // State (search/filter pre-filled from URL params, e.g. from the quiz results page)
  const [searchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [curatedResources, setCuratedResources] = useState([]);
  const [curatedTotal, setCuratedTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [curatedLoading, setCuratedLoading] = useState(true);
  const [search, setSearch] = useState(() => searchParams.get("zip") || "");
  const [curatedFilter, setCuratedFilter] = useState(() => {
    const category = searchParams.get("category");
    return CURATED_RESOURCE_FILTERS.some((f) => f.label === category) ? category : "";
  });
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedCuratedResource, setSelectedCuratedResource] = useState(null);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const curatedRequestId = useRef(0);

  useEffect(() => {
    loadBusinesses();
  }, []);

  // Zip-radius search setup
  const normalizedSearch = search.trim().toLowerCase();
  const isZipSearch = ZIP_PATTERN.test(normalizedSearch);
  const nearbyZips = isZipSearch ? new Set(zipcodes.radius(normalizedSearch, SEARCH_RADIUS_MILES)) : null;

  // Nearby zips resolved to city names + distance, for matching/sorting curated resources
  const cityDistances = isZipSearch
    ? [...nearbyZips].reduce((map, z) => {
        const info = zipcodes.lookup(z);
        const dist = zipcodes.distance(normalizedSearch, z) ?? Infinity;
        if (info?.city && (!map.has(info.city) || dist < map.get(info.city))) {
          map.set(info.city, dist);
        }
        return map;
      }, new Map())
    : null;
  const nearbyCities = isZipSearch ? new Set(cityDistances.keys()) : null;

  // Business search/filter/sort
  const filteredBusinesses = businesses
    .filter((b) => {
      const businessZip = b.zip_code ? String(b.zip_code).trim() : "";
      const matchesName = b.business_name?.toLowerCase().includes(normalizedSearch);
      const matchesZip = isZipSearch
        ? nearbyZips.has(businessZip)
        : businessZip.toLowerCase().includes(normalizedSearch);
      const matchesSearch = !normalizedSearch || matchesName || matchesZip;
      const selectedCuratedFilter = CURATED_RESOURCE_FILTERS.find((f) => f.label === curatedFilter);
      const matchesCuratedFilter =
        !curatedFilter ||
        selectedCuratedFilter?.relatedWasteTypes.some((wt) => b.waste_types?.includes(wt));
      return matchesSearch && matchesCuratedFilter;
    })
    .sort((a, b) => {
      if (!isZipSearch) return 0;
      const distA = zipcodes.distance(normalizedSearch, a.zip_code ? String(a.zip_code).trim() : "") ?? Infinity;
      const distB = zipcodes.distance(normalizedSearch, b.zip_code ? String(b.zip_code).trim() : "") ?? Infinity;
      return distA - distB;
    });

  // Pagination (businesses first, curated resources fill the rest of each page)
  const businessCount = filteredBusinesses.length;
  const pageStart = (page - 1) * PAGE_SIZE;
  const businessesOnPage = filteredBusinesses.slice(pageStart, pageStart + PAGE_SIZE);
  const curatedNeeded = PAGE_SIZE - businessesOnPage.length;
  const curatedOffset = Math.max(0, pageStart - businessCount);

  useEffect(() => {
    setPage(1);
  }, [search, curatedFilter]);

  useEffect(() => {
    if (loading) return; // wait for businessCount to be known before paginating
    const timeout = setTimeout(() => {
      loadCuratedResources();
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, curatedFilter, page, loading, businessCount, isZipSearch]);

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  // Data loading
  const loadBusinesses = async () => {
    try {
      const data = await api.entities.BusinessProfile.list("-created_date", 50);
      setBusinesses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadCuratedResources = async () => {
    const requestId = ++curatedRequestId.current;
    setCuratedLoading(true);
    try {
      const selectedFilter = CURATED_RESOURCE_FILTERS.find((f) => f.label === curatedFilter);

      if (isZipSearch) {
        // Zip search: fetch all matches for nearby cities, sort by real distance client-side
        const { data } = await api.entities.CuratedResource.list({
          cities: [...nearbyCities],
          categoryKeywords: selectedFilter?.keywords,
          limit: 1000,
          offset: 0,
        });
        if (requestId !== curatedRequestId.current) return;

        const closestDistance = (resource) =>
          (resource.cities || []).reduce(
            (min, c) => Math.min(min, cityDistances.get(c) ?? Infinity),
            Infinity
          );
        const sorted = [...data].sort((a, b) => closestDistance(a) - closestDistance(b));

        setCuratedTotal(sorted.length);
        setCuratedResources(curatedNeeded > 0 ? sorted.slice(curatedOffset, curatedOffset + curatedNeeded) : []);
        return;
      }

      const { data, count } = await api.entities.CuratedResource.list({
        search: search.trim(),
        categoryKeywords: selectedFilter?.keywords,
        limit: Math.max(curatedNeeded, 0),
        offset: curatedOffset,
      });
      // Ignore stale responses
      if (requestId !== curatedRequestId.current) return;
      setCuratedResources(curatedNeeded > 0 ? data : []);
      setCuratedTotal(count);
    } catch (e) {
      console.error(e);
    } finally {
      if (requestId === curatedRequestId.current) setCuratedLoading(false);
    }
  };

  const totalCombined = businessCount + curatedTotal;
  const totalPages = Math.max(1, Math.ceil(totalCombined / PAGE_SIZE));

  // Pagination handlers
  const goToPage = (n) => {
    const clamped = Math.min(Math.max(1, n), totalPages);
    setPage(clamped);
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const n = parseInt(pageInput, 10);
    if (!isNaN(n)) goToPage(n);
    else setPageInput(String(page));
  };

  // Render
  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />

      <div className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Resource Directory</p>
          <h1 className="font-heading text-4xl md:text-6xl text-foreground leading-tight mb-4">
            The Resource Vault
          </h1>
          <p className="text-foreground/70 text-lg max-w-xl">
            Browse verified waste management partners across Arizona. Connect directly via phone or email.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-[0.5px] bg-border mb-8" />

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/70" />
            <input
              type="text"
              placeholder="Search businesses or zip code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/70" />
            <select
              value={curatedFilter}
              onChange={(e) => setCuratedFilter(e.target.value)}
              className="bg-card border border-border pl-11 pr-8 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors appearance-none min-w-[220px]"
            >
              <option value="">All Resource Categories</option>
              {CURATED_RESOURCE_FILTERS.map((f) => (
                <option key={f.label} value={f.label}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        {curatedResources.length > 0 && (
          <p className="text-foreground/50 text-xs mb-6">
            * Official resource — provided directly, not a business submission.
          </p>
        )}

        {loading || curatedLoading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : businessesOnPage.length === 0 && curatedResources.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-foreground/70 text-lg mb-4">No resources found</p>
            <p className="text-foreground/70 text-sm mb-8">
              {businesses.length === 0
                ? "Be the first to add your business to the directory."
                : "Try adjusting your search or filters."}
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors"
            >
              Add Your Business
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {businessesOnPage.map((b) => (
              <ResourceCard key={b.id} business={b} onClick={() => setSelectedBusiness(b)} />
            ))}
            {curatedResources.map((r) => (
              <CuratedResourceCard key={r.id} resource={r} onClick={() => setSelectedCuratedResource(r)} />
            ))}
          </div>
        )}

        {!loading && !curatedLoading && totalCombined > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-4 mb-16">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
              className="flex items-center justify-center w-10 h-10 border border-border text-foreground hover:border-primary disabled:opacity-30 disabled:hover:border-border transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2 text-sm text-foreground/70">
              <span>Page</span>
              <input
                type="text"
                inputMode="numeric"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={handlePageInputSubmit}
                className="w-14 bg-card border border-border px-2 py-1.5 text-center text-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <span>of {totalPages}</span>
            </form>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
              className="flex items-center justify-center w-10 h-10 border border-border text-foreground hover:border-primary disabled:opacity-30 disabled:hover:border-border transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <Footer />

      {selectedBusiness && (
        <ResourceDetailPanel business={selectedBusiness} onClose={() => setSelectedBusiness(null)} />
      )}

      {selectedCuratedResource && (
        <CuratedResourceDetailPanel
          resource={selectedCuratedResource}
          onClose={() => setSelectedCuratedResource(null)}
        />
      )}
    </div>
  );
}
