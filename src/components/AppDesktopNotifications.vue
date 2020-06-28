<template lang="html">
  <div data-name="AppDesktopNotifications"></div>
</template>
<script>
export default {
  name: "AppDesktopNotifications",
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
        if (this.current_zone && this.current_zone.now_playing) {
          info = this.current_zone.now_playing.one_line.line1;
        }
        return info;
      },
    },
  },
  watch: {
    info() {
      if (this.current_zone.now_playing) {
        let notification = {};
        if (this.current_zone.now_playing.three_line) {
          notification.line1 = this.current_zone.now_playing.three_line.line1;
          notification.line2 = this.current_zone.now_playing.three_line.line2;
          notification.line3 = this.current_zone.now_playing.three_line.line3;
        }
        if (this.current_zone.now_playing.image_key) {
          notification.image_key = this.current_zone.now_playing.image_key;
        }
        // console.log(notification);
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
