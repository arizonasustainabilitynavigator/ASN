import React, { useState } from "react";
import { X, MapPin, Clock, Mail, CalendarDays, Trash2, Pencil, Building2, Phone, Globe } from "lucide-react";
import moment from "moment";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/api/client";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { useToast } from "@/components/ui/use-toast";

export default function EventDetailPanel({ event, onClose, onDeleted, onEdit }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [emailRevealed, setEmailRevealed] = useState(false);

  if (!event) return null;

  const isOwner = !!user && user.id === event.created_by;

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${event.title}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await api.entities.Event.delete(event.id);
      onDeleted?.(event.id);
      onClose();
    } catch (err) {
      window.alert(err.message || "Couldn't delete this event.");
      setDeleting(false);
    }
  };

  const handleCopy = async (value) => {
    await copyToClipboard(value);
    toast({ title: `${value} has been copied to clipboard` });
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right">
        <div className="sticky top-0 bg-background z-10 p-6 border-b border-border flex items-center justify-between">
          <span className="text-xs tracking-[0.2em] uppercase text-primary">Event Details</span>
          <button onClick={onClose} className="text-foreground/70 hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        {event.image_url && (
          <img src={event.image_url} alt={event.title} className="w-full aspect-video object-cover" />
        )}

        <div className="p-8">
          {event.categories?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {event.categories.map((c) => (
                <span
                  key={c}
                  className="inline-block text-xs tracking-[0.15em] uppercase text-accent bg-accent/10 px-3 py-1"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          <h2 className={`font-heading text-2xl md:text-3xl text-foreground ${event.is_curated ? "mb-2" : "mb-6"}`}>
            {event.is_curated && (
              <span
                className="text-foreground/50 mr-1"
                title="Added by Arizona Sustainability Navigator"
              >
                *
              </span>
            )}
            {event.title}
          </h2>
          {event.is_curated && (
            <p className="text-foreground/50 text-xs mb-6">* Added by Arizona Sustainability Navigator</p>
          )}

          <div className="space-y-4 mb-8">
            {event.organization && (
              <div className="flex items-center gap-3 text-foreground/70">
                <Building2 size={16} className="text-primary" />
                <span className="text-sm">{event.organization}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-foreground/70">
              <CalendarDays size={16} className="text-primary" />
              <span className="text-sm">{moment(event.date).format("MMMM D, YYYY")}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-3 text-foreground/70">
                <Clock size={16} className="text-primary" />
                <span className="text-sm">{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-3 text-foreground/70">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm">{event.location}</span>
              </div>
            )}
          </div>

          {event.waste_types?.length > 0 && (
            <>
              <div className="h-[0.5px] bg-border mb-6" />
              <span className="text-xs tracking-[0.15em] uppercase text-foreground/70 block mb-3">Waste Types</span>
              <div className="flex flex-wrap gap-2 mb-6">
                {event.waste_types.map((type) => (
                  <span
                    key={type}
                    className="inline-block text-xs tracking-[0.1em] uppercase px-2 py-0.5 border border-border text-foreground/70"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </>
          )}

          {event.description && (
            <>
              <div className="h-[0.5px] bg-border mb-6" />
              <p className="text-foreground/70 text-sm leading-relaxed">{event.description}</p>
            </>
          )}

          {(event.phone || event.contact_email || event.link) && (
            <>
              <div className="h-[0.5px] bg-border my-6" />
              {(event.phone || event.contact_email) && (
                <div className="flex gap-3 mb-3">
                  {event.phone && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneRevealed(true);
                        handleCopy(event.phone);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-3.5 text-sm tracking-[0.05em] uppercase transition-colors hover:bg-primary overflow-hidden"
                    >
                      <Phone size={14} className="flex-shrink-0" />
                      <span className="truncate">{phoneRevealed ? event.phone : "Phone"}</span>
                    </button>
                  )}
                  {event.contact_email && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmailRevealed(true);
                        handleCopy(event.contact_email);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 border border-foreground text-foreground py-3.5 text-sm tracking-[0.05em] uppercase transition-colors hover:bg-foreground hover:text-background overflow-hidden"
                    >
                      <Mail size={14} className="flex-shrink-0" />
                      <span className="truncate">{emailRevealed ? event.contact_email : "Email"}</span>
                    </button>
                  )}
                </div>
              )}
              {event.link && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors w-full"
                >
                  <Globe size={14} />
                  Website
                </a>
              )}
            </>
          )}

          {isOwner && (
            <>
              <div className="h-[0.5px] bg-border my-6" />
              <div className="flex gap-3">
                <button
                  onClick={() => onEdit?.(event)}
                  className="flex-1 flex items-center justify-center gap-2 border border-border text-foreground/70 py-3.5 text-sm tracking-[0.1em] uppercase hover:border-primary hover:text-primary transition-colors"
                >
                  <Pencil size={14} />
                  Edit Event
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 border border-destructive text-destructive py-3.5 text-sm tracking-[0.1em] uppercase hover:bg-destructive/10 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  {deleting ? "Deleting..." : "Delete Event"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}