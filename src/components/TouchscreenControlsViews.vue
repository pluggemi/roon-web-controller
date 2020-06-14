<template lang="html">
  <div data-name="TouchscreenControlsViews">
    <router-link
      class="view_control"
      v-for="view in view_list"
      v-bind:key="view.link"
      v-bind:to="{ name: view.link }"
    >
      <svg>
        <use v-bind:href="'#' + view.icon" />
      </svg>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "TouchscreenControlsViews",
  data: function () {
    return {
      view_list: [
        { name: "Library", icon: "svg_library", link: "TouchscreenLibrary" },
        {
          name: "Now Playing",
          icon: "svg_now_playing",
          link: "TouchscreenNowPlaying",
        },
        { name: "Queue", icon: "svg_queue", link: "TouchscreenQueue" },
      ],
    };
  },
};
</script>

<style lang="css" scoped>
.view_control {
  display: inline-block;
  background: none;
  color: var(--AvailableColor);
  fill: currentColor;
  border-radius: 1vh;
  height: 10vh;
  width: 10vw;
  border: none;
  outline: none;
}
.view_control.router-link-exact-active {
  display: none;
}
</style>
