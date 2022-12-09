<template lang="html">
  <input
    type="range"
    v-bind:name="'volume for ' + output.display_name"
    v-bind:min="output.volume.min"
    v-bind:max="output.volume.max"
    v-bind:step="output.volume.step"
    v-model="value"
  />
</template>

<script>
export default {
  name: "RangeVolume",
  props: {
    output: { type: Object, required: true },
  },
  computed: {
    value: {
      get() {
        return this.output.volume.value;
      },
      set(value) {
        let payload = {
          output_id: this.output.output_id,
          value: value,
        };
        this.$store.dispatch("GO_volume", payload);
      },
    },
  },
};
</script>
