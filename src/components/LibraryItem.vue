<template lang="html">
  <div
    class="list_item"
    data-name="LibraryItem"
    v-on:click="go_list(item.item_key)"
  >
    <div class="list_item_image">
      <ImageList v-if="item.image_key" v-bind:image_key="item.image_key" />
    </div>
    <div class="list_item_info">
      <div class="text_bold">{{ item.title }}</div>
      <div v-if="item.subtitle">
        {{ item.subtitle.replace(/\ \/\ /g, ", ") }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LibraryItem",
  props: {
    item: { type: Object, required: true },
  },
  methods: {
    go_list: function (item_key) {
      let options = {
        item_key: item_key,
      };
      this.$store.dispatch("GO_list", options);
    },
  },
};
</script>
<style lang="css" scoped>
.list_item {
  cursor: pointer;
}
.list_item:hover {
  background: var(--ThemeColor);
}
</style>
