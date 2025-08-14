import type { Item } from "./item";

export interface Review extends Item {
  rating?: number;
  body?: string;
  created_at?: string;
  book?: any;
  creator?: string;
  createdAt?: string;
}
