<template lang="html">
  <div class="container">
    <div class="text_bold">
      {{ current_time | moment(clock.format_line1) }}
    </div>
    <div>
      {{ current_time | moment(clock.format_line2) }}
    </div>
  </div>
</template>

<script>
export default {
  name: "UiClock",
  data: function () {
    return {
      current_time: null,
      tick: null,
    };
  },
  computed: {
    clock: {
      get() {
        return this.$store.state.settings.clock;
      },
    },
  },
  methods: {
    updateCurrentTime() {
      this.current_time = Date.now();
    },
  },
  created() {
    this.current_time = Date.now();
    this.tick = setInterval(() => this.updateCurrentTime(), 1000);
  },
  beforeDestroy: function () {
    clearInterval(this.tick);
  },
};
</script>

<style lang="css" scoped>
.container {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
