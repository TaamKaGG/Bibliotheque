<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    <div class="mb-2">
      <label
        for="book_isbn"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        isbn
      </label>
      <input
        id="book_isbn"
        v-model="item.isbn"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.isbn ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.isbn"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.isbn }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="book_title"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        title
      </label>
      <input
        id="book_title"
        v-model="item.title"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.title ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.title"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.title }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="book_description"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        description
      </label>
      <input
        id="book_description"
        v-model="item.description"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.description ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.description"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.description }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="book_publicationDate"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        publicationDate
      </label>
      <input
        id="book_publicationDate"
        v-model="item.publicationDate"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.publicationDate ? 'border-red-500' : 'border-gray-300',
        ]"
        type="date"
        placeholder=""
      />
      <div
        v-if="violations?.publicationDate"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.publicationDate }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="book_reviews"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        reviews
      </label>
      <FormRepeater
        :values="item.reviews"
        @update="(values: any[]) => (item.reviews = values)"
      />
      <div
        v-if="violations?.reviews"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.reviews }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="book_author"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        author
      </label>
      <input
        id="book_author"
        v-model="item.author"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.author ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.author"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.author }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="book_categories"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        categories
      </label>
      <FormRepeater
        :values="item.categories"
        @update="(values: any[]) => (item.categories = values)"
      />
      <div
        v-if="violations?.categories"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.categories }}
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
import type { Book } from "~~/types/book";
import type { SubmissionErrors } from "~~/types/error";

const props = defineProps<{
  values?: Book;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

let item: Ref<Book> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    publicationDate: formatDateInput(props.values.publicationDate),
  };
}

let emit = defineEmits<{
  (e: "submit", item: Book): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
}
</script>
