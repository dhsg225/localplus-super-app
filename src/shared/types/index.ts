// Core shared types for LocalPlus Super App

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: "city" | "district";
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  preferredLocation?: Location;
  favoriteRestaurants?: string[];
  favoriteEvents?: string[];
  createdAt: Date;
}

export interface BaseEntity {
  id: string;
  name: string;
  description: string;
  location: Location;
  imageUrl?: string;
  contact?: {
    phone?: string;
    website?: string;
    facebook?: string;
    line?: string;
  };
  featured?: boolean;
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}