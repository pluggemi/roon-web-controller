import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "SelectLayout",
      component: () => import("@/layouts/SelectLayout.vue"),
    },
    {
      path: "/touchscreen",
      name: "Touchscreen",
      component: () => import("@/layouts/Touchscreen.vue"),
      children: [
        {
          path: "library",
          name: "TouchscreenLibrary",
          component: () => import("@/views/TouchscreenLibrary.vue"),
        },
        {
          path: "now_playing",
          name: "TouchscreenNowPlaying",
          component: () => import("@/views/TouchscreenNowPlaying.vue"),
        },
        {
          path: "queue",
          name: "TouchscreenQueue",
          component: () => import("@/views/TouchscreenQueue.vue"),
        },
      ],
    },
  ],
});

export default router;
