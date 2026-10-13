import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

// Collapsible FAQ question/answer item
export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-heading text-lg text-foreground">{question}</span>
        {open ? (
          <Minus size={18} className="text-primary flex-shrink-0" />
        ) : (
          <Plus size={18} className="text-primary flex-shrink-0" />
        )}
      </button>
      {open && (
        <p className="text-foreground/70 text-sm leading-relaxed pb-6 max-w-2xl">{answer}</p>
      )}
    </div>
  );
}