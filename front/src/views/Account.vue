<template>
  <div class="container max-w-4xl mx-auto p-10 text-center">
    <h1 class="text-5xl font-extrabold text-gray-900 sm:text-center">
      Account
    </h1>
    <div v-if="loading">Loading...</div>
    <div v-if="loading === false">
      <div>
        <div v-if="user" class="text-gray-900 pt-4">
          <p class="font-bold">{{ user.username }}</p>
          <p>{{ user.email }}</p>
        </div>
        <a
          class="cursor-pointer"
          @click.prevent="$store.dispatch('auth/logout')"
        >
        </a>
      </div>
      <div class="py-10">
        <StripeManageBilling :user="user" />
      </div>
    </div>
  </div>
</template>

<script>
import StripeManageBilling from "@/modules/stripe/components/StripeManageBilling";
import api from "../utils/api";

export default {
  components: {
    StripeManageBilling,
  },
  data() {
    return {
      loading: false,
      user: {},
    };
  },
  created() {
    if (!this.$store.state.auth.user) {
      this.$toasted.show("Sorry, you must be logged in to see this page");
      this.$router.push("/login");
    }
    this.loading = true;
    api
      .get("/api/userinfo")
      .then((response) => {
        this.user = response.data;
        this.loading = false;
      })
      .catch((e) => {
        this.loading = false;
        throw new Error(e);
      });
  },
  methods: {
    onManageBillingClick() {
      redirectToCustomerPortal();
    },
  },
};
</script>
