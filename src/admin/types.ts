import { PSDTemplate } from '../types';

// Admin-extended product type
export interface AdminProduct extends PSDTemplate {
  price?: number;
  tags?: string[];
  psd_url?: string;
  downloads_count?: number;
  likes_count?: number;
  created_at?: string;
  published?: boolean;
}

export interface AdminClient {
  id: string;
  name: string;
  email: string;
  downloads_count: number;
  products_downloaded: string[];
  created_at: string;
}

export interface DownloadRecord {
  id: string;
  product_id: string;
  product_title: string;
  timestamp: string;
}

export interface DashboardStats {
  total_products: number;
  total_downloads: number;
  total_visits: number;
  total_clients: number;
  total_likes: number;
  top_products: { title: string; downloads: number }[];
  recent_products: AdminProduct[];
}
