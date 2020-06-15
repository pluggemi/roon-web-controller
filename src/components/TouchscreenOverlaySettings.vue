<template lang="html">
  <div data-name="TouchscreenViewSettings" class="overlay">
    <div class="overlay_content">
      <h1>Settings</h1>
      <button
        type="button"
        class="overlay_close_button"
        v-on:click="hide_overlay"
      >
        <svg>
          <use href="#svg_close" />
        </svg>
      </button>
      <div>
        <template v-for="tab in tabs">
          <input
            class="ui_button"
            type="radio"
            name="settings_section_radio"
            v-bind:key="'settings_button_' + tab.name"
            v-bind:id="'settings_section_radio_' + tab.name"
            v-bind:value="tab.component"
            v-model="current_component"
          />
          <label
            v-bind:key="'settings_section_radio_label' + tab.name"
            v-bind:for="'settings_section_radio_' + tab.name"
          >
            {{ tab.name }}
          </label>
        </template>
      </div>
      <component v-bind:is="current_component" />
    </div>
  </div>
</template>

<script>
import TouchscreenOverlaySettingsUi from "@/components/TouchscreenOverlaySettingsUi.vue";
import TouchscreenOverlaySettingsClock from "@/components/TouchscreenOverlaySettingsClock.vue";
export default {
  name: "TouchscreenViewSettings",
  components: {
    TouchscreenOverlaySettingsUi,
    TouchscreenOverlaySettingsClock,
  },
  data: function () {
    return {
      current_component: "TouchscreenOverlaySettingsUi",
      tabs: [
        { name: "UI", component: "TouchscreenOverlaySettingsUi" },
        { name: "Clock", component: "TouchscreenOverlaySettingsClock" },
      ],
    };
  },
  methods: {
    hide_overlay: function () {
      this.$store.commit("SHOW_overlay", {
        overlay_name: "settings",
        show: false,
      });
    },
  },
};
</script>
<style lang="css">
.settings_content {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--AvailableColor);
  margin: 1vh 0;
}
.settings_row {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-top: 1px solid var(--AvailableColor);
  padding: 1vh 1vw;
}
.settings_name {
  font-weight: bold;
  width: 40%;
}
.settings_options {
  width: 60%;
}
</style>
