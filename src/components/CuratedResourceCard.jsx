import React, { useState } from "react";
import { MapPin, ExternalLink, Phone, Mail } from "lucide-react";
import { formatResourceLocations } from "@/lib/formatResourceLocations";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { useToast } from "@/components/ui/use-toast";

export default function CuratedResourceCard({ resource, onClick }) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const { toast } = useToast();
  const locationText = formatResourceLocations(resource);

  return (
    <div
      onClick={onClick}
      className="h-full flex flex-col border border-border p-6 hover:border-primary/30 transition-colors bg-card cursor-pointer"
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center overflow-hidden flex-shrink-0 bg-background">
          <img
            src={`${import.meta.env.BASE_URL}resource_placeholder.png`}
            alt=""
            className="block w-9 h-9 object-contain"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-heading text-lg text-foreground font-semibold line-clamp-2">
            <span
              className="text-foreground/50 mr-1"
              title="Official resource — provided directly, not a business submission"
            >
              *
            </span>
            {resource.resource_name}
          </h3>
          {resource.category && (
            <p className="text-[hsl(92_45%_34%)] text-sm mt-0.5 line-clamp-2">{resource.category}</p>
          )}
        </div>
      </div>

      {resource.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs tracking-[0.1em] uppercase text-accent bg-accent/10 px-2.5 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {locationText && (
        <div className="flex items-start gap-2 text-foreground/70 text-sm mb-5">
          <MapPin size={14} className="flex-shrink-0 mt-0.5" />
          <span className="line-clamp-3" title={locationText}>{locationText}</span>
        </div>
      )}

      <div className="mt-auto">
        <div className="h-[0.5px] bg-border mb-5" />

        {(resource.phone || resource.email) && (
          <div className="flex gap-2 mb-2">
            {resource.phone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (phoneRevealed) {
                    window.location.href = `tel:${resource.phone}`;
                  } else {
                    setPhoneRevealed(true);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-foreground text-background px-3 py-2.5 text-sm tracking-[0.03em] uppercase active:scale-95 transition-all duration-150 hover:bg-primary whitespace-nowrap"
              >
                <Phone size={13} className="flex-shrink-0" />
                <span className="truncate">{phoneRevealed ? resource.phone : "Call"}</span>
              </button>
            )}
            {resource.email && (
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  await copyToClipboard(resource.email);
                  toast({ title: "Email copied to clipboard", description: resource.email });
                }}
                className="flex-1 flex items-center justify-center gap-1.5 border border-foreground text-foreground px-3 py-2.5 text-sm tracking-[0.03em] uppercase active:scale-95 transition-all duration-150 hover:bg-foreground hover:text-background whitespace-nowrap"
              >
                <Mail size={13} className="flex-shrink-0" />
                Email
              </button>
            )}
          </div>
        )}

        {resource.link ? (
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-3 py-2.5 text-sm tracking-[0.03em] uppercase active:scale-95 transition-all duration-150 hover:bg-foreground whitespace-nowrap"
          >
            <ExternalLink size={13} className="flex-shrink-0" />
            Visit
          </a>
        ) : (
          <p className="text-foreground/50 text-sm text-center py-2.5">No link available</p>
        )}
      </div>
    </div>
  );
}
