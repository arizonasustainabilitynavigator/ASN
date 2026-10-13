import React, { useState, useEffect } from "react";
import { api } from "@/api/client";
import { Plus, X, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventDetailPanel from "@/components/EventDetailPanel";
import EventsCalendar from "@/components/EventsCalendar";
import AddEventModal, { CATEGORIES } from "@/components/AddEventModal";
import { cn } from "@/lib/utils";
import { WASTE_TYPES } from "@/lib/constants";

const PAGE_SIZE = 6;

// Events calendar/listing page
export default function Events() {
  // State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [wasteTypeFilter, setWasteTypeFilter] = useState("all");
  const [onlyMine, setOnlyMine] = useState(false);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  // Data loading
  const loadEvents = async () => {
    try {
      const [userEvents, curatedEvents] = await Promise.all([
        api.entities.Event.list(),
        api.entities.CuratedEvent.list(),
      ]);
      const merged = [
        ...userEvents,
        // Normalize curated events' `email` field to `contact_email`
        ...curatedEvents.map((e) => ({ ...e, contact_email: e.email, is_curated: true })),
      ].sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(merged);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handlePostEventClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowAddEvent(true);
  };

  const handleEventCreated = () => {
    setShowAddEvent(false);
    setEditingEvent(null);
    loadEvents();
  };

  const handleEventDeleted = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleEditClick = (event) => {
    setSelectedEvent(null);
    setEditingEvent(event);
  };

  // Filtering
  const hasActiveFilters = categoryFilter !== "all" || wasteTypeFilter !== "all" || onlyMine || !!selectedDate;

  const clearFilters = () => {
    setCategoryFilter("all");
    setWasteTypeFilter("all");
    setOnlyMine(false);
    setSelectedDate(undefined);
  };

  const filteredEvents = events.filter((e) => {
    if (selectedDate && !moment(e.date).isSame(selectedDate, "day")) return false;
    if (categoryFilter !== "all" && !e.categories?.includes(categoryFilter)) return false;
    if (wasteTypeFilter !== "all" && !e.waste_types?.includes(wasteTypeFilter)) return false;
    if (onlyMine && e.created_by !== user?.id) return false;
    return true;
  });

  useEffect(() => {
    setPage(1);
  }, [selectedDate, categoryFilter, wasteTypeFilter, onlyMine]);

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const eventsOnPage = filteredEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (n) => {
    setPage(Math.min(Math.max(1, n), totalPages));
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const n = parseInt(pageInput, 10);
    if (!isNaN(n)) goToPage(n);
    else setPageInput(String(page));
  };

  // Category badge colors
  const categoryColors = {
    workshop: "bg-primary/10 text-primary",
    networking: "bg-accent/10 text-accent",
    conference: "bg-foreground/10 text-foreground",
    cleanup: "bg-accent/10 text-accent",
    webinar: "bg-primary/10 text-primary"
  };

  // Render
  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />

      <div className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">The Horizon Calendar</p>
            <h1 className="font-heading text-4xl md:text-6xl text-foreground leading-tight mb-4">
              Sustainability Events
            </h1>
            <p className="text-foreground/70 text-lg max-w-xl">
              Workshops, networking, and community events driving Arizona's green economy forward.
            </p>
          </div>
          <button
            onClick={handlePostEventClick}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors self-start"
          >
            <Plus size={16} /> Post Event
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="h-[0.5px] bg-border mb-8" />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <EventsCalendar events={events} selectedDate={selectedDate} onSelectDate={setSelectedDate} />

          <div className="flex-1 w-full">
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-xs tracking-[0.15em] uppercase text-foreground/70">Filter</span>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-border bg-background px-3 py-1.5 text-xs tracking-[0.1em] uppercase text-foreground/70 focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  value={wasteTypeFilter}
                  onChange={(e) => setWasteTypeFilter(e.target.value)}
                  className="border border-border bg-background px-3 py-1.5 text-xs tracking-[0.1em] uppercase text-foreground/70 focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="all">All Waste Types</option>
                  {WASTE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs tracking-[0.1em] uppercase text-foreground/50 hover:text-primary transition-colors"
                  >
                    <X size={12} />
                    Clear
                  </button>
                )}

                {isAuthenticated && (
                  <button
                    onClick={() => setOnlyMine((v) => !v)}
                    className={cn(
                      "px-3 py-1.5 text-xs tracking-[0.1em] uppercase border transition-colors ml-auto",
                      onlyMine
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-foreground/70 hover:border-primary hover:text-primary"
                    )}
                  >
                    Your Events
                  </button>
                )}
              </div>

            {events.length === 0 ? (
              <div className="text-center py-24 w-full">
                <p className="text-foreground/70 text-lg mb-2">No upcoming events</p>
                <p className="text-foreground/70 text-sm">
                  Check back soon for sustainability events across Arizona.
                </p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-24 w-full">
                <p className="text-foreground/70 text-lg mb-2">No events match your filters</p>
                <p className="text-foreground/70 text-sm">
                  Try a different date, tag, waste type, or clearing "Your Events".
                </p>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventsOnPage.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="border border-border hover:border-primary/30 transition-colors bg-card text-left flex flex-col"
                  >
                    {/* Date pillar top */}
                    <div className="p-6 border-b border-border">
                      <span className="font-heading text-3xl text-primary block">
                        {moment(event.date).format("DD")}
                      </span>
                      <span className="text-xs tracking-[0.15em] uppercase text-foreground/70">
                        {moment(event.date).format("MMM YYYY")}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-heading text-lg text-foreground mb-1 line-clamp-2">{event.title}</h3>

                      {event.organization && (
                        <div className="flex items-center gap-1.5 text-foreground/60 text-xs mb-3">
                          <Building2 size={12} />
                          <span>{event.organization}</span>
                        </div>
                      )}

                      {event.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {event.categories.map((c) => (
                            <span
                              key={c}
                              className={`inline-block text-xs tracking-[0.1em] uppercase px-2 py-0.5 ${categoryColors[c] || "bg-border text-foreground"}`}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}

                      {event.waste_types?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {event.waste_types.map((type) => (
                            <span
                              key={type}
                              className="inline-block text-[10px] tracking-[0.05em] uppercase px-1.5 py-0.5 border border-border text-foreground/60"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      )}

                      {event.location && (
                        <p className="text-foreground/70 text-sm mt-auto">{event.location}</p>
                      )}
                    </div>

                    {/* Join button */}
                    <div className="p-6 pt-0">
                      <span className="block text-center bg-foreground text-background py-2.5 text-xs tracking-[0.1em] uppercase hover:bg-primary transition-colors">
                        View Details
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {filteredEvents.length > PAGE_SIZE && (
              <div className="flex items-center justify-center gap-4 mt-10">
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
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDeleted={handleEventDeleted}
          onEdit={handleEditClick}
        />
      )}

      {(showAddEvent || editingEvent) && (
        <AddEventModal
          event={editingEvent}
          onClose={() => {
            setShowAddEvent(false);
            setEditingEvent(null);
          }}
          onCreated={handleEventCreated}
        />
      )}
    </div>
  );
}