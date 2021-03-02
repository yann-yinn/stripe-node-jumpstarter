<template>
  <div>
    <div class="bg-white shadow p-10">
      <h2 class="font-bold text-gray-800 text-xl pb-4">Your plan</h2>
      <h3 class="py-6">We partnered with Stripe for a simplified billing.</h3>
      <button
        @click="onManageBillingClick"
        class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
      >
        Manage Billing
      </button>
    </div>
  </div>
</template>

<script>
import { redirectToCustomerPortal } from "../utils/stripe";

export default {
  methods: {
    onManageBillingClick() {
      redirectToCustomerPortal();
    },
  },
};
</script>
