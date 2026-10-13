import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { MapPin } from "lucide-react";

// Compact business resource card (homepage quick-search results)
export default function ResourceCardMinimal({ business, onClick }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Require sign-in before viewing details
  const handleClick = () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className="border border-border p-6 md:p-8 hover:border-primary/30 transition-colors bg-card cursor-pointer"
    >
      <div className="flex items-start gap-5 mb-5">
        <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center overflow-hidden flex-shrink-0 bg-background">
          {business.logo_url ? (
            <img
              src={business.logo_url}
              alt={`${business.business_name} logo`}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="font-heading text-primary text-xl font-bold">
              {business.business_name?.charAt(0) || "B"}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-heading text-lg text-foreground font-semibold truncate">
            {business.business_name}
          </h3>
          {business.tagline && (
            <p className="text-[hsl(92_45%_34%)] text-sm mt-1 line-clamp-2">{business.tagline}</p>
          )}
        </div>
      </div>

      {business.waste_types?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {business.waste_types.map((type) => (
            <span
              key={type}
              className="text-xs tracking-[0.1em] uppercase text-accent bg-accent/10 px-3 py-1"
            >
              {type}
            </span>
          ))}
        </div>
      )}

      {(business.zip_code || business.location_type === "online") && (
        <div className="flex items-center gap-2 text-foreground/70 text-sm">
          <MapPin size={14} />
          <span>
            {business.location_type === "online"
              ? "Online / Virtual Service"
              : [business.address, business.city, business.zip_code].filter(Boolean).join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}
