<template>
  <div class="container max-w-xl mx-auto mt-10 text-center">
    <h1 class="text-xl font-bold">Contenu réservé aux abonné</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="!loading">
      <div class="text-red-500 bg-red">{{ error }}</div>
      <div v-if="!user.subscription" class="text-center text-gray-800 mt-10">
        You must
        <router-link to="/subscribe" class="text-indigo-500 font-bold">
          Buy a plan</router-link
        >
        or
        <router-link to="/login" class="text-indigo-500 font-bold">
          Login
        </router-link>
        to access our this section !
      </div>
      <div
        class="p-20 m-10 bg-indigo-100"
        v-if="user.subscription && user.subscription.status === 'active'"
      >
        Your subscription is active, you can access our protected content!
      </div>
    </div>
  </div>
</template>

<script>
import api from "../utils/api";

export default {
  data() {
    return {
      loading: false,
      activeSubscription: false,
      error: null,
      user: {},
    };
  },
  mounted() {
    this.loading = true;
    api
      .get("/api/userinfo")
      .then((response) => {
        this.user = response.data;
        this.loading = false;
      })
      .catch((error) => {
        if (error.response.status == "401") {
          this.error = "Non autorisé";
        } else {
          this.error = error;
        }
        this.loading = false;
      });
  },
};
</script>
