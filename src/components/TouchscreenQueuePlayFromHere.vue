<template lang="html">
  <button type="button" v-on:click="go_play_from_here">
    <svg>
      <use href="#svg_play" />
    </svg>
  </button>
</template>

<script>
export default {
  name: "TouchscreenQueuePlayFromHere",
  props: {
    queue_item_id: { type: Number, required: true },
  },
  methods: {
    go_play_from_here: function () {
      let payload = {
        queue_item_id: this.queue_item_id,
      };
      this.$store.dispatch("GO_play_from_here", payload);
    },
  },
};
</script>
