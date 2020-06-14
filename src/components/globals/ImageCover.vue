<template lang="html">
  <img
    v-bind:src="
      base_url +
      '/api/img?id=' +
      image_key +
      '&width=' +
      ui.width +
      '&height=' +
      ui.height
    "
    alt="album cover"
  />
</template>

<script>
export default {
  name: "MediaImage",
  props: {
    image_key: { type: String, required: true },
  },
  computed: {
    base_url: {
      get() {
        return this.$store.state.roon.base_url;
      },
    },
    ui: {
      get() {
        return this.$store.state.ui;
      },
    },
  },
};
</script>
