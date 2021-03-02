import api from "@/utils/api";
import router from "@/router";

export default {
  namespaced: true,
  state: () => ({
    user: null,
  }),
  mutations: {
    user(state, value) {
      state.user = value;
    },
  },
  actions: {
    async register(context, { username, email, password }) {
      return api.post("/register", {
        username,
        email,
        password,
      });
    },
    async login({ commit }, { username, password }) {
      const res = await api.post("/login", {
        username,
        password,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      commit("user", res.data.user);
      api.defaults.headers.common["Authorization"] = res.data.user.token;
      return res.data.user;
    },
    logout({ commit }) {
      // @FIXME: on ne doit pas appeler un endpoint de l'API ici pour délogguer?
      localStorage.removeItem("user");
      commit("user", null);
      delete api.defaults.headers.common["Authorization"];
      console.log("router", router);
      if (router.currentRoute.path !== "/") {
        router.push("/");
      }
    },
    // reloguer automatiquement si un objet user existe
    // dans le local storage.
    // A appeler dans le composant App.vue, dans un hook created() par exemple
    async rememberMe({ commit }) {
      let user = localStorage.getItem("user");
      if (user) {
        user = JSON.parse(user);
        api.defaults.headers.common.authorization = `Token ${user.token}`;
        commit("user", user);
      }
    },
  },
};
