<template lang="html">
  <div data-name="TouchscreenOverlaySettingsUi" class="settings_content">
    <div class="settings_row">
      <div class="settings_name">
        Show Background:
      </div>
      <div class="settings_options">
        <input type="checkbox" name="" v-model="show_cover_background" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TouchscreenOverlaySettingsUi",
  computed: {
    show_cover_background: {
      get() {
        return this.$store.state.settings.ui.show_cover_background;
      },
      set(value) {
        this.$store.commit("SHOW_cover_background", value);
      },
    },
  },
};
</script>
