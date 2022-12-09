<template lang="html">
  <div data-name="AppBrowserTitle"></div>
</template>
<script>
export default {
  name: "AppBrowserTitle",
  computed: {
    current_zone: {
      get() {
        return this.$store.state.roon.zone_list[
          this.$store.state.settings.current_zone_id
        ];
      },
    },
    info: {
      get() {
        let info = "";
        if (
          this.current_zone &&
          this.current_zone.now_playing &&
          this.$store.state.settings.general.track_info_in_browser_title ===
            true
        ) {
          info = this.current_zone.now_playing.one_line.line1;
        }
        return info;
      },
    },
  },
  watch: {
    info() {
      if (this.info !== "") {
        document.title = `Roon Web Controller | ${this.info}`;
      } else {
        document.title = "Roon Web Controller";
      }
    },
  },
};
</script>

<style lang="css" scoped>
div {
  display: none;
}
</style>
