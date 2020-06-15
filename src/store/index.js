import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    tmp: {
      session_key: "",
    },
    ui: {
      width: 800,
      height: 480,
      show_zone_select: false,
      show_volume: false,
      show_settings: false,
      library_list_count: 24,
    },
    socket: {
      connected: false,
      message: "",
      error: "",
    },
    settings: {
      current_zone_id: "",
      clock: {
        show_clock: true,
        position: "bottom_right",
        format_line1: "LT",
        format_line2: "LL",
      },
      ui: {
        show_cover_background: true,
        show_time_remaining: false,
      },
    },
    roon: {
      base_url: "",
      queue_list: {},
      zone_list: {},
      library: {},
    },
  },
  mutations: {
    SET_window_size: (state) => {
      state.ui.width = window.innerWidth;
      state.ui.height = window.innerHeight;
    },
    SET_session_key: (state) => {
      let session_key = Math.round(Math.random() * new Date())
        .toString(16)
        .slice(-6);
      state.tmp.session_key = session_key;
    },
    SOCKET_connect: (state) => {
      state.socket.connected = true;
    },
    SOCKET_disconnect: (state) => {
      state.socket.connected = false;
    },
    SOCKET_message: (state, message) => {
      state.socket.message = message;
    },
    SOCKET_error: (state, message) => {
      state.socket.error = message.error;
    },
    SET_current_zone_id: (state, payload) => {
      state.settings.current_zone_id = payload;
    },
    SET_show_zone_select: (state, payload) => {
      state.ui.show_zone_select = payload;
    },
    SET_base_url: (state, payload) => {
      state.roon.base_url = payload;
    },
    SET_queue_list: (state, payload) => {
      state.roon.queue_list = payload;
    },
    SET_zone_list: (state, payload) => {
      state.roon.zone_list = payload;
    },
    SET_library: (state, payload) => {
      state.roon.library = payload;
    },
    SHOW_overlay: (state, payload) => {
      state.ui["show_" + payload.overlay_name] = payload.show;
    },
    SET_clock: (state, payload) => {
      state.settings.clock[payload.option] = payload.value;
    },
    SET_ui: (state, payload) => {
      state.settings.ui[payload.option] = payload.value;
    },
  },
  actions: {
    SOCKET_zone_list: ({ state, commit }, message) => {
      let zone_list = JSON.parse(message);
      commit("SET_zone_list", zone_list);
      if (!zone_list[state.settings.current_zone_id]) {
        commit("SET_current_zone_id", "");
      }
    },
    SOCKET_queue_list: ({ commit }, message) => {
      let queue_list = JSON.parse(message);
      commit("SET_queue_list", queue_list);
    },
    SET_current_zone_id: ({ commit, dispatch }, payload) => {
      commit("SET_current_zone_id", payload);
      let options = {
        command: "home",
      };
      dispatch("GO_browse", options);
    },
    GO_browse: async ({ state, commit }, payload) => {
      let data = {};
      data.options = {
        zone_or_output_id: state.settings.current_zone_id,
        hierarchy: "browse",
        multi_session_key: state.tmp.session_key,
      };
      data.pager = {
        count: state.ui.library_list_count,
      };

      switch (payload.command) {
        case "home":
          data.options.pop_all = true;
          break;
        case "back":
          data.options.pop_levels = 1;
          break;
        case "refresh":
          data.options.refresh_list = true;
          break;
        default:
          break;
      }

      let url = `${state.roon.base_url}/api/browse`;
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      let result = await response.json();
      commit("SET_library", result);
    },
    GO_list: async ({ state, commit }, payload) => {
      let data = {};
      data.options = {
        zone_or_output_id: state.settings.current_zone_id,
        hierarchy: "browse",
        item_key: payload.item_key,
        multi_session_key: state.tmp.session_key,
      };
      data.pager = {
        offset: payload.listoffset || 0,
        count: state.ui.library_list_count,
      };

      let url = `${state.roon.base_url}/api/browse`;
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      let result = await response.json();
      commit("SET_library", result);
    },
    GO_page: async ({ state, commit }, payload) => {
      let offset =
        payload.offset * state.ui.library_list_count +
        state.roon.library.offset;

      let data = {
        hierarchy: "browse",
        count: state.ui.library_list_count,
        offset: offset,
        multi_session_key: state.tmp.session_key,
      };

      let url = `${state.roon.base_url}/api/load`;
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      let result = await response.json();
      commit("SET_library", result);
    },
    GO_search: async ({ state, commit }, payload) => {
      let data = {};
      data.options = {
        zone_or_output_id: state.settings.current_zone_id,
        hierarchy: "browse",
        input: payload.input_value,
        item_key: payload.item_key,
        multi_session_key: state.tmp.session_key,
      };
      data.pager = {
        count: state.ui.library_list_count,
      };

      let url = `${state.roon.base_url}/api/browse`;
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      let result = await response.json();
      commit("SET_library", result);
    },
    GO_command: async ({ state }, payload) => {
      let url = `${state.roon.base_url}/api/cmd?id=${state.settings.current_zone_id}&command=${payload.command}`;
      if (payload.value !== undefined) {
        url += `&value=${payload.value}`;
      }
      await fetch(url);
    },
    GO_volume_mute: async ({ state }, payload) => {
      let url = `${state.roon.base_url}/api/mute?id=${payload.output_id}&mute=${payload.mute}`;
      await fetch(url);
    },
    GO_volume: async ({ state }, payload) => {
      let url = `${state.roon.base_url}/api/volume?id=${payload.output_id}&value=${payload.value}`;
      await fetch(url);
    },
    GO_play_from_here: async ({ state }, payload) => {
      let url = `${state.roon.base_url}/api/play_from_here?id=${state.settings.current_zone_id}&queue_item_id=${payload.queue_item_id}`;
      await fetch(url);
    },
  },
});
