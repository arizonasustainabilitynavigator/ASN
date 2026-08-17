export const ORG_COUNTY_OPTIONS = [
"Apache County",
"Cochise County",
"Coconino County",
"Gila County",
"Graham County",
"Greenlee County",
"La Paz County",
"Maricopa County",
"Mohave County",
"Navajo County",
"Pima County",
"Pinal County",
"Santa Cruz County",
"Yavapai County",
"Yuma County",
];

export const ORG_TYPE_OPTIONS = [
  { value: "Individual", label: "Individual" },
  { value: "Small Business", label: "Small Business" },
  { value: "Restaurant/Food Service", label: "Restaurant/Food Service" },
  { value: "Retail Store", label: "Retail Store" },
  { value: "Manufacturing/Industrial", label: "Manufacturing/Industrial" },
  { value: "Professional Services (Office)", label: "Professional Services (Office)" },
  { value: "Nonprofit", label: "Nonprofit" },
  { value: "Government/Public Agency", label: "Government/Public Agency" },
  { value: "Startup/Entrepreneur", label: "Startup/Entrepreneur" },
  { value: "Agricultural/Ranch/Farm", label: "Agricultural/Ranch/Farm" },
  { value: "Home-Based Business", label: "Home-Based Business" },
  { value: "Something else", label: "Other" }
];

export const ORG_CATEGORY_OPTIONS = [
  { value: "food_service", label: "Food Service" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "restaurant", label: "Restaurant/Food Service" },
  { value: "retail", label: "Retail" },
  { value: "office", label: "Office/Professional Services" },
  {value: "construction", label: "Construction/Contracting"},
  {value: "healthcare", label: "Healthcare/Medical"},
  {value: "education", label: "Education/School"},
  {value: "hospitality", label: "Hospitality/Hotel"},
  {value: "agriculture", label: "Agriculture/Farm/Ranch"},

]

export const EMPLOYEE_COUNT_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "500+"];

export const ORG_LOCATION_OPTIONS = [
  { value: "urban", label: "Urban" },
  { value: "suburban", label: "Suburban" },
  { value: "rural", label: "Rural" },
  { value: "tribal_community", label: "Tribal Community" },
  {value: "Multiple", label: "Multiple Locations"},
  {value: "home_based", label: "Home-Based Business"},
]

export const ORG_FACILITY_TYPE_OPTIONS = [
  {value: "I own my building", label: "I own my building"},
  {value: "I rent/lease my building", label: "I rent/lease my building"},
  {value: "I operate out of a shared space", label: "I operate out of a shared space"},
  {value: "I work from home", label: "I operate out of a home-based business"},
  {value: "I operate in multiple locations", label: "I operate in multiple locations"},
  {value: "I don't have a physical location", label: "I don't have a physical location"},
]

export const ORG_OPERATIONS_OPTIONS = [
  {value: "customers visit our location", label: "Customers visit our location"},
  {value: "food preparation", label: "Food preparation on-site"},
  {value: "Retail sales", label: "Retail sales on-site"},
  {value: "manufacturing or production", label: "Manufacturing or production on-site"},
  {value: "office work", label: "Office work on-site"},
  {value: "delivery services", label: "Delivery services on-site"},
  {value: "Warehousing", label: "Warehousing on-site"},
  {value: "Outdoor operations", label: "Outdoor operations on-site"},
  {value: "Customer-facing services", label: "Customer-facing services on-site"},
  {value: "We ship products", label: "We ship products"},
  {value: "We have company vehicles", label: "We have company vehicles"},
  {value: "We operate remotely", label: "We operate remotely"},
  {value: "We attend community events", label: "We attend community events"},
]

export const ORG_RESOURCES_USED_OPTIONS = [
  {value: "Electricity", label: "Electricity"},
  {value: "Natural Gas", label: "Natural Gas"},
  {value: "Water", label: "Water"},
  {value: "Fuel", label: "Fuel"},
  {value: "Packaging", label: "Packaging"},
  {value: "Raw Materials", label: "Raw Materials"},
  {value: "Refrigeration/freezers", label: "Refrigeration/freezers"},
  {value: "Office Supplies", label: "Office Supplies"},
  {value: "Digital technology", label: "Digital technology"},
]

