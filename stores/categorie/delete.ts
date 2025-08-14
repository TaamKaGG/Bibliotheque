import { defineStore } from "pinia";
import type { Categorie } from "~~/types/categorie";

interface State {
  deleted?: Categorie;
  mercureDeleted?: Categorie;
  isLoading: boolean;
  error?: string;
}

export const useCategorieDeleteStore = defineStore("categorieDelete", {
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

    setDeleted(deleted: Categorie) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Categorie | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
