<template>
  <div>
    <div class="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
                <p class="mt-2 text-center text-sm text-gray-600 max-w">
          <!-- space -->
          <router-link
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Or sign in with your existing account
          </router-link>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div v-show="error" class="bg-red-100 text-red-400 p-3 mb-4">
            {{ error }}
          </div>
            <div>
              <label
                for="username"
                class="block text-sm font-medium text-gray-700 text-left"
              >
                Username
              </label>
              <div class="mt-1">
                <input
                  v-model="username"
                  id="username"
                  name="username"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
  <div class="mt-4">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 text-left"
              >
                Email
              </label>
              <div class="mt-1">
                <input
                  v-model="email"
                  id="email"
                  name="email"
                  type="email"
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
                @click="register"
                class="w-full flex justify-center mt-5 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
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
  name: "Register",
  data() {
    return {
      error: "",
      username: "",
      email: "",
      password: "",
    };
  },
  methods: {
    register() {
      this.$store.dispatch("auth/register", {
        username: this.username,
        email: this.email,
        password: this.password,
      })
      .then(() => {
        this.$toasted.show(`Please log in`);
        this.$router.push("/login")
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
        })
    },
  },
};
</script>
