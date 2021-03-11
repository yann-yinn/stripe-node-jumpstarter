<template>
  <div>
    <div class="bg-white text-center py-3">
      <router-link class="mr-3" to="/">Home</router-link>
      <router-link class="mr-3" to="/subscribe">Pricing</router-link>
      <span v-if="!user">
        <router-link class="mr-3" to="/login">Login</router-link>
        <router-link class="mr-3" to="/register">Register</router-link>
      </span>
      <span v-if="user">
        <router-link class="mr-3" to="/account">
          Account ({{ user.username }})</router-link
        >
        <a @click.prevent="$store.dispatch('auth/logout')">
          Logout
        </a>
      </span>
    </div>
    <router-view />
  </div>
</template>

<script>
import api from "./utils/api";

export default {
  created() {
    this.$store.dispatch("auth/rememberMe");
  },
  computed: {
    user: async function() {
      return await api.get("/api/userinfo");
    },
  },
};
</script>

<style>
.router-link-exact-active {
  @apply text-indigo-500;
}
</style>
