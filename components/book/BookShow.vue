<template>
  <div class="flex items-center justify-between">
    <nuxt-link
      :to="{ name: 'books' }"
      class="text-blue-600 hover:text-blue-800"
    >
      &lt; Back to list
    </nuxt-link>

    <div>
      <nuxt-link
        v-if="item"
        :to="{ name: 'books-id-edit', params: { id: getIdFromIri(item['@id']) } }"
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

  <h1 class="text-3xl my-4">Show Book {{ item?.["@id"] }}</h1>

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
            isbn
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.isbn }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            title
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.title }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            description
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.description }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            publicationDate
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ formatDateTime(item.publicationDate) }}
          </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            reviews
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <template v-if="router.hasRoute('reviews-id')">
              <nuxt-link
                v-for="review in item.reviews"
                :key="review"
                :to="{ name: 'reviews-id', params: { id: review } }"
                class="text-blue-600 hover:text-blue-800"
              >
                {{ review }}

                <br />
              </nuxt-link>
            </template>

            <template v-else>
              <p
                v-for="review in item.reviews"
                :key="review"
              >
                {{ review }}
              </p>
            </template>
          </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            author
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.author }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            categories
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <template v-if="router.hasRoute('categories-id')">
              <nuxt-link
                v-for="categorie in item.categories"
                :key="categorie"
                :to="{ name: 'categories-id', params: { id: categorie } }"
                class="text-blue-600 hover:text-blue-800"
              >
                {{ categorie }}

                <br />
              </nuxt-link>
            </template>

            <template v-else>
              <p
                v-for="categorie in item.categories"
                :key="categorie"
              >
                {{ categorie }}
              </p>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useBookShowStore } from "~~/stores/book/show";
import { useBookDeleteStore } from "~~/stores/book/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { Book } from "~~/types/book";

const route = useRoute();
const router = useRouter();

const bookDeleteStore = useBookDeleteStore();
const { error: deleteError, deleted } = storeToRefs(bookDeleteStore);

const bookShowStore = useBookShowStore();

useMercureItem({
  store: bookShowStore,
  deleteStore: bookDeleteStore,
  redirectRouteName: "books",
});

const id = decodeURIComponent(route.params.id as string);
const {
  retrieved: item,
  isLoading,
  error,
  hubUrl,
} = await useFetchItem<Book>(`books/${id}`);
bookShowStore.setData({ retrieved: item, isLoading, error, hubUrl });

async function deleteItem() {
  if (!item?.value) {
    bookDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this book?")) {
    const { error } = await useDeleteItem(item.value);

    if (error.value) {
      bookDeleteStore.setError(error.value);
      return;
    }

    bookDeleteStore.setDeleted(item.value);
    bookDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "books" });
    }
  }
}

onBeforeUnmount(() => {
  bookShowStore.$reset();
});
</script>
