<template lang="html">
  <button type="button" v-on:click="go_volume">
    <svg>
      <use v-bind:href="'#svg_volume_' + command" />
    </svg>
  </button>
</template>

<script>
export default {
  name: "ButtonVolume",
  props: {
    command: { type: String, required: true },
    output_id: { type: String, required: true },
    value: { type: Number, required: true },
  },
  methods: {
    go_volume: function () {
      let payload = {
        output_id: this.output_id,
        value: this.value,
      };
      this.$store.dispatch("GO_volume", payload);
    },
  },
};
</script>
