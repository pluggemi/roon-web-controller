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
import SvgSpriteMediaControlsDefault from "@/components/SVG/MediaControlsDefault.vue";
import SvgSpriteMediaControlsCircle from "@/components/SVG/MediaControlsCircle.vue";
import SvgSpriteMiscIcons from "@/components/SVG/MiscIcons.vue";
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

