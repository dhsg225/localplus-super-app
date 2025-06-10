// AI Assistant module types

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  type?: "text" | "card" | "action";
  metadata?: {
    intent?: string;
    entities?: any[];
    suggestions?: string[];
  };
}

export interface AIResponse {
  message: string;
  intent: string;
  entities: AIEntity[];
  suggestions: string[];
  actionCards?: ActionCard[];
}

export interface AIEntity {
  type: "restaurant" | "event" | "service" | "location" | "time" | "price";
  value: string;
  confidence: number;
}

export interface ActionCard {
  id: string;
  type: "restaurant" | "event" | "service";
  title: string;
  description: string;
  imageUrl?: string;
  actionUrl?: string;
  actionType: "view" | "call" | "navigate" | "book";
  metadata: any;
}

export interface ChatSession {
  id: string;
  userId?: string;
  messages: ChatMessage[];
  context: {
    location?: string;
    preferences?: string[];
    lastActivity: Date;
  };
  createdAt: Date;
}

export interface GeminiRequest {
  prompt: string;
  context?: {
    location?: string;
    userPreferences?: string[];
    conversationHistory?: ChatMessage[];
  };
}