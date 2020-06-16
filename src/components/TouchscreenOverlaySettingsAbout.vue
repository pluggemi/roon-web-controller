<template lang="html">
  <div data-name="TouchscreenOverlaySettingsAbout" class="settings_content">
    <div class="settings_row">
      <div class="settings_name">{{ sw.name }}</div>
    </div>
    <div class="settings_row">
      <div class="settings_name">Version</div>
      <div class="settings_options">{{ sw.version }}</div>
    </div>
    <div class="settings_row">
      <div class="settings_name">Publisher</div>
      <div class="settings_options">{{ sw.publisher }}</div>
    </div>
    <div class="settings_row">
      <div class="settings_name">License</div>
      <div class="settings_options">MIT</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TouchscreenOverlaySettingsAbout",
  computed: {
    sw: {
      get() {
        return this.$store.state.socket.sw;
      },
    },
  },
};
</script>

<style lang="css" scoped></style>
