<template lang="html">
  <div data-name="SelectLayout" class="select_layout_page">
    <h1>Select a Layout</h1>
    <div class="select_layout_buttons">
      <router-link
        class="ui_button"
        tag="button"
        v-for="layout in layout_list"
        v-bind:key="layout.route"
        v-bind:to="{ name: layout.route }"
        >{{ layout.name }}</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectLayout",
  data: function () {
    return {
      layout_list: [
        { route: "Touchscreen", name: "Touchscreen" },
      ],
    };
  },
};
</script>

<style lang="css" scoped>
.select_layout_page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.select_layout_buttons {
  width: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.ui_button {
  color: var(--BaseColor);
  background-color: var(--AvailableColor);
  text-decoration: none;
  display: inline-block;
  margin: 1vh 1vw;
  padding: 1vh 1vw;
  border-radius: 1vh;
  border: none;
  outline: none;
  cursor: pointer;
  filter: drop-shadow(1vh 1vh 1vh black);
}
h1 {
  font-size: 200%;
}
</style>
