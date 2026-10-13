import { useState, useEffect } from "react";
import { getAllCounties, getCountiesForZip } from "@/utils/countyLookup";

// County picker, auto-selected from a zip code when it uniquely matches one
export default function CountyDropdown({ zip, value, onChange }) {
  const [allCounties, setAllCounties] = useState([]);

  // Load the full county list once on mount
  useEffect(() => {
    getAllCounties().then(setAllCounties);
  }, []);

  // Auto-select the county when the zip matches exactly one
  useEffect(() => {
    if (!zip || zip.length < 5) return;

    let active = true;
    getCountiesForZip(zip).then((matches) => {
      if (!active) return;
      if (matches.length === 1) {
        onChange?.(`${matches[0]} County`);
      }
    });

    return () => {
      active = false;
    };
  }, [zip]);

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-card border border-border px-4 py-3.5 text-foreground focus:border-primary focus:outline-none transition-colors"
    >
      <option value="" disabled>
        Select your county
      </option>
      {allCounties.map((county) => (
        <option key={county} value={`${county} County`}>
          {county} County
        </option>
      ))}
    </select>
  );
}