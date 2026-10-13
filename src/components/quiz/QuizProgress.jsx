import React from "react";

// Quiz step progress bar
export default function QuizProgress({ step, total }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 transition-colors ${i <= step ? "bg-primary" : "bg-border"}`}
        />
      ))}
    </div>
  );
}