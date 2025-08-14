<template>
  <div class="flex items-center justify-between">
    <nuxt-link
      :to="{ name: 'categories' }"
      class="text-blue-600 hover:text-blue-800"
    >
      &lt; Back to list
    </nuxt-link>

    <div>
      <nuxt-link
        v-if="item"
        :to="{ name: 'categories-id-edit', params: { id: getIdFromIri(item['@id']) } }"
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

  <h1 class="text-3xl my-4">Show Categorie {{ item?.["@id"] }}</h1>

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
            name
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.name }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            books
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <template v-if="router.hasRoute('books-id')">
              <nuxt-link
                v-for="book in item.books"
                :key="book"
                :to="{ name: 'books-id', params: { id: book } }"
                class="text-blue-600 hover:text-blue-800"
              >
                {{ book }}

                <br />
              </nuxt-link>
            </template>

            <template v-else>
              <p
                v-for="book in item.books"
                :key="book"
              >
                {{ book }}
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
import { useCategorieShowStore } from "~~/stores/categorie/show";
import { useCategorieDeleteStore } from "~~/stores/categorie/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { Categorie } from "~~/types/categorie";

const route = useRoute();
const router = useRouter();

const categorieDeleteStore = useCategorieDeleteStore();
const { error: deleteError, deleted } = storeToRefs(categorieDeleteStore);

const categorieShowStore = useCategorieShowStore();

useMercureItem({
  store: categorieShowStore,
  deleteStore: categorieDeleteStore,
  redirectRouteName: "categories",
});

const id = decodeURIComponent(route.params.id as string);
const {
  retrieved: item,
  isLoading,
  error,
  hubUrl,
} = await useFetchItem<Categorie>(`categories/${id}`);
categorieShowStore.setData({ retrieved: item, isLoading, error, hubUrl });

async function deleteItem() {
  if (!item?.value) {
    categorieDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this categorie?")) {
    const { error } = await useDeleteItem(item.value);

    if (error.value) {
      categorieDeleteStore.setError(error.value);
      return;
    }

    categorieDeleteStore.setDeleted(item.value);
    categorieDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "categories" });
    }
  }
}

onBeforeUnmount(() => {
  categorieShowStore.$reset();
});
</script>
