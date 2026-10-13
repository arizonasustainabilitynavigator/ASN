import React, { useState } from "react";
import { X } from "lucide-react";
import moment from "moment";
import { api } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { WASTE_TYPES } from "@/lib/constants";

export const CATEGORIES = ["cleanup", "workshop", "networking", "conference", "webinar"];

// Modal: create/edit an event
export default function AddEventModal({ event, onClose, onCreated }) {
  // State
  const { user } = useAuth();
  const { toast } = useToast();
  const isEditing = !!event;
  const [form, setForm] = useState({
    title: event?.title || "",
    organization: event?.organization || "",
    date: event?.date ? moment(event.date).format("YYYY-MM-DD") : "",
    time: event?.time || "",
    location: event?.location || "",
    categories: event?.categories || [],
    waste_types: event?.waste_types || [],
    description: event?.description || "",
    link: event?.link || "",
    phone: event?.phone || "",
    contact_email: event?.contact_email || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Handlers
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleInList = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) {
      setError("Title and date are required.");
      return;
    }
    if (form.categories.length === 0) {
      setError("Pick at least one tag.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      // Add a scheme to bare links (e.g. "youtube.com") so they work when clicked
      const link = form.link.trim();
      const normalizedLink = link && !/^https?:\/\//i.test(link) ? `https://${link}` : link;
      const payload = { ...form, link: normalizedLink };

      const saved = isEditing
        ? await api.entities.Event.update(event.id, {
            ...payload,
            date: new Date(form.date).toISOString(),
          })
        : await api.entities.Event.create({
            ...payload,
            date: new Date(form.date).toISOString(),
            created_by: user.id,
          });
      onCreated(saved);
    } catch (err) {
      const message = err.message || "Something went wrong.";
      setError(message);
      toast({
        title: message.toLowerCase().includes("profanity")
          ? "Inappropriate Language in Event"
          : "Couldn't save event",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Render
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card border border-border p-8 md:p-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-foreground/70 hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">
          {isEditing ? "Edit Event" : "Post an Event"}
        </p>
        <h2 className="font-heading text-2xl text-foreground mb-8">
          {isEditing ? "Update Event Details" : "Add to the Calendar"}
        </h2>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Event Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Your Event Name"
              autoComplete="off"
              className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Organization / Company</label>
            <input
              type="text"
              value={form.organization}
              onChange={(e) => update("organization", e.target.value)}
              placeholder="Your Organization Name"
              className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">
              Time <span className="normal-case text-foreground/50">(optional)</span>
            </label>
            <input
              type="text"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              placeholder="Time of the event"
              className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">
              Tags * <span className="normal-case text-foreground/50">(pick as many as apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleInList("categories", c)}
                  className={`px-3 py-1.5 text-xs tracking-[0.05em] uppercase transition-colors ${
                    form.categories.includes(c)
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-foreground/70 hover:border-primary hover:text-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">
              Waste Types <span className="normal-case text-foreground/50">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {WASTE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleInList("waste_types", type)}
                  className={`px-3 py-1.5 text-xs tracking-[0.05em] uppercase transition-colors ${
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

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Location of the event"
              className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">
              Event Link <span className="normal-case text-foreground/50">(optional)</span>
            </label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => update("link", e.target.value)}
              placeholder="youtube.com or https://..."
              className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">
              Contact Phone <span className="normal-case text-foreground/50">(optional)</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="(555) 555-5555"
              className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">
              Contact Email <span className="normal-case text-foreground/50">(optional)</span>
            </label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => update("contact_email", e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="What's this event about?"
              className="w-full bg-background border border-border px-4 py-3 text-foreground text-sm placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-3.5 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : isEditing ? "Save Changes" : "Post Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
