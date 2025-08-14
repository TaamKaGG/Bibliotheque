<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    <div class="mb-2">
      <label
        for="categorie_name"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        name
      </label>
      <input
        id="categorie_name"
        v-model="item.name"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.name ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.name"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.name }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="categorie_books"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        books
      </label>
      <FormRepeater
        :values="item.books"
        @update="(values: any[]) => (item.books = values)"
      />
      <div
        v-if="violations?.books"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.books }}
      </div>
    </div>

    <button
      type="submit"
      class="px-6 py-2 bg-green-500 text-white font-medium rounded shadow-md hover:bg-green-600"
    >
      Submit
    </button>
  </form>
</template>

<script lang="ts" setup>
import { Ref } from "vue";
import FormRepeater from "~~/components/common/FormRepeater.vue";
import type { Categorie } from "~~/types/categorie";
import type { SubmissionErrors } from "~~/types/error";

const props = defineProps<{
  values?: Categorie;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

let item: Ref<Categorie> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
  };
}

let emit = defineEmits<{
  (e: "submit", item: Categorie): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
}
</script>
