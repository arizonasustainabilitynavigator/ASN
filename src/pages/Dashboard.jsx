import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";
import { Search, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import ResourceDetailPanel from "@/components/ResourceDetailPanel";
import { WASTE_TYPES } from "@/lib/constants";

// Resource directory page (business listings only)
export default function Dashboard() {
  // State
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    loadBusinesses();
  }, []);

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

  // Search/filter
  const filtered = businesses.filter((b) => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchesName = b.business_name?.toLowerCase().includes(normalizedSearch);
    const matchesZip = b.zip_code && String(b.zip_code).toLowerCase().includes(normalizedSearch);
    const matchesSearch = !normalizedSearch || matchesName || matchesZip;
    const matchesType = !filterType || b.waste_types?.includes(filterType);
    return matchesSearch && matchesType;
  });

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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-card border border-border pl-11 pr-8 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors appearance-none min-w-[200px]"
            >
              <option value="">All Waste Types</option>
              {WASTE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
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
            {filtered.map((b) => (
              <ResourceCard key={b.id} business={b} onClick={() => setSelectedBusiness(b)} />
            ))}
          </div>
        )}
      </div>

      <Footer />

      {selectedBusiness && (
        <ResourceDetailPanel business={selectedBusiness} onClose={() => setSelectedBusiness(null)} />
      )}
    </div>
  );
}