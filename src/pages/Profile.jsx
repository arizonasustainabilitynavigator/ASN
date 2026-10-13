import React, { useState, useEffect, useRef } from "react";
import { api } from "@/api/client";
import { Upload, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WASTE_TYPES } from "@/lib/constants";

// Business profile editor page
export default function Profile() {
  // State
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingId, setExistingId] = useState(null);
  const [form, setForm] = useState({
    business_name: "",
    tagline: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    zip_code: "",
    location_type: "physical",
    address: "",
    city: "",
    logo_url: "",
    waste_types: [],
    is_listed: false
  });

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  // Load the signed-in user's existing business profile, if any
  const loadProfile = async () => {
    try {
      const profiles = await api.entities.BusinessProfile.filter({ user_id: user.id });
      if (profiles.length > 0) {
        const p = profiles[0];
        setExistingId(p.id);
        setForm({
          business_name: p.business_name || "",
          tagline: p.tagline || "",
          description: p.description || "",
          phone: p.phone || "",
          email: p.email || "",
          website: p.website || "",
          zip_code: p.zip_code || "",
          location_type: p.location_type || "physical",
          address: p.address || "",
          city: p.city || "",
          logo_url: p.logo_url || "",
          waste_types: p.waste_types || [],
          is_listed: p.is_listed || false
        });
      } else if (user.email) {
        setForm((prev) => ({ ...prev, email: user.email }));
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load profile", description: "Please refresh and try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file, userId: user.id });
      setForm((prev) => ({ ...prev, logo_url: file_url }));
    } catch (e) {
      console.error(e);
      toast({ title: "Upload failed", description: e.message || "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const toggleWasteType = (type) => {
    setForm((prev) => ({
      ...prev,
      waste_types: prev.waste_types.includes(type)
        ? prev.waste_types.filter((t) => t !== type)
        : [...prev.waste_types, type]
    }));
  };

  const handleSave = async () => {
    if (!form.business_name.trim()) {
      toast({ title: "Business name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (existingId) {
        await api.entities.BusinessProfile.update(existingId, form);
      } else {
        const created = await api.entities.BusinessProfile.create({ ...form, user_id: user.id });
        setExistingId(created.id);
      }
      toast({ title: "Profile saved successfully" });
    } catch (e) {
      console.error(e);
      const message = e.message || "Please try again.";
      toast({
        title: message.toLowerCase().includes("profanity")
          ? "Inappropriate Language in Profile"
          : "Failed to save",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Render: loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Render: profile form
  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />

      <div className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 text-center">The Collective Canvas</p>
          <h1 className="font-heading text-4xl md:text-5xl text-foreground leading-tight mb-4 text-center">
            Your Business Profile
          </h1>
          <p className="text-foreground/70 text-center mb-12">
            Your business is a pillar of the Arizona future.
          </p>

          {/* Logo Upload */}
          <div className="flex flex-col items-center mb-12">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-48 h-48 md:w-56 md:h-56 rounded-full border-2 border-dashed border-primary flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors overflow-hidden"
            >
              {uploading ? (
                <Loader2 size={32} className="text-primary animate-spin" />
              ) : form.logo_url ? (
                <img src={form.logo_url} alt="Business logo" className="w-full h-full object-cover rounded-full" />
              ) : (
                <>
                  <Upload size={28} className="text-primary mb-3" />
                  <span className="text-primary text-xs tracking-[0.1em] uppercase">Upload Logo</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            {form.logo_url && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-primary text-xs tracking-[0.1em] uppercase hover:underline"
              >
                Change Logo
              </button>
            )}
          </div>

          {/* Live Name Preview */}
          {form.business_name && (
            <div className="text-center mb-12 py-6 border-t border-b border-border">
              <p className="text-xs tracking-[0.2em] uppercase text-foreground/70 mb-2">Preview</p>
              <h2 className="font-heading text-3xl md:text-4xl text-foreground">{form.business_name}</h2>
              {form.tagline && <p className="text-[hsl(92_45%_34%)] text-sm mt-2">{form.tagline}</p>}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Business Name *</label>
              <input
                type="text"
                value={form.business_name}
                onChange={(e) => setForm((prev) => ({ ...prev, business_name: e.target.value }))}
                placeholder="Your business name"
                className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm((prev) => ({ ...prev, tagline: e.target.value }))}
                placeholder="A short line shown on your resource card"
                maxLength={80}
                className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Description (full bio)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Tell us about your business and sustainability efforts..."
                rows={4}
                className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="(602) 555-1234"
                  className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="contact@business.com"
                  className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                  placeholder="https://business.com"
                  className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">
                  {form.location_type === "online" ? "Zip Code (service area)" : "Zip Code"}
                </label>
                <input
                  type="text"
                  value={form.zip_code}
                  onChange={(e) => setForm((prev) => ({ ...prev, zip_code: e.target.value }))}
                  placeholder="85001"
                  className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-3">Location Type</label>
              <div className="flex gap-2">
                {[
                  { value: "physical", label: "Physical Location" },
                  { value: "online", label: "Online / Virtual" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, location_type: option.value }))}
                    className={`flex-1 px-4 py-3 text-sm tracking-[0.05em] uppercase transition-colors ${
                      form.location_type === option.value
                        ? "bg-accent text-background"
                        : "border border-border text-foreground/70 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {form.location_type === "physical" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Street Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main St"
                    className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Phoenix"
                    className="w-full bg-card border border-border px-4 py-3 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-3">Resource Types Handled</label>
              <div className="flex flex-wrap gap-2">
                {WASTE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleWasteType(type)}
                    className={`px-4 py-2 text-sm tracking-[0.05em] uppercase transition-colors ${
                      form.waste_types.includes(type)
                        ? "bg-accent text-background"
                        : "border border-border text-foreground/70 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border border-border p-4">
              <div>
                <p className="text-sm text-foreground font-medium">List on Resource Directory</p>
                <p className="text-xs text-foreground/70 mt-1">
                  Make this business visible to others browsing the Resource Vault. Off by default.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, is_listed: !prev.is_listed }))}
                role="switch"
                aria-checked={form.is_listed}
                aria-label="List on Resource Directory"
                className={`relative w-12 h-6 flex-shrink-0 rounded-full transition-colors ${
                  form.is_listed ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    form.is_listed ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="h-[0.5px] bg-border" />

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
              {existingId ? "Update Profile" : "Create Profile"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}