<template>
  <div class="flex items-center justify-between">
    <nuxt-link
      :to="{ name: 'categories' }"
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

  <h1 class="text-3xl my-4">Edit Categorie {{ item?.["@id"] }}</h1>

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
import Form from "~~/components/categorie/CategorieForm.vue";
import { useCategorieUpdateStore } from "~~/stores/categorie/update";
import { useCategorieCreateStore } from "~~/stores/categorie/create";
import { useCategorieDeleteStore } from "~~/stores/categorie/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem, useUpdateItem } from "~~/composables/api";
import { SubmissionErrors } from "~~/types/error";
import type { Categorie } from "~~/types/categorie";

const route = useRoute();
const router = useRouter();

const categorieCreateStore = useCategorieCreateStore();
const { created } = storeToRefs(categorieCreateStore);

const categorieDeleteStore = useCategorieDeleteStore();
const { error: deleteError, deleted, isLoading: deleteLoading } =
  storeToRefs(categorieDeleteStore);

const categorieUpdateStore = useCategorieUpdateStore();

useMercureItem({
  store: categorieUpdateStore,
  deleteStore: categorieDeleteStore,
  redirectRouteName: "categories",
});

const id = decodeURIComponent(route.params.id as string);
let updated: Ref<Categorie | undefined> = ref(undefined);
let violations: Ref<SubmissionErrors | undefined> = ref(undefined);
let {
  retrieved: item,
  error,
  isLoading,
  hubUrl,
} = await useFetchItem<Categorie>(`categories/${id}`);
categorieUpdateStore.setData({
  retrieved: item,
  error,
  isLoading,
  hubUrl,
});

async function update(payload: Categorie) {
  if (!item?.value) {
    categorieUpdateStore.setError("No item found. Please reload");
    return;
  }

  const data = await useUpdateItem<Categorie>(item.value, payload);
  updated.value = data.updated.value;
  violations.value = data.violations.value;
  isLoading.value = data.isLoading.value;
  error.value = data.error.value;
  categorieUpdateStore.setUpdateData(data);
}

async function deleteItem() {
  if (!item?.value) {
    categorieDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this categorie?")) {
    const { isLoading, error } = await useDeleteItem(item.value);

    if (error.value) {
      categorieDeleteStore.setError(error.value);
      return;
    }

    categorieDeleteStore.setLoading(Boolean(isLoading?.value));
    categorieDeleteStore.setDeleted(item.value);
    categorieDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "categories" });
    }
  }
}

onBeforeUnmount(() => {
  categorieUpdateStore.$reset();
  categorieCreateStore.$reset();
  categorieDeleteStore.$reset();
});
</script>
