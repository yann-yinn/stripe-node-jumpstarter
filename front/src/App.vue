<template>
  <div>
    <div class="bg-white text-center py-3">
      <router-link class="mr-3" to="/">Home</router-link>
      <router-link class="mr-3" to="/subscribe">Pricing</router-link>
      <span v-if="!$store.state.auth.user">
        <router-link class="mr-3" to="/login">Login</router-link>
        <router-link class="mr-3" to="/register">Register</router-link>
      </span>
      <span v-if="$store.state.auth.user">
        <router-link class="mr-3" to="/account">
          Account ({{ $store.state.auth.user.username }}) 🔑
        </router-link>
        <a
          class="cursor-pointer"
          @click.prevent="$store.dispatch('auth/logout')"
        >
          Logout
        </a>
      </span>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("auth/rememberMe");
  },
};
</script>

<style>
.router-link-exact-active {
  @apply text-indigo-500;
}
</style>
