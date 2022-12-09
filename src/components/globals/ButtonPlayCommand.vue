<template lang="html">
  <button type="button" v-on:click="go_command">
    <svg>
      <use v-bind:href="'#svg_' + command" />
    </svg>
  </button>
</template>

<script>
export default {
  name: "ButtonPlayCommand",
  props: {
    command: { type: String, required: true },
  },
  methods: {
    go_command: function () {
      let payload = {
        command: this.command,
      };
      this.$store.dispatch("GO_command", payload);
    },
  },
};
</script>
