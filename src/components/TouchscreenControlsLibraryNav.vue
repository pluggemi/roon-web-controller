<template lang="html">
  <div data-name="TouchscreenControlsLibraryNav">
    <ButtonLibraryNav
      class="control_button"
      v-if="library && library.list && library.list.level !== undefined"
      v-bind:command="'back'"
      v-bind:disabled="library.list.level === 0"
    />
    <ButtonLibraryNav class="control_button" v-bind:command="'home'" />
    <ButtonLibraryNav class="control_button" v-bind:command="'refresh'" />
  </div>
</template>

<script>
export default {
  name: "TouchscreenControlsLibraryNav",
  computed: {
    library: {
      get() {
        return this.$store.state.roon.library;
      },
    },
  },
};
</script>
