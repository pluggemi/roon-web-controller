<template lang="html">
  <img
    v-bind:src="
      base_url +
      '/api/img?id=' +
      image_key +
      '&width=' +
      width +
      '&height=' +
      height
    "
    alt="album cover"
  />
</template>

<script>
export default {
  name: "ImageList",
  props: {
    image_key: { type: String, required: true },
  },
  computed: {
    base_url: {
      get() {
        return this.$store.state.roon.base_url;
      },
    },
    width: {
      get() {
        return Math.round(this.$store.state.ui.width / 4);
      },
    },
    height: {
      get() {
        return Math.round(this.$store.state.ui.height / 4);
      },
    },
  },
};
</script>
