import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { useToast } from "@/components/ui/use-toast";

export default function ResourceCard({ business, onClick }) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const requireAuth = (action) => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    action();
  };

  return (
    <div
      onClick={() => requireAuth(onClick)}
      className="h-full flex flex-col border border-border p-6 hover:border-primary/30 transition-colors bg-card cursor-pointer"
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center overflow-hidden flex-shrink-0 bg-background">
          {business.logo_url ? (
            <img
              src={business.logo_url}
              alt={`${business.business_name} logo`}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="font-heading text-primary text-lg font-bold">
              {business.business_name?.charAt(0) || "B"}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-heading text-lg text-foreground font-semibold truncate">
            {business.business_name}
          </h3>
          {business.tagline && (
            <p className="text-[hsl(92_45%_34%)] text-sm mt-0.5 line-clamp-2">{business.tagline}</p>
          )}
        </div>
      </div>

      {business.waste_types?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {business.waste_types.map((type) => (
            <span
              key={type}
              className="text-xs tracking-[0.1em] uppercase text-accent bg-accent/10 px-2.5 py-1"
            >
              {type}
            </span>
          ))}
        </div>
      )}

      {(business.zip_code || business.location_type === "online") && (
        <div className="flex items-center gap-2 text-foreground/70 text-sm mb-5">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="truncate">
            {business.location_type === "online"
              ? "Online / Virtual Service"
              : [business.address, business.city, business.zip_code].filter(Boolean).join(", ")}
          </span>
        </div>
      )}

      <div className="mt-auto">
        <div className="h-[0.5px] bg-border mb-5" />

        <div className="flex gap-2">
          {business.phone && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isAuthenticated) {
                  navigate("/register");
                  return;
                }
                if (phoneRevealed) {
                  window.location.href = `tel:${business.phone}`;
                } else {
                  setPhoneRevealed(true);
                }
              }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-foreground text-background px-3 py-2.5 text-sm tracking-[0.03em] uppercase active:scale-95 transition-all duration-150 hover:bg-primary whitespace-nowrap"
            >
              <Phone size={13} className="flex-shrink-0" />
              <span className="truncate">{phoneRevealed ? business.phone : "Call"}</span>
            </button>
          )}
          {business.email && (
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                if (!isAuthenticated) {
                  navigate("/register");
                  return;
                }
                await copyToClipboard(business.email);
                toast({ title: "Email copied to clipboard", description: business.email });
              }}
              className="flex-1 flex items-center justify-center gap-1.5 border border-foreground text-foreground px-3 py-2.5 text-sm tracking-[0.03em] uppercase active:scale-95 transition-all duration-150 hover:bg-foreground hover:text-background whitespace-nowrap"
            >
              <Mail size={13} className="flex-shrink-0" />
              Email
            </button>
          )}
        </div>

        {business.website && (
          <a
            href={isAuthenticated ? business.website : undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              if (!isAuthenticated) {
                e.preventDefault();
                navigate("/register");
              }
            }}
            className="flex items-center justify-center gap-1.5 mt-2 bg-primary text-primary-foreground px-3 py-2.5 text-sm tracking-[0.03em] uppercase active:scale-95 transition-all duration-150 hover:bg-foreground"
          >
            <Globe size={13} />
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
}
