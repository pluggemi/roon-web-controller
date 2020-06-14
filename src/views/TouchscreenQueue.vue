<template lang="html">
  <div data-name="TouchscreenViewQueue" class="queue_page">
    <div class="now_playing_view_button_container">
      <router-link
        tag="button"
        class="view_button"
        v-bind:to="{ name: 'TouchscreenNowPlaying' }"
        ><svg>
          <use href="#svg_chevron_up" /></svg
      ></router-link>
    </div>
    <div
      v-if="
        current_queue && current_queue.queue && current_queue.queue.length > 0
      "
      class="content"
    >
      <div
        class="list_item"
        v-for="queue_item in current_queue.queue"
        v-bind:key="queue_item.queue_item_id"
      >
        <div class="list_item_image">
          <ImageList
            v-if="queue_item.image_key"
            v-bind:image_key="queue_item.image_key"
          />
        </div>
        <div class="list_item_control">
          <svg>
            <use href="#svg_play" />
          </svg>
        </div>
        <div class="list_item_info">
          <div class="text_bold">
            {{ queue_item.three_line.line1.replace(/\ \/\ /g, ", ") }}
          </div>
          <div>{{ queue_item.three_line.line2.replace(/\ \/\ /g, ", ") }}</div>
          <div>{{ queue_item.three_line.line3.replace(/\ \/\ /g, ", ") }}</div>
          <div>{{ secondsToTime(queue_item.length) }}</div>
        </div>
      </div>
    </div>
    <div v-else class="content queue_list_empty">
      Nothing Queued
    </div>

    <TouchscreenControlsPlaySettings
      v-if="current_zone"
      class="settings_controls"
    />
    <TouchscreenControlsOverlays class="overlay_controls" />
  </div>
</template>

<script>
import TouchscreenControlsOverlays from "@/components/TouchscreenControlsOverlays.vue";
import TouchscreenControlsPlaySettings from "@/components/TouchscreenControlsPlaySettings.vue";
export default {
  name: "TouchscreenViewQueue",
  components: {
    TouchscreenControlsOverlays,
    TouchscreenControlsPlaySettings,
  },
  computed: {
    current_zone: {
      get() {
        return this.$store.state.roon.zone_list[
          this.$store.state.settings.current_zone_id
        ];
      },
    },
    current_queue: {
      get() {
        return this.$store.state.roon.queue_list[
          this.$store.state.settings.current_zone_id
        ];
      },
    },
  },
};
</script>

<style lang="css" scoped>
.queue_page {
  display: grid;
  grid-template-columns: 45vw 10vw 45vw;
  grid-template-rows: 10vh 90vh;
  grid-template-areas:
    "settings_controls now_playing_view_button_container overlay_controls"
    "content content content";
}
.now_playing_view_button_container {
  grid-area: now_playing_view_button_container;
}

.content {
  grid-area: content;
  overflow: auto;
}
.settings_controls {
  grid-area: settings_controls;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.overlay_controls {
  grid-area: overlay_controls;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.queue_list_empty {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4vh;
}

.list_item:first-of-type {
  background: var(--ThemeColor);
}
.list_item:first-of-type .list_item_control svg {
  display: none;
}
</style>
