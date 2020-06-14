<template lang="html">
  <div data-name="TouchscreenVolume" class="overlay">
    <div class="overlay_content">
      <h1>Volume</h1>
      <button
        type="button"
        class="overlay_close_button"
        v-on:click="hide_overlay"
      >
        <svg>
          <use href="#svg_close" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TouchscreenVolume",
  methods: {
    hide_overlay: function () {
      this.$store.commit("SHOW_overlay", {
        overlay_name: "volume",
        show: false,
      });
    },
  },
};
</script>
