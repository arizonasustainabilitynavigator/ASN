import React from "react";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment";

// Calendar with event-day markers, for filtering the events list by date
export default function EventsCalendar({ events, selectedDate, onSelectDate }) {
  const eventDates = events.map((e) => moment(e.date).toDate());

  return (
    <div className="border border-border bg-card p-6 mb-8 inline-block">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        modifiers={{ hasEvent: eventDates }}
        modifiersClassNames={{
          hasEvent: "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
        }}
      />
      {selectedDate && (
        <button
          onClick={() => onSelectDate(undefined)}
          className="mt-2 w-full text-center text-xs tracking-[0.1em] uppercase text-primary hover:underline"
        >
          Clear Date Filter
        </button>
      )}
    </div>
  );
}