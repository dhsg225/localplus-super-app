// Shared constants for LocalPlus Super App

export const LOCATIONS = {
  cities: [
    { id: "pattaya", name: "Pattaya", slug: "pattaya" },
    { id: "hua-hin", name: "Hua Hin", slug: "hua-hin" },
    { id: "krabi", name: "Krabi", slug: "krabi" },
    { id: "samui", name: "Koh Samui", slug: "samui" },
    { id: "bangkok", name: "Bangkok", slug: "bangkok" },
  ],
  bangkokDistricts: [
    { id: "thonglor", name: "Thonglor", slug: "thonglor" },
    { id: "phrom-phong", name: "Phrom Phong", slug: "phrom-phong" },
    { id: "ekkamai", name: "Ekkamai", slug: "ekkamai" },
    { id: "on-nut", name: "On Nut", slug: "on-nut" },
    { id: "riverside", name: "Riverside", slug: "riverside" },
    { id: "nana", name: "Nana", slug: "nana" },
  ],
} as const;

export const CUISINE_TYPES = [
  // Tier 1 - Essential
  "Thai Traditional", "Fresh Seafood", "Street Food", "Chinese-Thai", "International",
  
  // Tier 2 - Important  
  "Indian", "Japanese", "Italian", "Fusion", "BBQ & Grill",
  
  // Tier 3 - Growing Market
  "Korean", "Vietnamese", "Halal", "Vegetarian/Vegan", "Cafe & Coffee",
  
  // Legacy compatibility
  "Thai", "Chinese", "Mediterranean", "American", "French", "Mexican", "Seafood", "BBQ", "Vegetarian", "Vegan"
] as const;

export const PRICE_RANGES = {
  budget: { min: 0, max: 300, label: "Budget (฿)" },
  "mid-range": { min: 301, max: 800, label: "Mid-range (฿฿)" },
  upscale: { min: 801, max: 1500, label: "Upscale (฿฿฿)" },
  "fine-dining": { min: 1501, max: 5000, label: "Fine Dining (฿฿฿฿)" },
} as const;

export const EVENT_CATEGORIES = [
  "music", "food", "art", "culture", "sports", "business",
  "nightlife", "shopping", "wellness", "education", "family"
] as const;

export const SERVICE_CATEGORIES = [
  "home-maintenance", "cleaning", "beauty-wellness", "automotive",
  "technology", "health-medical", "education", "legal-finance",
  "delivery", "repair", "installation"
] as const;

export const CONTACT_METHODS = {
  phone: { icon: "Phone", label: "Call", prefix: "tel:" },
  whatsapp: { icon: "MessageCircle", label: "WhatsApp", prefix: "https://wa.me/" },
  line: { icon: "MessageSquare", label: "Line", prefix: "https://line.me/ti/p/" },
  website: { icon: "Globe", label: "Website", prefix: "https://" },
  facebook: { icon: "Facebook", label: "Facebook", prefix: "https://facebook.com/" },
} as const;