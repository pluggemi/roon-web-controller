<template lang="html">
  <div data-name="TouchscreenOverlaySettingsUi" class="settings_content">
    <div class="settings_row">
      <div class="settings_options">
        <span class="settings_checkbox">
          <input
            type="checkbox"
            id="checkbox_show_cover_background"
            v-model="show_cover_background"
          />
          <label for="checkbox_show_cover_background" class="text_bold"
            >Show Background</label
          >
        </span>
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
