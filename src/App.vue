<template lang="html">
  <div id="app" data-name="app">
    <SvgSpriteMediaControlsCircle
      v-if="settings.general.use_circle_icons === true"
    />
    <SvgSpriteMediaControlsDefault v-else />
    <SvgSpriteMiscIcons />
    <AppDesktopNotifications />
    <AppBrowserTitle />
    <router-view v-if="sw.paired && sw.paired === true" class="app_content" />
    <p v-else>
      The {{ sw.name }} extension is not enabled. Please use an official Roon
      client to enable it.
    </p>
  </div>
</template>

<script>
import SvgSpriteMediaControlsDefault from "@/components/SvgSpriteMediaControlsDefault.vue";
import SvgSpriteMediaControlsCircle from "@/components/SvgSpriteMediaControlsCircle.vue";
import SvgSpriteMiscIcons from "@/components/SvgSpriteMiscIcons.vue";
import AppDesktopNotifications from "@/components/AppDesktopNotifications.vue";
import AppBrowserTitle from "@/components/AppBrowserTitle.vue";

export default {
  name: "app",
  components: {
    SvgSpriteMediaControlsDefault,
    SvgSpriteMediaControlsCircle,
    SvgSpriteMiscIcons,
    AppDesktopNotifications,
    AppBrowserTitle,
  },
  computed: {
    sw: {
      get() {
        return this.$store.state.socket.sw;
      },
    },
    settings: {
      get() {
        return this.$store.state.settings;
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
a {
  color: var(--AvailableColor);
}
</style>
