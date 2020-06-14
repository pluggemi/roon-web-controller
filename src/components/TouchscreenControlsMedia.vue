<template lang="html">
  <div data-name="TouchscreenControlsMedia">
    <ButtonPlayCommand
      class="control_button media_control"
      v-bind:disabled="!current_zone.is_previous_allowed"
      v-bind:command="'previous'"
    ></ButtonPlayCommand>
    <ButtonPlayCommand
      class="control_button media_control"
      v-if="current_zone.is_play_allowed"
      v-bind:command="'play'"
    ></ButtonPlayCommand>
    <ButtonPlayCommand
      class="control_button media_control"
      v-if="current_zone.is_pause_allowed"
      v-bind:command="'pause'"
    ></ButtonPlayCommand>
    <ButtonPlayCommand
      class="control_button media_control"
      v-bind:disabled="!current_zone.is_next_allowed"
      v-bind:command="'next'"
      v-bind:zone_id="current_zone.zone_id"
    ></ButtonPlayCommand>
  </div>
</template>

<script>
export default {
  name: "TouchscreenControlsMedia",
  computed: {
    current_zone: {
      get() {
        return this.$store.state.roon.zone_list[
          this.$store.state.settings.current_zone_id
        ];
      },
    },
  },
};
</script>

<style lang="css" scoped>
.media_control {
  background: none;
  color: var(--AvailableColor);
  fill: currentColor;
  border-radius: 1vh;
  height: 15vh;
  width: 15vw;
  border: none;
  outline: none;
  cursor: pointer;
}
.media_control:disabled {
  color: var(--DisabledColor);
  cursor: not-allowed;
}
.media_control:active {
  color: var(--ActiveColor);
}
</style>