export const ORG_RESOURCES_TO_REDUCE_OPTIONS = [
  {value: "Electricity", label: "Electricity"},
  {value: "Waste disposal", label: "Waste disposal"},
  {value: "Water", label: "Water"},
  {value: "Fuel/Transportation", label: "Fuel/Transportation"},
  {value: "Supply costs", label: "Supply costs"},
  {value: "Packaging costs", label: "Packaging costs"},
  {value: "Building maintenance", label: "Building maintenance"},
  {value: "Employee costs", label: "Employee costs"}, 
  {value: "none", label: "Not sure"},
]

export const ORG_SUSTAINABILITY_TOPICS_OPTIONS = [
  {value: "Energy efficiency", label: "Energy efficiency"},
  {value: "Waste reduction & recycling", label: "Waste reduction & recycling"},
  {value: "Water conservation", label: "Water conservation"},
  {value: "Pollution prevention", label: "Pollution prevention"},
  {value: "Sustainable purchasing", label: "Sustainable purchasing"},
  {value: "Transportation/Fleet", label: "Transportation/Fleet"},
  {value: "Green buildings & facilities", label: "Green buildings & facilities"},
  {value: "Employee wellness", label: "Employee wellness"},
  {value: "Community engagement", label: "Community engagement"},
  {value: "Carbon emissions reduction", label: "Carbon emissions reduction"},
  {value: "none", label: "I don't know where to start"},
]

export const ORG_COMPLETED_PRACTICES_OPTIONS = [
  {value: "LED lighting or energy-efficient equipment", label: "LED lighting or energy-efficient equipment"},
  {value: "Water saving fixtures", label: "Water saving fixtures"},
  {value: "Recycling or composting", label: "Recycling or composting"},
  {value: "Paperless office practices", label: "Paperless office practices"},
  {value: "Sustainable purchasing", label: "Sustainable purchasing"},
  {value: "Employee sustainability training", label: "Employee sustainability training"},
  {value: "Solar or renewable energy", label: "Solar or renewable energy"},
  {value: "EV charging or alternative transportation", label: "EV charging or alternative transportation"},
]

export const ORG_COMPLETED_ASSESSMENTS_OPTIONS = [
  {value: "Energy audit", label: "Energy audit"},
  {value: "Waste audit", label: "Waste audit"},
  {value: "Water audit", label: "Water audit"},
  {value: "Carbon footprint assessment", label: "Carbon footprint assessment"},
  {value: "Sustainability training", label: "Sustainability training"},
  {value: "Green Certification", label: "Green Certification"},
]

export const ORG_EXPEREIENCE_LEVEL_OPTIONS = [
  {value: "We've never explored sustainability", label: "We've never explored sustainability"},
  {value: "We've made a few small improvements", label: "We've made a few small improvements"},
  {value: "We have an ongoing sustainability plan", label: "We have an ongoing sustainability plan"},
  {value: "We actively measure our environmental impact", label: "We actively measure our environmental impact"},
  {value: "We are already certified", label: "We are already certified"},
]

export const ORG_OBSTACLES_OPTIONS = [
  {value: "Limited budget", label: "Limited budget"},
  {value: "Lack of staff", label: "Lack of staff"},
  {value: "Lack of information", label: "Lack of information"},
  {value: "Lack of time", label: "Lack of time"},
  {value: "We rent our building", label: "We rent our building"},
  {value: "Unsure where to begin", label: "Unsure where to begin"},
  {value: "Lack of leadership support", label: "Lack of leadership support"},
  {value: "Difficulty finding grants or incentives", label: "Difficulty finding grants or incentives"},
  {value: "Sustainability is not a priority right now", label: "Sustainability is not a priority right now"},
]

export const ORG_SUPPORT_NEEDED_OPTIONS = [
  {value: "Cost-saving recommendations", label: "Cost-saving recommendations"},
  {value: "Step-by-step action plan", label: "Step-by-step action plan"},
  {value: "Energy audit", label: "Energy audit"},
  {value: "Waste audit", label: "Waste audit"},
  {value: "Water audit", label: "Water audit"},
  {value: "One-on-one technical assistance", label: "One-on-one technical assistance"},
  {value: "Workshops or training", label: "Workshops or training"},
]

export const ORG_INSENTIVES_DESIRED_OPTIONS = [
  {value: "Grants", label: "Grants"},
  {value: "Rebates", label: "Rebates"},
  {value: "Tax credits", label: "Tax credits"},
  {value: "Utility programs", label: "Utility programs"},
  {value: "Marketing recognition", label: "Marketing recognition"},
  {value: "Sustainability certification", label: "Sustainability certification"},
  {value: "Customer demand", label: "Customer demand"},
]

