<template>
  <div
    class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
    :class="{ 'bg-indigo-100': selected }"
  >
    <div class="p-6">
      <h2 class="text-lg leading-6 font-medium text-gray-900">
        {{ plan.product.name }} <span v-if="selected">(Current)</span>
      </h2>
      <p class="mt-4 text-sm text-gray-500">
        {{ plan.product.description }}
      </p>
      <p class="mt-8">
        <span class="text-4xl font-extrabold text-gray-900"
          >€{{ plan.amount / 100 }}</span
        >
        <span class="text-base font-medium text-gray-500"
          >/{{ plan.interval }}</span
        >
      </p>
      <button
        :disabled="subscribing"
        @click="$emit('subscribe', plan)"
        class="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
      >
        <span v-if="subscribing"> Processing... </span>
        <span v-if="!subscribing">Buy {{ plan.product.name }}</span>
      </button>
    </div>
    <div class="pt-6 pb-8 px-6">
      <h3 class="text-xs font-medium text-gray-900 tracking-wide uppercase">
        What's included
      </h3>
      <ul class="mt-6 space-y-4">
        <li class="flex space-x-3">
          <!-- Heroicon name: solid/check -->
          <svg
            class="flex-shrink-0 h-5 w-5 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm text-gray-500"
            >Potenti felis, in cras at at ligula nunc.</span
          >
        </li>

        <li class="flex space-x-3">
          <!-- Heroicon name: solid/check -->
          <svg
            class="flex-shrink-0 h-5 w-5 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm text-gray-500"
            >Orci neque eget pellentesque.</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    plan: {
      type: Object,
      required: true,
    },
    subscribing: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
