<template lang="html">
  <form
    data-name="FormLibrarySearch"
    action="submit"
    v-on:submit.prevent="go_search()"
  >
    <input
      type="search"
      v-bind:placeholder="item.input_prompt.prompt"
      v-model="input_value"
    />
    <input
      type="submit"
      v-bind:value="item.input_prompt.action"
      v-on:click.prevent="go_search()"
    />
  </form>
</template>

<script>
export default {
  name: "FormLibrarySearch",
  data: function () {
    return {
      input_value: "",
    };
  },
  props: {
    item: { type: Object, required: true },
  },
  methods: {
    go_search: function () {
      let data = {
        item_key: this.item.item_key,
        input_value: this.input_value,
      };
      if (this.input_value !== "") {
        this.$store.dispatch("GO_search", data);
      }
    },
  },
};
</script>
<style lang="css" scoped>
input[type="search"] {
  width: 80%;
}
</style>
