export interface User {
  id: string;
  email: string;
  role: 'admin' | 'supplier' | 'pharmacist';
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  features: string[];
}

export interface Supplier {
  id: string;
  company_name: string;
  address: string;
  wilaya: string;
  contact_email: string;
  contact_phone: string;
  description?: string;
  logo_url?: string;
  subscription_id?: string;
  subscription_start?: Date;
  subscription_end?: Date;
  payment_receipt_url?: string;
  is_approved: boolean;
}

export interface Listing {
  id: string;
  supplier_id: string;
  title: string;
  description?: string;
  file_url: string;
  views: number;
  downloads: number;
  created_at: Date;
}

export interface Offer {
  id: string;
  supplier_id: string;
  title: string;
  description: string;
  image_url?: string;
  views: number;
  created_at: Date;
  expires_at: Date;
}

export interface ListingProduct {
  id: string;
  listing_id: string;
  product_name: string;
  quantity?: number;
  price?: number;
}