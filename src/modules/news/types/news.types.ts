export interface NewsPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  author: number;
  featured_media: number;
  categories: number[];
  link: string;
  yoast_head_json?: {
    og_image?: Array<{ url: string; width: number; height: number }>;
    description?: string;
  };
}

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface NewsModuleProps {
  className?: string;
}

export interface LocationMapping {
  [key: string]: string;
} 