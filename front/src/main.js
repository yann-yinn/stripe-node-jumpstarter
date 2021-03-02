import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./css/index.css";
import Toasted from "vue-toasted";

Vue.use(Toasted, {
  action: {
    text: "close",
    onClick: (e, toastObject) => {
      toastObject.goAway(0);
    },
  },
});

new Vue({
  router,
  render: (h) => h(App),
  store,
}).$mount("#app");
