// Events module types
import { BaseEntity } from "@/shared/types";

export interface Event extends BaseEntity {
  startDate: Date;
  endDate?: Date;
  venue: string;
  venueAddress: string;
  category: EventCategory;
  price?: {
    min: number;
    max: number;
    currency: string;
  };
  ticketUrl?: string;
  capacity?: number;
  organizer: string;
  tags: string[];
  isFree: boolean;
  isRecurring: boolean;
  eventOnId?: string; // Reference to EventON plugin ID
}

export type EventCategory = 
  | "music"
  | "food"
  | "art"
  | "culture"
  | "sports"
  | "business"
  | "nightlife"
  | "shopping"
  | "wellness"
  | "education"
  | "family";

export interface EventFilters {
  category?: EventCategory[];
  date?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  location?: string;
  isFree?: boolean;
  tags?: string[];
}

export interface EventOnApiResponse {
  events: EventOnEvent[];
  count: number;
}

export interface EventOnEvent {
  event_id: string;
  event_name: string;
  event_start_date: string;
  event_end_date: string;
  event_start_time: string;
  event_end_time: string;
  event_description: string;
  event_location: string;
  event_organizer: string;
  event_cost: string;
  featured_image_url?: string;
}