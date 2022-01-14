<template lang="html">
  <div data-name="ViewLibrary" class="library_page">
    <ControlsLibraryNav class="nav_controls" />
    <ControlsOverlays class="overlay_controls" />

    <div v-if="library && library.list" class="content">
      <div class="list_title" v-if="library.list.title">
        <div class="text_bold">{{ library.list.title }}</div>
        <div v-if="library.list.subtitle">
          {{ library.list.subtitle }}
        </div>
      </div>
      <LibraryPager class="list_nav" v-if="page_count > 1" />
      <div class="list">
        <template v-for="item in library.items">
          <LibraryItemSearch
            v-if="item.input_prompt"
            v-bind:key="item.item_key"
            v-bind:item="item"
          />
          <LibraryItem
            v-else
            v-bind:key="item.item_key"
            v-bind:item="item"
          />
        </template>
      </div>
      <div class="list_image" v-if="library.list.image_key">
        <ImageCover v-bind:image_key="library.list.image_key" />
      </div>
    </div>

    <div class="now_playing_view_button_container">
      <router-link
        tag="button"
        class="view_button"
        v-bind:to="{ name: 'NowPlaying' }"
      >
        <svg>
          <use href="#svg_chevron_down" />
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script>
import ControlsLibraryNav from "@/components/ControlsLibraryNav.vue";
import ControlsOverlays from "@/components/ControlsOverlays.vue";
import LibraryPager from "@/components/LibraryPager.vue";
import LibraryItem from "@/components/LibraryItem.vue";
import LibraryItemSearch from "@/components/LibraryItemSearch.vue";

export default {
  name: "ViewLibrary",
  components: {
    ControlsLibraryNav,
    ControlsOverlays,
    LibraryPager,
    LibraryItem,
    LibraryItemSearch,
  },
  computed: {
    library: {
      get() {
        return this.$store.state.roon.library;
      },
    },
    page_count: {
      get() {
        return Math.ceil(
          this.$store.state.roon.library.list.count /
            this.$store.state.ui.library_list_count
        );
      },
    },
  },
};
</script>

<style lang="css" scoped>
.library_page {
  display: grid;
  grid-template-columns: 45vw 10vw 45vw;
  grid-template-rows: 10vh 83vh 7vh;
  grid-template-areas:
    "nav_controls . overlay_controls"
    "content content content"
    ". now_playing_view_button_container .";
}
.nav_controls {
  grid-area: nav_controls;
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
.now_playing_view_button_container {
  grid-area: now_playing_view_button_container;
  z-index: 500;
}
.content {
  grid-area: content;
  display: grid;
  grid-template-columns: 50vw 12vw 33vw;
  grid-template-rows: 10vh 73vh;
  grid-template-areas:
    "list_title list_title list_nav"
    "list list list_image";
}
.list_title {
  grid-area: list_title;
  padding-left: 1vw;
  font-size: 3vh;
}
.list_title div {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.list_nav {
  grid-area: list_nav;
  display: flex;
  align-items: center;
  justify-content: center;
}
.list {
  grid-area: list;
  overflow: auto;
}
.list_image {
  grid-area: list_image;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.list_image img {
  max-height: 95%;
  max-width: 95%;
  filter: drop-shadow(1vh 1vh 1vh black);
}

.list_item_info {
  width: 45vw;
  cursor: pointer;
}
</style>
