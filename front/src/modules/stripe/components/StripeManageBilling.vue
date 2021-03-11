<template>
  <div>
    <div class="bg-white shadow p-10">
      <h2 class="font-bold text-gray-700 pb-4">Votre abonnement</h2>
      <div>
        <div class="font-bold text-indigo-500 text-xl">
          {{ user.subscription.product.name }}
        </div>
        <p>
          {{ user.subscription.plan.amount / 100 }}
          {{ user.subscription.plan.currency }} /
          {{ user.subscription.plan.interval }}
        </p>
      </div>
      <h3 class="py-6 text-gray-500">
        We partnered with Stripe for a simplified billing.
      </h3>
      <button
        @click="onManageBillingClick"
        class="flex mx-auto items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
      >
        Manage Billing
      </button>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api";

export default {
  props: ["user"],
  methods: {
    onManageBillingClick() {
      api
        .post(`/api/stripe/create-customer-portal-session`)
        .then((response) => {
          window.location.href = response.data.url;
        });
    },
  },
};
</script>
