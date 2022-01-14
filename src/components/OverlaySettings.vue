<template lang="html">
  <div data-name="OverlaySettings" class="overlay">
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
import OverlaySettingsGeneral from "@/components/OverlaySettingsGeneral.vue";
import OverlaySettingsClock from "@/components/OverlaySettingsClock.vue";
import OverlaySettingsAbout from "@/components/OverlaySettingsAbout.vue";
export default {
  name: "OverlaySettings",
  components: {
    OverlaySettingsGeneral,
    OverlaySettingsClock,
    OverlaySettingsAbout,
  },
  data: function () {
    return {
      current_component: "OverlaySettingsGeneral",
      tabs: [
        { name: "General", component: "OverlaySettingsGeneral" },
        { name: "Clock", component: "OverlaySettingsClock" },
        { name: "About", component: "OverlaySettingsAbout" },
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
  align-items: center;
  width: 100%;
  border-top: 1px solid var(--AvailableColor);
  padding: 1vh 1vw;
}
.settings_name {
  font-weight: bold;
  font-size: 125%;
  width: 50%;
  /* text-align: right; */
}
.settings_options {
  width: 50%;
}
.settings_checkbox input[type="checkbox"] {
  display: none;
}
.settings_checkbox input[type="checkbox"] + label {
  width: 100%;
  cursor: pointer;
  font-size: 125%;
}

.settings_checkbox input[type="checkbox"]:checked + label {
  color: var(--ActiveColor);
}
.settings_checkbox input[type="checkbox"] + label svg {
  fill: currentColor;
  height: 3vh;
  width: 3vh;
}
</style>
