<template lang="html">
  <div data-name="TouchscreenOverlaySettingsGeneral" class="settings_content">
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
    <div class="settings_row">
      <div class="settings_options">
        <span class="settings_checkbox">
          <input
            type="checkbox"
            id="checkbox_show_time_remaining"
            v-model="show_time_remaining"
          />
          <label for="checkbox_show_time_remaining" class="text_bold"
            >Show Play Time Remaining</label
          >
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TouchscreenOverlaySettingsGeneral",
  computed: {
    show_cover_background: {
      get() {
        return this.$store.state.settings.general.show_cover_background;
      },
      set(value) {
        let payload = {
          option: "show_cover_background",
          value: value,
        };
        this.$store.commit("SET_general_settings", payload);
      },
    },
    show_time_remaining: {
      get() {
        return this.$store.state.settings.general.show_time_remaining;
      },
      set(value) {
        let payload = {
          option: "show_time_remaining",
          value: value,
        };
        this.$store.commit("SET_general_settings", payload);
      },
    },
  },
};
</script>
