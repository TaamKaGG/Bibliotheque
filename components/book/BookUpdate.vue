<template>
  <div class="flex items-center justify-between">
    <nuxt-link
      :to="{ name: 'books' }"
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

  <h1 class="text-3xl my-4">Edit Book {{ item?.["@id"] }}</h1>

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
import Form from "~~/components/book/BookForm.vue";
import { useBookUpdateStore } from "~~/stores/book/update";
import { useBookCreateStore } from "~~/stores/book/create";
import { useBookDeleteStore } from "~~/stores/book/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem, useUpdateItem } from "~~/composables/api";
import { SubmissionErrors } from "~~/types/error";
import type { Book } from "~~/types/book";

const route = useRoute();
const router = useRouter();

const bookCreateStore = useBookCreateStore();
const { created } = storeToRefs(bookCreateStore);

const bookDeleteStore = useBookDeleteStore();
const { error: deleteError, deleted, isLoading: deleteLoading } =
  storeToRefs(bookDeleteStore);

const bookUpdateStore = useBookUpdateStore();

useMercureItem({
  store: bookUpdateStore,
  deleteStore: bookDeleteStore,
  redirectRouteName: "books",
});

const id = decodeURIComponent(route.params.id as string);
let updated: Ref<Book | undefined> = ref(undefined);
let violations: Ref<SubmissionErrors | undefined> = ref(undefined);
let {
  retrieved: item,
  error,
  isLoading,
  hubUrl,
} = await useFetchItem<Book>(`books/${id}`);
bookUpdateStore.setData({
  retrieved: item,
  error,
  isLoading,
  hubUrl,
});

async function update(payload: Book) {
  if (!item?.value) {
    bookUpdateStore.setError("No item found. Please reload");
    return;
  }

  const data = await useUpdateItem<Book>(item.value, payload);
  updated.value = data.updated.value;
  violations.value = data.violations.value;
  isLoading.value = data.isLoading.value;
  error.value = data.error.value;
  bookUpdateStore.setUpdateData(data);
}

async function deleteItem() {
  if (!item?.value) {
    bookDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this book?")) {
    const { isLoading, error } = await useDeleteItem(item.value);

    if (error.value) {
      bookDeleteStore.setError(error.value);
      return;
    }

    bookDeleteStore.setLoading(Boolean(isLoading?.value));
    bookDeleteStore.setDeleted(item.value);
    bookDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "books" });
    }
  }
}

onBeforeUnmount(() => {
  bookUpdateStore.$reset();
  bookCreateStore.$reset();
  bookDeleteStore.$reset();
});
</script>
