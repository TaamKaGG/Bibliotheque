import { defineStore } from "pinia";
import type { Book } from "~~/types/book";

interface State {
  deleted?: Book;
  mercureDeleted?: Book;
  isLoading: boolean;
  error?: string;
}

export const useBookDeleteStore = defineStore("bookDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    setDeleted(deleted: Book) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Book | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
