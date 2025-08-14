import { defineStore } from "pinia";
import { Book } from "~~/types/book";
import type { SubmissionErrors } from "~~/types/error";
import { CreateItemData } from "~~/types/api";

interface State {
  created?: Book;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useBookCreateStore = defineStore("bookCreate", {
  state: (): State => ({
    created: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    setData({ created, isLoading, error, violations }: CreateItemData<Book>) {
      this.setCreated(created.value);
      this.setLoading(isLoading.value);
      this.setViolations(violations.value);

      if (error.value instanceof Error) {
        this.setError(error.value?.message);
      }
    },

    setCreated(created?: Book) {
      this.created = created;
    },

    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    setError(error: string | undefined) {
      this.error = error;
    },

    setViolations(violations: SubmissionErrors | undefined) {
      this.violations = violations;
    },
  },
});
