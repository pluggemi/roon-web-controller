/*
The MIT License (MIT)
=====================

Copyright (c) 2020 Mike Plugge

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

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
      this.$store.commit("SET_session_key");
      this.$store.commit("SET_base_url", BASE_URL);
      document.title = "Roon Web Controller";
    });
  },
  render: (h) => h(App),
}).$mount("#app");
