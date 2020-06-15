<template lang="html">
  <div data-name="TouchscreenOverlaySettingsClock" class="settings_content">
    <div class="settings_row">
      <div class="settings_name">
        Show Clock:
      </div>
      <div class="settings_options">
        <input type="checkbox" name="" v-model="show_clock" />
      </div>
    </div>
    <div class="settings_row">
      <div class="settings_name">
        Clock Position:
      </div>
      <div class="settings_options">
        <input
          type="radio"
          name="radio_clock_position"
          id="radio_clock_position_top_left"
          v-bind:value="'top_left'"
          v-model="clock_position"
        />
        <label class="ui_button" for="radio_clock_position_top_left"
          >Top Left
        </label>

        <input
          type="radio"
          name="radio_clock_position"
          id="radio_clock_position_top_right"
          v-bind:value="'top_right'"
          v-model="clock_position"
        />
        <label class="ui_button" for="radio_clock_position_top_right">
          Top Right
        </label>
        <br />
        <input
          type="radio"
          name="radio_clock_position"
          id="radio_clock_position_bottom_left"
          v-bind:value="'bottom_left'"
          v-model="clock_position"
        />
        <label class="ui_button" for="radio_clock_position_bottom_left">
          Bottom Left
        </label>

        <input
          type="radio"
          name="radio_clock_position"
          id="radio_clock_position_bottom_right"
          v-bind:value="'bottom_right'"
          v-model="clock_position"
        />
        <label class="ui_button" for="radio_clock_position_bottom_right">
          Bottom Right
        </label>
      </div>
    </div>
    <div class="settings_row">
      <div class="settings_name">
        Line 1 format:
      </div>
      <div class="settings_options">
        <input type="text" v-model="format_line1" />
      </div>
    </div>
    <div class="settings_row">
      <div class="settings_name">
        Line 2 format:
      </div>
      <div class="settings_options">
        <input type="text" v-model="format_line2" />
      </div>
    </div>
    <div class="settings_row">
      <div class="settings_name">
        Format Documentation:
      </div>
      <div class="settings_options">
        <a href="https://momentjs.com/docs/#/displaying/format/">Momentjs</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TouchscreenOverlaySettingsClock",
  computed: {
    show_clock: {
      get() {
        return this.$store.state.settings.clock.show_clock;
      },
      set(value) {
        let payload = {
          option: "show_clock",
          value: value,
        };
        this.$store.commit("SET_clock", payload);
      },
    },
    clock_position: {
      get() {
        return this.$store.state.settings.clock.position;
      },
      set(value) {
        let payload = {
          option: "position",
          value: value,
        };
        this.$store.commit("SET_clock", payload);
      },
    },
    format_line1: {
      get() {
        return this.$store.state.settings.clock.format_line1;
      },
      set(value) {
        let payload = {
          option: "format_line1",
          value: value,
        };
        this.$store.commit("SET_clock", payload);
      },
    },
    format_line2: {
      get() {
        return this.$store.state.settings.clock.format_line2;
      },
      set(value) {
        let payload = {
          option: "format_line2",
          value: value,
        };
        this.$store.commit("SET_clock", payload);
      },
    },
  },
};
</script>

<style lang="css" scoped>
a {
  color: var(--AvailableColor);
}
</style>
