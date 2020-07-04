<template lang="html">
  <div data-name="TouchscreenOverlaySettingsAbout" class="settings_content">
    <div class="settings_row">
      <div class="text_bold sw_name">
        {{ sw.name }}
      </div>
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
      <div class="settings_options">
        <a
          href="https://opensource.org/licenses/MIT"
          target="_blank"
          rel="noreferrer noopener"
          >MIT</a
        >
      </div>
    </div>
    <div class="settings_row">
      <div class="settings_name">Reload Browser</div>
      <div class="settings_options">
        <button
          type="button"
          onclick="location.reload()"
          class="ui_button settings_button"
        >
          <svg>
            <use href="#svg_refresh" />
          </svg>
        </button>
      </div>
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

<style lang="css" scoped>
.sw_name {
  text-align: center;
  width: 100%;
}
.settings_button {
  width: 5vh;
  height: 5vh;
  min-width: 48px;
  min-height: 48px;
}
</style>
