<template lang="html">
  <div data-name="TouchscreenZoneSelect" class="overlay">
    <div class="overlay_content">
      <h1>Select a Zone</h1>
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
        <template v-for="zone in zone_list">
          <input
            type="radio"
            name="radio_zone_select"
            v-bind:key="'radio_zone_select_' + zone.zone_id"
            v-bind:id="'radio_zone_select_' + zone.zone_id"
            v-bind:value="zone.zone_id"
            v-model="current_zone_id"
          />

          <label
            v-bind:key="'label_zone_select_' + zone.zone_id"
            v-bind:for="'radio_zone_select_' + zone.zone_id"
            >{{ zone.display_name }}</label
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TouchscreenZoneSelect",
  computed: {
    zone_list: {
      get() {
        let zone_list = [];
        for (let zone_id in this.$store.state.roon.zone_list) {
          let item = {
            zone_id: zone_id,
            display_name: this.$store.state.roon.zone_list[zone_id]
              .display_name,
          };
          zone_list.push(item);
        }

        zone_list.sort((a, b) => {
          let nameA = a.display_name.toUpperCase();
          let nameB = b.display_name.toUpperCase();
          let c = 0;
          if (nameA > nameB) {
            c = 1;
          } else if (nameA < nameB) {
            c = -1;
          }
          return c;
        });
        return zone_list;
      },
    },
    current_zone_id: {
      get() {
        return this.$store.state.settings.current_zone_id;
      },
      set(value) {
        this.$store.dispatch("SET_current_zone_id", value);
      },
    },
  },
  methods: {
    hide_overlay: function () {
      this.$store.commit("SHOW_overlay", {
        overlay_name: "zone_select",
        show: false,
      });
    },
  },
};
</script>
