<template lang="html">
  <svg class="svg_sprite">
    <symbol id="svg_back" viewBox="0 0 24 24">
      <path d="M20 9v6h-8v4.84L4.16 12 12 4.16V9h8z" />
    </symbol>
    <symbol id="svg_home" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
    </symbol>
    <symbol id="svg_refresh" viewBox="0 0 24 24">
      <path
        d="M17.65 6.35A7.958 7.958 0 0012 4a8 8 0 00-8 8 8 8 0 008 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18a6 6 0 01-6-6 6 6 0 016-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
      />
    </symbol>
    <symbol id="svg_close" viewBox="0 0 24 24">
      <path
        d="M19 3H5a2 2 0 00-2 2V19a2 2 0 002 2H19a2 2 0 002-2V5a2 2 0 00-2-2m-3.4 14L12 13.4 8.4 17 7 15.6l3.6-3.6L7 8.4 8.4 7l3.6 3.6L15.6 7 17 8.4 13.4 12l3.6 3.6-1.4 1.4z"
      />
    </symbol>
    <symbol id="svg_chevron_up" viewBox="0 0 24 24">
      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
    </symbol>
    <symbol id="svg_chevron_down" viewBox="0 0 24 24">
      <path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42z" />
    </symbol>
    <symbol id="svg_chevron_left" viewBox="0 0 24 24">
      <path d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42z" />
    </symbol>
    <symbol id="svg_chevron_right" viewBox="0 0 24 24">
      <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
    </symbol>

    <symbol id="svg_library" viewBox="0 0 24 24">
      <path
        d="M4 6H2v14a2 2 0 002 2h14v-2H4M18 7h-3v5.5a2.5 2.5 0 01-2.5 2.5 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5c.57 0 1.08.19 1.5.5V5h4m2-3H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2z"
      />
    </symbol>
    <symbol id="svg_now_playing" viewBox="0 0 24 24">
      <path
        d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
      />
    </symbol>
    <symbol id="svg_queue" viewBox="0 0 24 24">
      <path
        d="M15 6H3v2h12V6m0 4H3v2h12v-2M3 16h8v-2H3v2M17 6v8.18c-.31-.11-.65-.18-1-.18a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V8h3V6h-5z"
      />
    </symbol>

    <symbol id="svg_volume" viewBox="0 0 24 24">
      <path
        d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.84-5 6.7v2.07c4-.91 7-4.49 7-8.77 0-4.28-3-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4M3 9v6h4l5 5V4L7 9H3z"
      />
    </symbol>
    <symbol id="svg_zone_select" viewBox="0 0 24 24">
      <path
        d="M2 11v2c5 0 9 4 9 9h2c0-6.1-4.9-11-11-11m18-9H10c-1.1 0-2 .9-2 2v6.5c1 .5 1.9 1.2 2.7 1.9.9-1.4 2.5-2.4 4.3-2.4 2.8 0 5 2.2 5 5s-2.2 5-5 5h-.2c.1.7.2 1.3.2 2h5c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-5 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m0 10c-.2 0-.5 0-.7-.1-.5-1.5-1.2-2.8-2.1-4 .4-1.1 1.5-2 2.8-2 1.7 0 3 1.3 3 3S16.7 18 15 18M2 15v2c2.8 0 5 2.2 5 5h2c0-3.9-3.1-7-7-7m0 4v3h3c0-1.7-1.3-3-3-3"
      />
    </symbol>
    <symbol id="svg_settings" viewBox="0 0 24 24">
      <path
        d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0014 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"
      />
    </symbol>

    <symbol id="svg_loop_loop" viewBox="0 0 24 24">
      <path d="M17 17H7v-3l-4 4 4 4v-3h12v-6h-2M7 7h10v3l4-4-4-4v3H5v6h2V7z" />
    </symbol>
    <symbol id="svg_loop_loop_one" viewBox="0 0 24 24">
      <path
        d="M13 15V9h-1l-2 1v1h1.5v4m5.5 2H7v-3l-4 4 4 4v-3h12v-6h-2M7 7h10v3l4-4-4-4v3H5v6h2V7z"
      />
    </symbol>
    <symbol id="svg_loop_disabled" viewBox="0 0 24 24">
      <path
        d="M2 5.27L3.28 4 20 20.72 18.73 22l-3-3H7v3l-4-4 4-4v3h6.73L7 10.27V11H5V8.27l-3-3M17 13h2v4.18l-2-2V13m0-8V2l4 4-4 4V7H8.82l-2-2H17z"
      />
    </symbol>

    <symbol id="svg_shuffle_true" viewBox="0 0 24 24">
      <path
        d="M17 3l5.25 4.5L17 12l5.25 4.5L17 21v-3h-2.74l-2.82-2.82 2.12-2.12L15.5 15H17V9h-1.5l-9 9H2v-3h3.26l9-9H17V3M2 6h4.5l2.82 2.82-2.12 2.12L5.26 9H2V6z"
      />
    </symbol>
    <symbol id="svg_shuffle_false" viewBox="0 0 24 24">
      <path d="M16 4.5V7H5v2h11v2.5L19.5 8M16 12.5V15H5v2h11v2.5l3.5-3.5" />
    </symbol>

    <symbol id="svg_auto_radio_true" viewBox="0 0 24 24">
      <path
        d="M20 6a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V8c0-.85.53-1.58 1.28-1.87L15.71 1l.76 1.83L8.83 6H20m0 2H4v4h12v-2h2v2h2V8M7 14a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3z"
      />
    </symbol>
    <symbol id="svg_auto_radio_false" viewBox="0 0 24 24">
      <path
        d="M1 4.27l2 2c-.6.34-1 .99-1 1.73v12a2 2 0 002 2h14.73l2 2L22 22.72 2.28 3 1 4.27M20 6H8.83l7.64-3.17L15.71 1 6.59 4.76 9.82 8H20v4h-2v-2h-2v2h-2.18L22 20.18V8a2 2 0 00-2-2M4 8h.73l4 4H4V8m3 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"
      />
    </symbol>

    <symbol id="svg_volume_mute_true" viewBox="0 0 24 24">
      <path
        d="M3 9h4l5-5v16l-5-5H3V9m13.59 3L14 9.41 15.41 8 18 10.59 20.59 8 22 9.41 19.41 12 22 14.59 20.59 16 18 13.41 15.41 16 14 14.59 16.59 12z"
      />
    </symbol>
    <symbol id="svg_volume_mute_false" viewBox="0 0 24 24">
      <path
        d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.84-5 6.7v2.07c4-.91 7-4.49 7-8.77 0-4.28-3-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4M3 9v6h4l5 5V4L7 9H3z"
      />
    </symbol>
    <symbol id="svg_volume_minus" viewBox="0 0 24 24">
      <path d="M3 9h4l5-5v16l-5-5H3V9m11 2h8v2h-8v-2z" />
    </symbol>
    <symbol id="svg_volume_plus" viewBox="0 0 24 24">
      <path d="M3 9h4l5-5v16l-5-5H3V9m11 2h3V8h2v3h3v2h-3v3h-2v-3h-3v-2z" />
    </symbol>
  </svg>
</template>

<script>
export default {
  name: "SvgSpriteMiscIcons",
};
</script>
