<template lang="html">
  <div data-name="Volume" class="overlay">
    <div class="overlay_content">
      <h1>Volume</h1>
      <button
        type="button"
        class="overlay_close_button"
        v-on:click="hide_overlay"
      >
        <svg>
          <use href="#svg_close" />
        </svg>
      </button>
      <template v-if="current_zone">
        <div
          v-for="output in current_zone.outputs"
          v-bind:key="output.output_id"
        >
          <div class="zone_volume_controls">
            <div class="zone_name">{{ output.display_name }}</div>
            <RangeVolume v-bind:output="output" />
            <div class="volume_value">
              {{ output.volume.value }}
            </div>
            <ButtonVolumeMute
              class="volume_button"
              v-bind:muted="output.volume.is_muted"
              v-bind:output_id="output.output_id"
            />
            <ButtonVolume
              class="volume_button"
              v-bind:command="'minus'"
              v-bind:output_id="output.output_id"
              v-bind:value="output.volume.value - output.volume.step"
            />
            <ButtonVolume
              class="volume_button"
              v-bind:command="'plus'"
              v-bind:output_id="output.output_id"
              v-bind:value="output.volume.value + output.volume.step"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "Volume",
  computed: {
    current_zone: {
      get() {
        return this.$store.state.roon.zone_list[
          this.$store.state.settings.current_zone_id
        ];
      },
    },
  },
  methods: {
    hide_overlay: function () {
      this.$store.commit("SHOW_overlay", {
        overlay_name: "volume",
        show: false,
      });
    },
  },
};
</script>

<style lang="css" scoped>
.zone_name {
  font-size: 3vh;
  min-width: 25%;
}
.zone_volume_controls {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.volume_button {
  background: none;
  color: var(--AvailableColor);
  fill: currentColor;
  border-radius: 1vh;
  border: none;
  outline: none;
  height: 10vh;
  width: 10vh;
  cursor: pointer;
}
.volume_button:active {
  background: var(--ActiveColor);
}
.volume_value {
  font-size: 3vh;
}
</style>
