<template lang="html">
  <div data-name="BackgroundCoverArt">
    <div class="background_color background"></div>
    <div
      class="background_image background"
      v-bind:style="
        'background-image: url(' +
        base_url +
        '/api/img?id=' +
        image_key +
        '&width=' +
        ui.width +
        '&height=' +
        ui.height +
        ')'
      "
    ></div>
  </div>
</template>

<script>
export default {
  name: "BackgroundCoverArt",
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

<style lang="css" scoped>
.background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.background_image {
  z-index: -10;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: opacity(25%) blur(15px);
}
.background_color {
  background-color: black;
  z-index: -15;
}
</style>
