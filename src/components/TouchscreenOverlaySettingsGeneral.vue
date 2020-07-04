<template lang="html">
  <div data-name="TouchscreenOverlaySettingsGeneral" class="settings_content">
    <div class="settings_row">
      <div class="settings_name">
        Show Background:
      </div>
      <div class="settings_options">
        <span class="settings_checkbox">
          <input
            type="checkbox"
            id="checkbox_show_cover_background"
            v-model="show_cover_background"
          />
          <label for="checkbox_show_cover_background" class="text_bold">
            <svg v-if="show_cover_background === true">
              <use href="#svg_checkbox_true" />
            </svg>
            <svg v-else>
              <use href="#svg_checkbox_false" />
            </svg>
          </label>
        </span>
      </div>
    </div>
    <div class="settings_row">
      <div class="settings_name">
        Use Circle Icons:
      </div>
      <div class="settings_options">
        <span class="settings_checkbox">
          <input
            type="checkbox"
            id="checkbox_use_circle_icons"
            v-model="use_circle_icons"
          />
          <label for="checkbox_use_circle_icons" class="text_bold">
            <svg v-if="use_circle_icons === true">
              <use href="#svg_checkbox_true" />
            </svg>
            <svg v-else>
              <use href="#svg_checkbox_false" />
            </svg>
          </label>
        </span>
      </div>
    </div>
    <div class="settings_row">
      <div class="settings_name">
        Show Track Info in Browser Title:
      </div>
      <div class="settings_options">
        <span class="settings_checkbox">
          <input
            type="checkbox"
            id="checkbox_track_info_in_browser_title"
            v-model="track_info_in_browser_title"
          />
          <label for="checkbox_track_info_in_browser_title" class="text_bold">
            <svg v-if="track_info_in_browser_title === true">
              <use href="#svg_checkbox_true" />
            </svg>
            <svg v-else>
              <use href="#svg_checkbox_false" />
            </svg>
          </label>
        </span>
      </div>
    </div>
    <div class="settings_row">
      <div class="settings_name">
        Now Playing Time:
      </div>
      <div class="settings_options">
        <input
          type="radio"
          name="radio_total_vs_remaining_time"
          id="radio_total_vs_remaining_time_false"
          v-bind:value="false"
          v-model="show_time_remaining"
        />
        <label for="radio_total_vs_remaining_time_false">Total Time</label>

        <input
          type="radio"
          name="radio_total_vs_remaining_time"
          id="radio_total_vs_remaining_time_true"
          v-bind:value="true"
          v-model="show_time_remaining"
        />
        <label for="radio_total_vs_remaining_time_true">Time Remaining</label>
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
    use_circle_icons: {
      get() {
        return this.$store.state.settings.general.use_circle_icons;
      },
      set(value) {
        let payload = {
          option: "use_circle_icons",
          value: value,
        };
        this.$store.commit("SET_general_settings", payload);
      },
    },
    track_info_in_browser_title: {
      get() {
        return this.$store.state.settings.general.track_info_in_browser_title;
      },
      set(value) {
        let payload = {
          option: "track_info_in_browser_title",
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
