<template>
  <div>
    <!-- This example requires Tailwind CSS v2.0+ -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:flex-col sm:align-center">
          <h1 class="text-5xl font-extrabold text-gray-900 sm:text-center">
            Pricing Plans
          </h1>

          <p class="mt-5 text-xl text-gray-500 sm:text-center">
            Account plans unlock additional features.
          </p>
          <div
            class="relative self-center mt-6 bg-gray-100 rounded-lg p-0.5 flex sm:mt-8"
          >
            <button
              type="button"
              @click="interval = 'month'"
              :class="{ 'bg-white border-gray-200': interval === 'month' }"
              class="relative w-1/2 rounded-md shadow-sm py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8"
            >
              Monthly billing
            </button>
            <button
              @click="interval = 'year'"
              type="button"
              :class="{ 'bg-white border-gray-200': interval === 'year' }"
              class="ml-0.5 relative w-1/2 border border-transparent rounded-md py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8"
            >
              Yearly billing
            </button>
          </div>
        </div>
        <div
          class="container mx-auto text-center py-10 font-thin text-gray-700"
          v-if="loading"
        >
          Loading plans...
        </div>

        <div
          v-if="loading === false"
          class="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-2xl lg:mx-auto"
        >
          <StripePricePlan
            v-for="plan in plans"
            v-show="interval === plan.interval"
            :plan="plan"
            :selected="planIsSelected(plan)"
            :key="plan.id"
            @subscribe="onSubscribeClick"
            :subscribing="subscribing"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StripePricePlan from "../components/StripePricePlan";
import api from "@/utils/api";

export default {
  components: {
    StripePricePlan,
  },
  data() {
    return {
      user: {},
      // tous les plans
      plans: [],
      loading: false,
      // "month" ou "year": faut-il montrer seulement les plans annuels ou mensuels ?
      interval: "year",
      error: null,
      subscribing: false,
    };
  },
  async mounted() {
    this.error = null;
    this.loading = true;

    // ajout du JS de stripe
    const src = "https://js.stripe.com/v3/";
    // On s'assure qu'il n'est pas déjà présent dans notre page, en cas de
    // hot-reloading ou de démontage / remontage d'un composant Vue
    if (document.querySelectorAll(`[src="${src}"]`).length === 0) {
      let stripeScript = document.createElement("script");
      stripeScript.setAttribute("src", src);
      document.head.appendChild(stripeScript);
    }
    this.initData();
  },
  methods: {
    initData() {
      this.loading = true;
      return Promise.all([this.getPlans(), this.getUserInfo()])
        .then(() => {
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          this.error = e;
          throw new Error(e);
        });
    },
    getPlans() {
      return api.get(`/api/stripe/plans`).then((response) => {
        this.plans = response.data.plans;
        return response.data.plans;
      });
    },
    getUserInfo() {
      return api.get(`/api/userinfo`).then((response) => {
        this.user = response.data;
        return response.data;
      });
    },
    planIsSelected(plan) {
      let result = false;
      if (this.user.subscription) {
        result = this.user.subscription.plan.id === plan.id;
      }
      return result;
    },
    async onSubscribeClick(plan) {
      // L'utilisateur n'est pas connecté, on ne l'autorise pas à acheter.
      if (!this.$store.state.auth.user) {
        this.$toasted.show(
          "You must sign in or create an account to buy a plan"
        );
        this.$router.push("/login");
        return;
      }

      // L'utilisateur a déjà un abonnement: on le redirige
      // vers la gestion des ses abonnements sur son profil
      if (
        this.user &&
        this.user.subscription &&
        this.user.subscription.status === "active"
      ) {
        this.$toasted.show(
          "You already have a plan. Manage it from your account."
        );
        this.$router.push("/account");
        return;
      }

      // L'utilisateur est connecté et n'a pas d'abonnement, on le redirige
      // vers le formulaire de paiement
      const priceId = plan.id;
      this.subscribing = true;
      this.error = null;
      api
        .post("/api/stripe/create-checkout-session", { priceId })
        .then(async (response) => {
          console.log("Stripe: redirectToCheckout: " + response.data);
          // appeler une fonction de Stripe.js pour rediriger vers la page de paiement
          const stripe = Stripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY);
          await stripe.redirectToCheckout({
            sessionId: response.data.sessionId,
          });
          this.subscribing = false;
        })
        .catch((error) => {
          this.subscribing = false;
          this.error = error.message;
        });
    },
  },
};
</script>
