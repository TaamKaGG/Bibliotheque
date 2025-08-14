<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    <div class="mb-2">
      <label
        for="review_rating"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        rating
      </label>
      <input
        id="review_rating"
        v-model="item.rating"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.rating ? 'border-red-500' : 'border-gray-300',
        ]"
        type="number"
        placeholder=""
      />
      <div
        v-if="violations?.rating"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.rating }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="review_body"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        body
      </label>
      <input
        id="review_body"
        v-model="item.body"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.body ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.body"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.body }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="review_created_at"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        created_at
      </label>
      <input
        id="review_created_at"
        v-model="item.created_at"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.created_at ? 'border-red-500' : 'border-gray-300',
        ]"
        type="date"
        placeholder=""
      />
      <div
        v-if="violations?.created_at"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.created_at }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="review_book"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        book
      </label>
      <input
        id="review_book"
        v-model="item.book"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.book ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.book"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.book }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="review_creator"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        creator
      </label>
      <input
        id="review_creator"
        v-model="item.creator"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.creator ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.creator"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.creator }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="review_createdAt"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        createdAt
      </label>
      <input
        id="review_createdAt"
        v-model="item.createdAt"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.createdAt ? 'border-red-500' : 'border-gray-300',
        ]"
        type="date"
        placeholder=""
      />
      <div
        v-if="violations?.createdAt"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.createdAt }}
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
import type { Review } from "~~/types/review";
import type { SubmissionErrors } from "~~/types/error";

const props = defineProps<{
  values?: Review;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

let item: Ref<Review> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    publicationDate: formatDateInput(props.values.publicationDate),
    publicationDate: formatDateInput(props.values.publicationDate),
  };
}

let emit = defineEmits<{
  (e: "submit", item: Review): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
}
</script>
