import Vue from "vue";
import App from "./App.vue";
import VueSocketio from "vue-socket.io";
// import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// Globally register autoimport components
import "@/components/globals/globals.js";

let BASE_URL = "";
if (process.env.NODE_ENV === "development") {
  BASE_URL = "http://localhost:10000";
}

Vue.mixin({
  methods: {
    secondsToTime: (seconds) => {
      seconds = Number(seconds);
      let hour = Math.floor(seconds / 3600);
      let minute = Math.floor((seconds % 3600) / 60);
      let second = Math.floor((seconds % 3600) % 60);
      return (
        (hour > 0 ? hour + ":" + (minute < 10 ? "0" : "") : "") +
        minute +
        ":" +
        (second < 10 ? "0" : "") +
        second
      );
    },
  },
});

Vue.use(
  new VueSocketio({
    debug: false,
    connection: BASE_URL,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

new Vue({
  router,
  store,
  mounted: function () {
    this.$nextTick(() => {
      window.addEventListener("resize", () =>
        this.$store.commit("SET_window_size")
      );
      this.$store.commit("SET_window_size");
      this.$store.commit("SET_base_url", BASE_URL);
      document.title = "Roon Web Controller";
    });
  },
  render: (h) => h(App),
}).$mount("#app");
