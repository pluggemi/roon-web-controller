<template lang="html">
  <div data-name="ControlsPlaySettings">
    <ButtonPlaySetting class="control_button" v-bind:command="'loop'" />
    <ButtonPlaySetting class="control_button" v-bind:command="'shuffle'" />
    <ButtonPlaySetting class="control_button" v-bind:command="'auto_radio'" />
  </div>
</template>

<script>
export default {
  name: "ControlsPlaySettings",
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
