<template>
  <div class="container max-w-xl mx-auto mt-10">
    <div v-if="!$store.state.auth.user" class="text-center text-gray-800">
      You must
      <router-link to="/subscribe">Buy a plan</router-link> to access our
      application !
      <router-link
        to="/protected"
        class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
      >
        Get started
      </router-link>
    </div>
    <div v-if="$store.state.auth.user">
      You're logged in
    </div>
  </div>
</template>
