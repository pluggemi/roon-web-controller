<template lang="html">
  <div data-name="LibraryPager">
    <button
      type="button"
      class="list_nav_button"
      v-bind:disabled="current_page <= 1"
      v-on:click="go_page(-1)"
    >
      <svg>
        <use href="#svg_chevron_left" />
      </svg>
    </button>
    <div></div>
    <div>page {{ current_page }} of {{ page_count }}</div>
    <div>
      <button
        type="button"
        class="list_nav_button"
        v-bind:disabled="current_page >= page_count"
        v-on:click="go_page(1)"
      >
        <svg>
          <use href="#svg_chevron_right" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LibraryPager",
  computed: {
    page_count: {
      get() {
        return Math.ceil(
          this.$store.state.roon.library.list.count /
            this.$store.state.ui.library_list_count
        );
      },
    },
    current_page: {
      get() {
        return (
          Math.ceil(
            this.$store.state.roon.library.offset /
              this.$store.state.ui.library_list_count
          ) + 1
        );
      },
    },
  },
  methods: {
    go_page: function (offset) {
      let options = {
        offset: offset,
      };
      this.$store.dispatch("GO_page", options);
    },
  },
};
</script>

<style lang="css" scoped>
.list_nav_button {
  background: none;
  color: var(--AvailableColor);
  fill: currentColor;
  outline: none;
  border: none;
  height: 10vh;
  width: 10vh;
  cursor: pointer;
}
.list_nav_button:disabled {
  color: var(--DisabledColor);
  cursor: not-allowed;
}
</style>
