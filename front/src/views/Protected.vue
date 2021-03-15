<template>
  <div class="container max-w-xl mx-auto mt-10 text-center">
    <h1 class="text-xl font-bold">Contenu réservé aux abonnés</h1>
    <div v-if="loading" class="my-10">Loading...</div>
    <div v-if="!loading">
      <div class="text-red-500 bg-red">{{ error }}</div>

      <!-- user is not logged in -->
      <template v-if="!user">
        <div class="text-center text-gray-800 mt-10">
          Vous devez
          <router-link to="/login" class="text-indigo-500 font-bold">
            vous connecter
          </router-link>
          pour accéder à cette section!
        </div>
      </template>

      <template v-if="user">
        <!-- user is logged in but has no active subscription -->
        <div v-if="!user.subscription" class="text-center text-gray-800 mt-10">
          Vous devez avoir
          <router-link to="/subscribe" class="text-indigo-500 font-bold">
            un abonnement</router-link
          >
          pour accéder à cette section.
        </div>

        <!-- user is logged in AND has an active subscription -->
        <div
          class="p-20 m-10 bg-indigo-100"
          v-if="user.subscription && user.subscription.status === 'active'"
        >
          Your subscription is active, you can access our protected content! 🤗
        </div>
      </template>
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
      user: null,
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
        this.error = error.response.status == "401" ? "Non autorisé" : error;
        this.loading = false;
      });
  },
};
</script>
