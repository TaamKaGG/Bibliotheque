import type { Item } from "./item";

export interface Book extends Item {
  isbn?: string;
  title?: string;
  description?: string;
  publicationDate?: string;
  reviews?: any;
  author?: string;
  categories?: any;
}
