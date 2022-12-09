<template lang="html">
  <button type="button" v-on:click="go_volume_mute">
    <svg>
      <use v-bind:href="'#svg_volume_mute_' + muted" />
    </svg>
  </button>
</template>

<script>
export default {
  name: "ButtonVolumeMute",
  props: {
    muted: { type: Boolean, required: true },
    output_id: { type: String, required: true },
  },
  methods: {
    go_volume_mute: function () {
      let payload = {
        output_id: this.output_id,
        mute: !this.muted,
      };
      this.$store.dispatch("GO_volume_mute", payload);
    },
  },
};
</script>

<style lang="css" scoped></style>
