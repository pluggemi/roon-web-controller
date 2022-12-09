<template lang="html">
  <button type="button" v-on:click="go_browse">
    <svg>
      <use v-bind:href="'#svg_' + command" />
    </svg>
  </button>
</template>

<script>
export default {
  name: "ButtonLibraryNav",
  props: {
    command: { type: String, required: true },
  },
  methods: {
    go_browse: function () {
      let payload = {
        command: this.command,
      };
      this.$store.dispatch("GO_browse", payload);
    },
  },
};
</script>
