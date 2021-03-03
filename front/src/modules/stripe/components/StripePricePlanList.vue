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
  </div>
</template>

<script>
import StripePricePlan from "../components/StripePricePlan";
import {
  addStripeScript,
  createCheckoutSession,
  getPlans
} from "../utils/stripe";

export default {
  components: {
    StripePricePlan
  },
  data() {
    return {
      user: null,
      // tous les plans
      plans: [],
      // seulement les plans avec paiement mensuel
      plansMonthly: [],
      // seulement les plans avec paiement annuel.
      plansYearly: [],
      // plans en cours de chargement depuis l'API node
      loading: false,
      // faut-il montrer seulement les plans annuels ou mensuels ?
      interval: "year",
      error: null,
      subscribing: false
    };
  },
  async mounted() {
    this.error = null;
    this.loading = true;
    addStripeScript();
    //this.user = await getUser();
    getPlans()
      .then(response => {
        this.plans = response.data.plans;
        this.plansYearly = response.data.plans.filter(
          p => p.interval === "year"
        );
        this.plansMonthly = response.data.plans.filter(
          p => p.interval === "month"
        );
        this.loading = false;
      })
      .catch(e => {
        this.error = e;
        throw new Error(e);
      });
  },
  methods: {
    planIsSelected(plan) {
      /*
      if (this.user['https://user_metadata'] && this.user['https://user_metadata'].price === plan.id) {
        return true
      }
      */
      return false
    },
    async onSubscribeClick(plan) {
      // user is not logged in, 
      if (!this.$store.state.auth.user) {
        this.$toasted.show("You must sign or create an account to buy a plan");
        this.$router.push("/login");
        return;
      } 
      // if user is logged in, redirect him to stripe checkout
      const priceId = plan.id;
      this.subscribing = true;
      this.error = null;
      return createCheckoutSession({ priceId })
        .then(async response => {
          console.log('STRIPE_redirectToCheckout', response.data);
          // appeler une fonction de Stripe.js pour rediriger vers la page de paiement
          const stripe = Stripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY);
          await stripe.redirectToCheckout({
            sessionId: response.data.sessionId
          });
          this.subscribing = false;
        })
        .catch(error => {
          this.subscribing = false;
          this.error = error.message;
        });
    }
  }
};
</script>
