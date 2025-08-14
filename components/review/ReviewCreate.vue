<template>
  <nuxt-link :to="{ name: 'reviews' }" class="text-blue-600 hover:text-blue-800">
    &lt; Back to list
  </nuxt-link>

  <h1 class="text-3xl my-4">Create Review</h1>

  <div
    v-if="isLoading"
    class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm"
    role="status"
  >
    Loading...
  </div>

  <div
    v-if="error"
    class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
    role="alert"
  >
    {{ error }}
  </div>

  <Form :errors="violations" @submit="create" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import Form from "~~/components/review/ReviewForm.vue";
import { useReviewCreateStore } from "~~/stores/review/create";
import { useCreateItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { Review } from "~~/types/review";

const reviewCreateStore = useReviewCreateStore();
const { created, isLoading, violations, error } = storeToRefs(reviewCreateStore);

async function create(item: Review) {
  const data = await useCreateItem<Review>("reviews", item);
  reviewCreateStore.setData(data);

  if (!created?.value?.["@id"]) {
    reviewCreateStore.setError("Missing item id. Please reload");
    return;
  }

  navigateTo({
    name: "reviews-id-edit",
    params: { id: getIdFromIri(created?.value?.["@id"]) },
  });
}

onBeforeUnmount(() => {
  reviewCreateStore.$reset();
});
</script>
