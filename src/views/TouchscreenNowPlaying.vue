<template lang="html">
  <div data-name="TouchscreenNowPlaying">
    <div
      v-if="current_zone && current_zone.now_playing"
      class="now_playing_page"
    >
      <div class="library_view_button_container">
        <router-link
          tag="button"
          class="view_button"
          v-bind:to="{ name: 'TouchscreenLibrary' }"
        >
          <svg>
            <use href="#svg_chevron_up" />
          </svg>
        </router-link>
      </div>
      <div class="cover_art_container">
        <ImageCover
          class="cover_art"
          v-if="current_zone.now_playing.image_key"
          v-bind:image_key="current_zone.now_playing.image_key"
        />
      </div>
      <div class="song_info_container">
        <div class="text_bold">
          {{
            current_zone.now_playing.three_line.line1.replace(/\ \/\ /g, ", ")
          }}
        </div>
        <div>
          {{
            current_zone.now_playing.three_line.line2.replace(/\ \/\ /g, ", ")
          }}
        </div>
        <div>
          {{
            current_zone.now_playing.three_line.line3.replace(/\ \/\ /g, ", ")
          }}
        </div>
      </div>
      <div class="control_container">
        <TouchscreenControlsMedia class="media_control_container" />
        <template v-if="current_zone.is_seek_allowed === true">
          <input
            class="range_track_seek"
            type="range"
            min="0"
            max="100"
            v-bind:value="
              Math.floor(
                (current_zone.now_playing.seek_position /
                  current_zone.now_playing.length) *
                  100
              )
            "
          />
          <div class="song_position_container">
            <div>
              {{ secondsToTime(current_zone.now_playing.seek_position) }}
            </div>
            <div v-if="show_time_remaining === true">
              {{
                secondsToTime(
                  current_zone.now_playing.length -
                    current_zone.now_playing.seek_position
                )
              }}
            </div>
            <div v-else>
              {{ secondsToTime(current_zone.now_playing.length) }}
            </div>
          </div>
        </template>
        <TouchscreenControlsOverlays class="overlay_controls" />
      </div>
      <div class="queue_view_button_container">
        <router-link
          tag="button"
          class="view_button"
          v-bind:to="{ name: 'TouchscreenQueue' }"
          ><svg>
            <use href="#svg_chevron_down" /></svg
        ></router-link>
      </div>
      <UiClock
        v-if="clock.show_clock"
        v-bind:class="'clock_' + clock.position"
      />
    </div>
    <div v-else class="not_playing_page">
      <div class="library_view_button_container">
        <router-link
          tag="button"
          class="view_button"
          v-bind:to="{ name: 'TouchscreenLibrary' }"
        >
          <svg>
            <use href="#svg_chevron_up" />
          </svg>
        </router-link>
      </div>
      <div class="not_playing_info">
        Nothing Playing
      </div>
      <TouchscreenControlsOverlays class="not_playing_control_container" />
      <div class="queue_view_button_container">
        <router-link
          tag="button"
          class="view_button"
          v-bind:to="{ name: 'TouchscreenQueue' }"
          ><svg>
            <use href="#svg_chevron_down" /></svg
        ></router-link>
      </div>
      <UiClock v-if="clock.show_clock" class="clock_not_playing" />
    </div>
  </div>
</template>

<script>
import TouchscreenControlsMedia from "@/components/TouchscreenControlsMedia.vue";
import TouchscreenControlsOverlays from "@/components/TouchscreenControlsOverlays.vue";

export default {
  name: "TouchscreenViewNowPlaying",
  components: {
    TouchscreenControlsMedia,
    TouchscreenControlsOverlays,
  },
  computed: {
    current_zone: {
      get() {
        return this.$store.state.roon.zone_list[
          this.$store.state.settings.current_zone_id
        ];
      },
    },
    clock: {
      get() {
        return this.$store.state.settings.clock;
      },
    },
    show_time_remaining: {
      get() {
        return this.$store.state.settings.general.show_time_remaining;
      },
    },
  },
};
</script>

<style lang="css" scoped>
.now_playing_page {
  display: grid;
  grid-template-columns: 45vw 10vw 45vw;
  grid-template-rows: 7vh 50vh 36vh 7vh;
  grid-template-areas:
    "clock_top_left library_view_button_container clock_top_right"
    "cover_art_container song_info_container song_info_container"
    "cover_art_container control_container control_container"
    "clock_bottom_left queue_view_button_container clock_bottom_right";
}
.not_playing_page {
  display: grid;
  grid-template-columns: 45vw 10vw 45vw;
  grid-template-rows: 7vh 40vh 6vh 40vh 7vh;
  grid-template-areas:
    ". library_view_button_container ."
    "not_playing_info not_playing_info not_playing_info"
    ". clock_not_playing ."
    "not_playing_control_container not_playing_control_container not_playing_control_container"
    ". queue_view_button_container .";
}

.cover_art_container {
  grid-area: cover_art_container;
  display: flex;
  justify-content: center;
  align-items: center;
}
.song_info_container {
  grid-area: song_info_container;
  font-size: 3vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.song_info_container div {
  margin-bottom: 3vh;
}
.song_info_container div:first-of-type {
  margin-bottom: 5vh;
}
.control_container {
  grid-area: control_container;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.overlay_controls {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.media_control_container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.range_track_seek {
  width: 50vw;
}
.cover_art {
  max-height: 95%;
  max-width: 95%;
  filter: drop-shadow(1vh 1vh 1vh black);
}
.song_position_container {
  width: 90%;
  display: flex;
  justify-content: space-between;
  font-size: small;
}
.library_view_button_container {
  grid-area: library_view_button_container;
}
.queue_view_button_container {
  grid-area: queue_view_button_container;
}
.not_playing_info {
  grid-area: not_playing_info;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4vh;
}
.not_playing_control_container {
  grid-area: not_playing_control_container;
  display: flex;
  justify-content: center;
  align-items: center;
}
.clock_top_left {
  grid-area: clock_top_left;
}
.clock_top_right {
  grid-area: clock_top_right;
}
.clock_bottom_left {
  grid-area: clock_bottom_left;
}
.clock_bottom_right {
  grid-area: clock_bottom_right;
}
.clock_not_playing {
  grid-area: clock_not_playing;
}
</style>
