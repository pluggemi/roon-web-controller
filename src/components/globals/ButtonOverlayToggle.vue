<template lang="html">
  <button type="button" v-on:click="show_overlay">
    <svg>
      <use v-bind:href="'#svg_' + overlay_name" />
    </svg>
  </button>
</template>

<script>
export default {
  name: "ButtonOverlayToggle",
  props: {
    overlay_name: { type: String, required: true },
    show: { type: Boolean, required: true },
  },
  methods: {
    show_overlay: function () {
      let payload = {
        overlay_name: this.overlay_name,
        show: this.show,
      };
      this.$store.commit("SHOW_overlay", payload);
    },
  },
};
</script>
