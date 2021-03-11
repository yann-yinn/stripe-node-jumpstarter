import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(
        /* webpackChunkName: "login" */ "@/modules/auth/components/Login.vue"
      ),
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(
        /* webpackChunkName: "register" */ "@/modules/auth/components/Register.vue"
      ),
  },
  {
    path: "/subscribe",
    name: "Subscribe",
    component: () =>
      import(
        /* webpackChunkName: "subscribe" */ "@/modules/stripe/views/StripeSubscribe.vue"
      ),
  },
  {
    path: "/account",
    name: "Account",
    component: () =>
      import(/* webpackChunkName: "account" */ "@/views/Account.vue"),
  },
  {
    path: "/protected",
    name: "Protected",
    component: () =>
      import(/* webpackChunkName: "protected" */ "@/views/Protected.vue"),
  },
];

export default new VueRouter({
  mode: "history",
  routes,
});
