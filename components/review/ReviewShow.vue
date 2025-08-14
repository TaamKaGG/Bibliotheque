<template>
  <div class="flex items-center justify-between">
    <nuxt-link
      :to="{ name: 'reviews' }"
      class="text-blue-600 hover:text-blue-800"
    >
      &lt; Back to list
    </nuxt-link>

    <div>
      <nuxt-link
        v-if="item"
        :to="{ name: 'reviews-id-edit', params: { id: getIdFromIri(item['@id']) } }"
        class="px-6 py-2 mr-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700"
      >
        Edit
      </nuxt-link>
      <button
        class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700"
        @click="deleteItem"
      >
        Delete
      </button>
    </div>
  </div>

  <h1 class="text-3xl my-4">Show Review {{ item?.["@id"] }}</h1>

  <div
    v-if="isLoading"
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

  <div v-if="item" class="overflow-x-auto">
    <table class="min-w-full">
      <thead class="border-b">
        <tr>
          <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
            Field
          </th>
          <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            rating
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.rating }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            body
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.body }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            created_at
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ formatDateTime(item.created_at) }}
          </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            book
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <nuxt-link
              v-if="router.hasRoute('books-id')"
              :to="{ name: 'books-id', params: { id: item.book } }"
              class="text-blue-600 hover:text-blue-800"
            >
              {{ item.book }}
            </nuxt-link>

            <p v-else>
              {{ item.book }}
            </p>
          </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            creator
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.creator }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            createdAt
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ formatDateTime(item.createdAt) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useReviewShowStore } from "~~/stores/review/show";
import { useReviewDeleteStore } from "~~/stores/review/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { Review } from "~~/types/review";

const route = useRoute();
const router = useRouter();

const reviewDeleteStore = useReviewDeleteStore();
const { error: deleteError, deleted } = storeToRefs(reviewDeleteStore);

const reviewShowStore = useReviewShowStore();

useMercureItem({
  store: reviewShowStore,
  deleteStore: reviewDeleteStore,
  redirectRouteName: "reviews",
});

const id = decodeURIComponent(route.params.id as string);
const {
  retrieved: item,
  isLoading,
  error,
  hubUrl,
} = await useFetchItem<Review>(`reviews/${id}`);
reviewShowStore.setData({ retrieved: item, isLoading, error, hubUrl });

async function deleteItem() {
  if (!item?.value) {
    reviewDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this review?")) {
    const { error } = await useDeleteItem(item.value);

    if (error.value) {
      reviewDeleteStore.setError(error.value);
      return;
    }

    reviewDeleteStore.setDeleted(item.value);
    reviewDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "reviews" });
    }
  }
}

onBeforeUnmount(() => {
  reviewShowStore.$reset();
});
</script>
