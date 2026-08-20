import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { X, Phone, Mail, Globe, MapPin } from "lucide-react";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { useToast } from "@/components/ui/use-toast";

export default function ResourceDetailPanel({ business, onClose }) {
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

  const handleOpen = () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    onClose();
  };

  if (!business) return null;

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
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={`${business.business_name} logo`}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="font-heading text-primary text-2xl font-bold">
                  {business.business_name?.charAt(0) || "B"}
                </span>
              )}
            </div>
            <div className="mt-2">
              <h2 className="font-heading text-2xl md:text-3xl text-foreground">{business.business_name}</h2>
              {business.tagline && (
                <p className="text-[hsl(92_45%_34%)] text-sm mt-1">{business.tagline}</p>
              )}
            </div>
          </div>

          {business.description && (
            <p className="text-foreground/80 text-base leading-relaxed mb-8 whitespace-pre-wrap">{business.description}</p>
          )}

          {business.waste_types?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
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
            <div className="flex items-center gap-3 text-foreground/70 mb-8">
              <MapPin size={16} className="text-primary" />
              <span className="text-sm">
                {business.location_type === "online"
                  ? "Online / Virtual Service"
                  : [business.address, business.city, business.zip_code].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          <div className="h-[0.5px] bg-border mb-6" />

          <div className="flex gap-3 mb-3">
            {business.phone && (
              <button
                onClick={() => {
                  requireAuth(() => {
                    if (phoneRevealed) {
                      window.location.href = `tel:${business.phone}`;
                    } else {
                      setPhoneRevealed(true);
                    }
                  });
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-3.5 text-sm tracking-[0.05em] uppercase active:scale-95 transition-all duration-150 hover:bg-primary"
              >
                <Phone size={14} />
                {phoneRevealed ? business.phone : "Call Resource"}
              </button>
            )}
            {business.email && (
              <button
                type="button"
                onClick={() => {
                  requireAuth(async () => {
                    await copyToClipboard(business.email);
                    toast({ title: "Email copied to clipboard", description: business.email });
                  });
                }}
                className="flex-1 flex items-center justify-center gap-2 border border-foreground text-foreground py-3.5 text-sm tracking-[0.05em] uppercase active:scale-95 transition-all duration-150 hover:bg-foreground hover:text-background"
              >
                <Mail size={14} />
                Copy Email
              </button>
            )}
          </div>

          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                requireAuth(() => {
                  window.open(business.website, "_blank", "noopener,noreferrer");
                });
              }}
              className="flex items-center justify-center gap-2 mt-3 bg-primary text-primary-foreground py-3.5 text-sm tracking-[0.05em] uppercase active:scale-95 transition-all duration-150 hover:bg-foreground"
            >
              <Globe size={14} />
              Visit Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
