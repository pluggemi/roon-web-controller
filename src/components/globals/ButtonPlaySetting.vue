<template lang="html">
  <button type="button" v-on:click="go_command">
    <svg>
      <use
        v-bind:href="'#svg_' + command + '_' + current_zone.settings[command]"
      />
    </svg>
  </button>
</template>

<script>
export default {
  name: "ButtonPlaySetting",
  props: {
    command: { type: String, required: true },
  },
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
    go_command: function () {
      let payload = {
        command: this.command,
      };
      switch (this.command) {
        case "loop":
          payload.value = "next";
          break;
        case "shuffle":
          payload.value = !this.current_zone.settings.shuffle;
          break;
        case "auto_radio":
          payload.value = !this.current_zone.settings.auto_radio;
          break;
        default:
          break;
      }
      this.$store.dispatch("GO_command", payload);
    },
  },
};
</script>
