<template>
  <div>
    <div class="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 max-w">
          <!-- space -->
          <router-link
            to="/register"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Or create a new account
          </router-link>
        </p>
      </div>
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div v-show="error" class="bg-red-100 text-red-400 p-3 mb-4">
            {{ error }}
          </div>
          <form @submit.prevent="onFormSubmit" method="POST">
            <div>
              <label
                for="username"
                class="block text-sm font-medium text-gray-700 text-left"
              >
                Username or Email
              </label>
              <div class="mt-1">
                <input
                  v-model="username"
                  id="username"
                  autocomplete="username"
                  name="username"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="mt-4">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 text-left"
              >
                Password
              </label>
              <div class="mt-1">
                <input
                  v-model="password"
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="w-full flex justify-center mt-5 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      error: null,
      username: "",
      password: "",
    };
  },
  created() {
    // on est déjà authentifié, ne pas afficher le formulaire de login
    if (this.$store.state.auth.user) {
      this.$toasted.show("You are already logged in!");
      this.$router.push("/");
    }
  },
  methods: {
    onFormSubmit() {
      this.error = null;
      this.$store
        .dispatch("auth/login", {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          this.$toasted.show(`You are now logged in!`);
          this.$router.push("/");
        })
        .catch((error) => {
          console.log("error", error);
          // form errors
          if (error.response.status == "422") {
            this.error = error.response.data.error;
          }
          // any others errors
          else {
            this.error = error;
          }
        });
    },
  },
};
</script>
