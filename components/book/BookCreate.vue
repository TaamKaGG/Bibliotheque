<template>
  <nuxt-link :to="{ name: 'books' }" class="text-blue-600 hover:text-blue-800">
    &lt; Back to list
  </nuxt-link>

  <h1 class="text-3xl my-4">Create Book</h1>

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
import Form from "~~/components/book/BookForm.vue";
import { useBookCreateStore } from "~~/stores/book/create";
import { useCreateItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { Book } from "~~/types/book";

const bookCreateStore = useBookCreateStore();
const { created, isLoading, violations, error } = storeToRefs(bookCreateStore);

async function create(item: Book) {
  const data = await useCreateItem<Book>("books", item);
  bookCreateStore.setData(data);

  if (!created?.value?.["@id"]) {
    bookCreateStore.setError("Missing item id. Please reload");
    return;
  }

  navigateTo({
    name: "books-id-edit",
    params: { id: getIdFromIri(created?.value?.["@id"]) },
  });
}

onBeforeUnmount(() => {
  bookCreateStore.$reset();
});
</script>
