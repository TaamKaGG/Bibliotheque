import { defineStore } from "pinia";
import type { Review } from "~~/types/review";

interface State {
  deleted?: Review;
  mercureDeleted?: Review;
  isLoading: boolean;
  error?: string;
}

export const useReviewDeleteStore = defineStore("reviewDelete", {
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

    setDeleted(deleted: Review) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Review | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
