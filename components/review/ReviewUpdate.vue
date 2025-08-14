<template>
  <div class="flex items-center justify-between">
    <nuxt-link
      :to="{ name: 'reviews' }"
      class="text-blue-600 hover:text-blue-800"
    >
      &lt; Back to list
    </nuxt-link>

    <button
      class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700"
      @click="deleteItem"
    >
      Delete
    </button>
  </div>

  <h1 class="text-3xl my-4">Edit Review {{ item?.["@id"] }}</h1>

  <div
    v-if="isLoading || deleteLoading"
    class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm"
    role="status"
  >
    Loading...
  </div>

  <div
    v-if="error || deleteError"
    class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
    role="alert"
  >
    {{ error || deleteError }}
  </div>

  <div
    v-if="created || updated"
    class="bg-green-100 rounded py-4 px-4 my-2 text-green-700 text-sm"
    role="status"
  >
    <template v-if="updated">{{ updated["@id"] }} updated.</template>
    <template v-else-if="created">{{ created["@id"] }} created.</template>
  </div>

  <Form :values="item" :errors="violations" @submit="update" />
</template>

<script lang="ts" setup>
import { Ref } from "vue";
import { storeToRefs } from "pinia";
import Form from "~~/components/review/ReviewForm.vue";
import { useReviewUpdateStore } from "~~/stores/review/update";
import { useReviewCreateStore } from "~~/stores/review/create";
import { useReviewDeleteStore } from "~~/stores/review/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem, useUpdateItem } from "~~/composables/api";
import { SubmissionErrors } from "~~/types/error";
import type { Review } from "~~/types/review";

const route = useRoute();
const router = useRouter();

const reviewCreateStore = useReviewCreateStore();
const { created } = storeToRefs(reviewCreateStore);

const reviewDeleteStore = useReviewDeleteStore();
const { error: deleteError, deleted, isLoading: deleteLoading } =
  storeToRefs(reviewDeleteStore);

const reviewUpdateStore = useReviewUpdateStore();

useMercureItem({
  store: reviewUpdateStore,
  deleteStore: reviewDeleteStore,
  redirectRouteName: "reviews",
});

const id = decodeURIComponent(route.params.id as string);
let updated: Ref<Review | undefined> = ref(undefined);
let violations: Ref<SubmissionErrors | undefined> = ref(undefined);
let {
  retrieved: item,
  error,
  isLoading,
  hubUrl,
} = await useFetchItem<Review>(`reviews/${id}`);
reviewUpdateStore.setData({
  retrieved: item,
  error,
  isLoading,
  hubUrl,
});

async function update(payload: Review) {
  if (!item?.value) {
    reviewUpdateStore.setError("No item found. Please reload");
    return;
  }

  const data = await useUpdateItem<Review>(item.value, payload);
  updated.value = data.updated.value;
  violations.value = data.violations.value;
  isLoading.value = data.isLoading.value;
  error.value = data.error.value;
  reviewUpdateStore.setUpdateData(data);
}

async function deleteItem() {
  if (!item?.value) {
    reviewDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this review?")) {
    const { isLoading, error } = await useDeleteItem(item.value);

    if (error.value) {
      reviewDeleteStore.setError(error.value);
      return;
    }

    reviewDeleteStore.setLoading(Boolean(isLoading?.value));
    reviewDeleteStore.setDeleted(item.value);
    reviewDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "reviews" });
    }
  }
}

onBeforeUnmount(() => {
  reviewUpdateStore.$reset();
  reviewCreateStore.$reset();
  reviewDeleteStore.$reset();
});
</script>
