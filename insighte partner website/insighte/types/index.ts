export type ProviderCategory = "PARTNER" | "INDEPENDENT" | "ROYALE";
export type ProviderApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
export type BookingStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";
export type SessionMode = "ONLINE" | "OFFLINE" | "HYBRID";
export type UserRole = "PARENT" | "PROVIDER" | "ADMIN";

export interface Provider {
  id: string;
  slug: string;
  name: string;
  avatar_url: string | null;
  category: string;
  approval_status: ProviderApprovalStatus;
  tagline: string | null;
  bio: string | null;
  // Services as simple string array (categories/names)
  services: string[];
  // Detailed specializations (e.g. ["Speech Delay", "Stuttering"])
  specializations: string[];
  experience_years: number;
  location: string;
  city: string | null;
  mode: string | null;
  rating: number;
  review_count: number;
  first_session_price: number;
  session_modes: SessionMode[];
  languages: string[];
  age_groups: string[];
  booking_count: number;
  is_featured: boolean;
  created_at: string;
}

export interface Child {
  id: string;
  parent_id: string;
  name: string;
  date_of_birth: string;
  special_needs_tags: string[];
  notes: string | null;
}

export interface Booking {
  id: string;
  parent_id: string;
  provider_id: string;
  child_id: string;
  service: string;
  session_mode: SessionMode;
  scheduled_at: string;
  status: BookingStatus;
  amount: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  provider?: Provider;
  child?: Child;
}

export interface SessionNote {
  id: string;
  booking_id: string;
  provider_id: string;
  content: string;
  is_private: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  parent_id: string;
  provider_id: string;
  rating: number;
  content: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}
