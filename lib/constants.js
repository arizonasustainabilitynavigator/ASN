export const WASTE_TYPES = ["Electricity", "Water", "Waste", "Recycling", "Transportation", "Food", "Paper", "Chemicals", "Rebates", "Grants", "Climate", "Conservation", "Community", "Knowledge"];

// Filters for the curated resource directory, matched against the
// `category` column (which holds ~80 raw spreadsheet tab names) via keyword
// search rather than an exact match, so one filter can cover several
// related tabs at once. Covers every imported spreadsheet tab except two
// generic catch-all sheets ("More resources", "Resources by category
// questions") that don't fit a specific topic — those are still reachable
// via the free-text search box.
// Each filter also lists which business waste-type tags it's actually
// related to (relatedWasteTypes), so selecting a curated category also
// shows businesses whose own waste_types tags overlap with it, instead of
// hiding every business outright. Categories with no real waste-type
// equivalent (Policy & Advocacy, Youth & Education, etc.) just show no
// businesses — that's correct, not a bug.
export const CURATED_RESOURCE_FILTERS = [
  { label: "Rebates & Incentives", keywords: ["rebate", "incentive"], relatedWasteTypes: ["Rebates"] },
  { label: "Financing & Grants", keywords: ["financ", "grant", "tax credit", "bank"], relatedWasteTypes: ["Grants"] },
  { label: "Energy & Solar", keywords: ["energy", "solar", "renewable", "led"], relatedWasteTypes: ["Electricity"] },
  { label: "Heating & Cooling", keywords: ["heat", "cooling", "hvac", "weatheriz"], relatedWasteTypes: ["Electricity"] },
  { label: "Water", keywords: ["water", "rainwater"], relatedWasteTypes: ["Water"] },
  { label: "Recycling & Waste", keywords: ["recycl", "waste", "compost"], relatedWasteTypes: ["Recycling", "Waste"] },
  { label: "EV & Transportation", keywords: ["ev charg", "transport", "fleet"], relatedWasteTypes: ["Transportation"] },
  { label: "Climate & Emergency", keywords: ["climate", "emergency", "resilience", "carbon"], relatedWasteTypes: ["Climate"] },
  { label: "Air Quality & Pollution", keywords: ["air quality", "pollut", "emission"], relatedWasteTypes: ["Chemicals"] },
  { label: "Food & Agriculture", keywords: ["food", "agricultur"], relatedWasteTypes: ["Food"] },
  { label: "Green Building & Construction", keywords: ["green building", "building", "construction", "envelope", "maintenance"], relatedWasteTypes: [] },
  { label: "Land & Wildlife Conservation", keywords: ["land conservation", "habitat", "wildlife", "biodiversity", "forestry"], relatedWasteTypes: ["Conservation"] },
  { label: "Environmental Health & Justice", keywords: ["environmental health", "environmental justice"], relatedWasteTypes: ["Chemicals"] },
  { label: "Circular Economy & Materials", keywords: ["circular economy", "materials"], relatedWasteTypes: ["Recycling"] },
  { label: "Policy & Advocacy", keywords: ["policy", "advocacy", "government"], relatedWasteTypes: [] },
  { label: "Workforce & Green Jobs", keywords: ["workforce", "green job", "employee", "training", "wellness"], relatedWasteTypes: [] },
  { label: "Business & Sustainability Programs", keywords: ["business", "corporat", "purchasing", "packaging", "supply", "certification", "marketing", "customer", "technical assistance", "operational", "reduction categor", "organization type", "facility type", "industry", "office", "paperless", "cost"], relatedWasteTypes: [] },
  { label: "Events & Community", keywords: ["event", "community", "club", "hyper local"], relatedWasteTypes: ["Community"] },
  { label: "Youth & Education", keywords: ["youth", "school", "knowledge"], relatedWasteTypes: ["Community", "Knowledge"] },
];

// Maps each business waste-type tag to keywords matched against a curated
// resource's category, so the same "All Waste Types" filter (and matching
// badges) work for curated resources too, not just self-submitted
// businesses. A resource can match more than one waste type.
export const WASTE_TYPE_KEYWORDS = {
  Electricity: ["energy", "electric", "solar", "renewable", "led", "power"],
  Water: ["water", "rainwater"],
  Waste: ["waste", "disposal"],
  Recycling: ["recycl", "compost", "circular economy", "materials"],
  Transportation: ["transport", "ev charg", "fleet", "mobility"],
  Food: ["food", "agricultur"],
  Paper: ["paper"],
  Chemicals: ["chemical", "hazardous", "pollut", "air quality", "emission"],
  Rebates: ["rebate", "incentive"],
  Grants: ["grant", "financ", "tax credit"],
  Climate: ["climate", "emergency", "resilience", "heat relief", "disaster"],
  Conservation: ["conservation", "wildlife", "habitat", "biodiversity", "forestry"],
  Community: ["community", "event", "workshop", "youth", "club"],
  Knowledge: ["knowledge", "education", "learn", "guide", "how to"],
};
