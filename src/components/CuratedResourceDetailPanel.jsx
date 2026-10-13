import React, { useState } from "react";
import { X, Phone, Mail, ExternalLink, MapPin } from "lucide-react";
import { formatResourceLocations } from "@/lib/formatResourceLocations";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { useToast } from "@/components/ui/use-toast";

// Full-detail slide-over panel for a team-curated resource
export default function CuratedResourceDetailPanel({ resource, onClose }) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const { toast } = useToast();

  if (!resource) return null;

  const locationText = formatResourceLocations(resource);
  const locationCount = resource.cities?.length || resource.counties?.length || 0;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right">
        <div className="sticky top-0 bg-background z-10 p-6 border-b border-border flex items-center justify-between">
          <span className="text-xs tracking-[0.2em] uppercase text-primary">Resource Details</span>
          <button onClick={onClose} className="text-foreground/70 hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center overflow-hidden flex-shrink-0 bg-background">
              <img
                src={`${import.meta.env.BASE_URL}resource_placeholder.png`}
                alt=""
                className="block w-12 h-12 object-contain"
              />
            </div>
            <div className="mt-2">
              <h2 className="font-heading text-2xl md:text-3xl text-foreground">
                <span
                  className="text-foreground/50 mr-1"
                  title="Official resource — provided directly, not a business submission"
                >
                  *
                </span>
                {resource.resource_name}
              </h2>
              {resource.category && (
                <p className="text-[hsl(92_45%_34%)] text-sm mt-1">{resource.category}</p>
              )}
            </div>
          </div>

          {resource.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs tracking-[0.1em] uppercase text-accent bg-accent/10 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {locationText && (
            <div className="flex items-start gap-3 text-foreground/70 mb-8">
              <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                {locationCount > 1 && (
                  <p className="text-foreground/50 text-xs uppercase tracking-[0.1em] mb-1">
                    Serves {locationCount} locations
                  </p>
                )}
                <p>{locationText}</p>
              </div>
            </div>
          )}

          <div className="h-[0.5px] bg-border mb-6" />

          {(resource.phone || resource.email) && (
            <div className="flex gap-3 mb-3">
              {resource.phone && (
                <button
                  onClick={() => {
                    if (phoneRevealed) {
                      window.location.href = `tel:${resource.phone}`;
                    } else {
                      setPhoneRevealed(true);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-3.5 text-sm tracking-[0.05em] uppercase active:scale-95 transition-all duration-150 hover:bg-primary"
                >
                  <Phone size={14} />
                  {phoneRevealed ? resource.phone : "Call Resource"}
                </button>
              )}
              {resource.email && (
                <button
                  type="button"
                  onClick={async () => {
                    await copyToClipboard(resource.email);
                    toast({ title: "Email copied to clipboard", description: resource.email });
                  }}
                  className="flex-1 flex items-center justify-center gap-2 border border-foreground text-foreground py-3.5 text-sm tracking-[0.05em] uppercase active:scale-95 transition-all duration-150 hover:bg-foreground hover:text-background"
                >
                  <Mail size={14} />
                  Copy Email
                </button>
              )}
            </div>
          )}

          {resource.link ? (
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 text-sm tracking-[0.05em] uppercase active:scale-95 transition-all duration-150 hover:bg-foreground"
            >
              <ExternalLink size={14} />
              Visit Resource
            </a>
          ) : (
            <p className="text-foreground/50 text-sm text-center py-3.5">No link available</p>
          )}
        </div>
      </div>
    </div>
  );
}
