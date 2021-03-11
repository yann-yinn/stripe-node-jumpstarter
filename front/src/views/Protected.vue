<template>
  <div class="container max-w-xl mx-auto mt-10">
    <div
      v-if="
        user.stripeSubcription && user.stripeSubcription.status === 'active'
      "
      class="text-center text-gray-800"
    >
      You must
      <router-link to="/subscribe">Buy a plan</router-link> to access our
      application !
    </div>
    <div v-if="$store.state.auth.user">
      You're logged in
    </div>
  </div>
</template>

<script>
import api from "../utils/api";

export default defineComponent({
  computed: {
    async user() {
      return await api.get("/api/userinfo");
    },
  },
});
</script>