export const ORG_PLAN_FORMAT_OPTIONS = [
  {value: "Cheapest first", label: "Cheapest first"},
  {value: "biggest cost savings first", label: "Biggest cost savings first"},
  {value: "quickest to implement first", label: "Quickest to implement first"},
  {value: "Largest environmental impact first", label: "Largest environmental impact first"},
  {value: "step-by-step beginner guide", label: "Step-by-step beginner guide"},
  {value: "Recommendations specific to my industry", label: "Recommendations specific to my industry"},
  {value: "Recommendations specific to my location", label: "Recommendations specific to my location"},
  {value: "Projects with the fastest ROI", label: "Projects with the fastest ROI"},
  {value: "Long-term investments", label: "Long-term investments"},
  {value: "Grant-funded projects", label: "Grant-funded projects"},
]


export const STEP_RECOMMENDATIONS = {
  recycling: [
    {
      title: "Optimize your recycling stream",
      description: "Connect with verified recyclers in the directory to make sure your materials are sorted and processed correctly.",
    },
    {
      title: "Track your diversion rate",
      description: "Use a waste audit to see how much you're actually diverting from landfill and where you can improve.",
    },
  ],
  composting: [
    {
      title: "Scale up organic waste collection",
      description: "Browse composting partners who can handle larger volumes as your program grows.",
    },
    {
      title: "Reduce contamination",
      description: "Train staff on what belongs in the compost stream to keep pickup costs down.",
    },
  ],
  energy: [
    {
      title: "Get an energy audit",
      description: "Identify the highest-impact upgrades for your facility before investing in new equipment.",
    },
    {
      title: "Explore incentive programs",
      description: "Arizona utilities offer rebates for efficiency upgrades — check what your business qualifies for.",
    },
  ],
  sourcing: [
    {
      title: "Vet your supply chain",
      description: "Look for verified partners with transparent sourcing practices in the resource directory.",
    },
    {
      title: "Set sourcing benchmarks",
      description: "Define what 'sustainable' means for your purchasing decisions and track progress over time.",
    },
  ],
  waste_audit: [
    {
      title: "Turn your audit into a plan",
      description: "Use your waste audit results to prioritize the highest-impact changes first.",
    },
    {
      title: "Find the right partners",
      description: "Match your waste streams to verified haulers and recyclers who handle your specific materials.",
    },
  ],
  other: [
    {
      title: "Start with a waste audit",
      description: "Understanding what you're throwing away is the fastest way to find your next sustainability win.",
    },
    {
      title: "Browse the resource directory",
      description: "Explore verified waste management partners across Arizona to find the right fit for your business.",
    },
  ],
};

// Maps a sustainability topic/incentive answer onto a label from
// CURATED_RESOURCE_FILTERS (src/lib/constants.js) - the exact same list
// used by the Resource tab's category dropdown. This is the single source
// of truth for "what's their top priority": it drives both which real
// resources get shown on the quiz results page and which filter gets
// pre-applied when they land on the Resource tab, so the two can never
// disagree with each other the way the old guidance-text system could.
const TOPIC_TO_FILTER_LABEL = {
  "Energy efficiency": "Energy & Solar",
  "Waste reduction & recycling": "Recycling & Waste",
  "Water conservation": "Water",
  "Pollution prevention": "Air Quality & Pollution",
  "Sustainable purchasing": "Circular Economy & Materials",
  "Transportation/Fleet": "EV & Transportation",
  "Green buildings & facilities": "Green Building & Construction",
  "Employee wellness": "Workforce & Green Jobs",
  "Community engagement": "Events & Community",
  "Carbon emissions reduction": "Climate & Emergency",
};

const INCENTIVE_TO_FILTER_LABEL = {
  Grants: "Financing & Grants",
  Rebates: "Rebates & Incentives",
  "Tax credits": "Rebates & Incentives",
};

// Picks the single most important resource category: the first
// sustainability topic they selected (selection order = priority) that
// maps to a real filter, falling back to their first desired incentive.
// Returns null if nothing maps (e.g. they picked "I don't know where to
// start" and no incentives) - callers should fall back to generic
// guidance in that case.
export function getTopPriorityFilterLabel(answers) {
  for (const topic of answers.orgSustainabilityTopics || []) {
    if (TOPIC_TO_FILTER_LABEL[topic]) return TOPIC_TO_FILTER_LABEL[topic];
  }
  for (const incentive of answers.orgInsentivesDesired || []) {
    if (INCENTIVE_TO_FILTER_LABEL[incentive]) return INCENTIVE_TO_FILTER_LABEL[incentive];
  }
  return null;
}
