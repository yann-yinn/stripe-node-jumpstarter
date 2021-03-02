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
      import(/* webpackChunkName: "login" */ "@/modules/auth/views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(
        /* webpackChunkName: "register" */ "@/modules/auth/views/Register.vue"
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
      import(/* webpackChunkName: "subscribe" */ "@/views/Account.vue"),
  },
  {
    path: "/protected",
    name: "Protected",
    component: () =>
      import(/* webpackChunkName: "subscribe" */ "@/views/Protected.vue"),
  },
];

export default new VueRouter({
  mode: "history",
  routes,
});
