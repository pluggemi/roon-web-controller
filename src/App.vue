<template lang="html">
  <div id="app" data-name="app">
    <SvgSpriteMediaControls />
    <SvgSpriteMiscIcons />
    <router-view v-if="sw.paired && sw.paired === true" class="app_content" />
    <p v-else>
      The {{ sw.name }} extension is not enabled. Please use an official Roon
      client to enable it.
    </p>
  </div>
</template>

<script>
import SvgSpriteMediaControls from "@/components/SvgSpriteMediaControls.vue";
import SvgSpriteMiscIcons from "@/components/SvgSpriteMiscIcons.vue";

export default {
  name: "app",
  components: {
    SvgSpriteMediaControls,
    SvgSpriteMiscIcons,
  },
  computed: {
    sw: {
      get() {
        return this.$store.state.socket.sw;
      },
    },
  },
};
</script>

<style lang="css">
.app_content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.svg_sprite {
  display: none;
}
svg {
  height: 100%;
  width: 100%;
}
.text_bold {
  font-weight: bold;
  font-size: 125%;
}
</style>
