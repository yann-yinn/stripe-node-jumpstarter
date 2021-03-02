<template>
  <div class="container max-w-4xl mx-auto p-10 text-center">
    <h1 class="text-5xl font-extrabold text-gray-900 sm:text-center">
      Account
    </h1>
    <div>
      <div v-if="user" class="text-gray-900 pt-4">
        <p class="font-bold">{{ user.username }}</p>
        <p>{{ user.email }}</p>
      </div>
    </div>
    <div class="py-10">
      <StripeManageBilling />
    </div>
  </div>
</template>

<script>
import StripeManageBilling from "@/modules/stripe/components/StripeManageBilling";

export default {
  components: {
    StripeManageBilling,
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    if (!this.$store.state.auth.user) {
      this.$toasted.show("Sorry, you must be logged in to see this page");
      this.$router.push("/login");
    }
  },
  methods: {
    onManageBillingClick() {
      redirectToCustomerPortal();
    },
  },
};
</script>
