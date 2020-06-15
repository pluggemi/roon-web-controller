/*
The MIT License (MIT)
=====================

Copyright (c) 2020 Mike Plugge

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* eslint-disable no-console */

"use strict";

const sw = {};
sw.name = "Roon Web Controller";
sw.version = "2.0.0-alpha.0";
sw.publisher = "Mike Plugge";

const setting = {};
setting.roon = {};
// TODO: Set these with environmental settings to support docker
setting.roon.host = "";
setting.roon.port = 9100; // default port is 9100
// end TODO
setting.express = {};
if (process.env.NODE_ENV === "development") {
  setting.express.port = 10000;
  setting.express.public = "/public";
} else {
  setting.express.port = 8080;
  setting.express.public = "../dist";
}

const health = {};
// TODO: environmental setting to enable/disable health
//// TODO: environment setting to set health port
health.port = 9090;
health.express = "initializing";
health.roon = "initializing";
health.socketio = "initializing";

const state = {};
state.queue_list = {};
state.zone_list = {};

const api = {};
api.socketio = "";
api.roon = "";
api.roon_browse = "";
api.roon_image = "";
api.roon_status = "";
api.roon_transport = "";

function setupExpress() {
  const express = require("express");
  const http = require("http");
  const app = express();
  const server = http.createServer(app);
  const body_parser = require("body-parser");
  const morgan = require("morgan");

  // Setup express body_parser
  app.use(body_parser.json());

  // Setup httpd style logging
  if (process.env.NODE_ENV !== "development") {
    app.use(morgan("combined"));
  }

  // Setup static file hosting
  app.use(express.static(setting.express.public));

  // Setup server headers
  app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // Setup static routes
  app.get("/", (req, res) => {
    res.sendFile(__dirname + setting.express.public + "/index.html");
  });

  app.get("/api/img", (req, res) => {
    let widthString = req.query.width;
    let heightString = req.query.height;
    let width = 480;
    let height = 480;
    let original = false;

    if (widthString) {
      width = parseInt(widthString);
    }

    if (heightString) {
      height = parseInt(heightString);
    }

    if (!(widthString && heightString)) {
      original = true;
    }

    if (req.query.id) {
      res.type("image/jpeg");
      res.set("Content-disposition", "inline; ");
      roonGetImage(
        { id: req.query.id, width: width, height: height, original: original },
        (data) => {
          res.send(data);
        }
      );
    } else {
      res.sendStatus(204);
    }
  });

  app.get("/api/cmd", (req, res) => {
    let zone_id = req.query.id;
    let command = req.query.command;
    let value = req.query.value;

    if (zone_id !== undefined && command !== undefined) {
      switch (command) {
        case "previous":
        case "next":
        case "playpause":
        case "play":
        case "pause":
        case "stop":
          api.roon_transport.control(zone_id, command);
          break;

        case "shuffle":
        case "loop":
        case "auto_radio":
          if (value !== undefined) {
            let settings = {};
            settings[command] = value;
            api.roon_transport.change_settings(zone_id, settings);
          }
          break;

        default:
          break;
      }
    }
    res.sendStatus(204);
  });

  app.get("/api/volume", (req, res) => {
    let output_id = req.query.id;
    let value = parseInt(req.query.value) || 0;

    if (output_id && value !== 0) {
      api.roon_transport.change_volume(output_id, "absolute", value);
    }

    res.sendStatus(204);
  });

  app.get("/api/mute", (req, res) => {
    if (req.query.id) {
      if (req.query.mute === "true") {
        api.roon_transport.mute(req.query.id, "mute");
      } else {
        api.roon_transport.mute(req.query.id, "unmute");
      }
    }
    res.sendStatus(204);
  });

  app.post("/api/browse", (req, res) => {
    res.set("Content-Type", "application/json");
    res.set("Cache-Control", "no-cache");
    roonLibraryBrowse(req.body, (payload) => {
      res.send(payload);
    });
  });

  app.post("/api/load", (req, res) => {
    res.set("Content-Type", "application/json");
    res.set("Cache-Control", "no-cache");
    roonLibraryLoad(req.body, (payload) => {
      res.send(payload);
    });
  });

  app.get("/api/queue_list", (req, res) => {
    res.json(state.queue_list);
  });

  app.get("/api/zone_list", (req, res) => {
    res.json(state.zone_list);
  });

  app.get("/api/play_from_here", (req, res) => {
    if (req.query.id && req.query.queue_item_id) {
      api.roon_transport.play_from_here(
        req.query.id,
        req.query.queue_item_id,
        (msg) => console.log(msg)
      );
    }
    res.status(204);
  });

  // Start Server
  server.listen(setting.express.port, () => {
    console.log(sw.name + " listening on port " + setting.express.port);
    health.express = "ready";
    setupSocketIO(server);
  });
}

function setupSocketIO(server) {
  api.socketio = require("socket.io").listen(server);

  // Add sockets
  api.socketio.on("connection", () => {
    api.socketio.emit("zone_list", JSON.stringify(state.zone_list));
    api.socketio.emit("queue_list", JSON.stringify(state.queue_list));
  });
  health.socketio = "ready";
}

function setupRoon() {
  const RoonApi = require("node-roon-api");
  const RoonApiImage = require("node-roon-api-image");
  const RoonApiStatus = require("node-roon-api-status");
  const RoonApiTransport = require("node-roon-api-transport");
  const RoonApiBrowse = require("node-roon-api-browse");

  api.roon = new RoonApi({
    extension_id: "com.pluggemi.roonapi",
    display_name: sw.name,
    display_version: sw.version,
    publisher: sw.publisher,
    log_level: "none",
    email: "masked",
    website: "https://github.com/pluggemi/roon-web-controller",
    core_paired: (core) => {
      api.roon_browse = core.services.RoonApiBrowse;
      api.roon_image = core.services.RoonApiImage;
      api.roon_transport = core.services.RoonApiTransport;

      api.roon_transport.subscribe_zones((response, data) => {
        if (response == "Subscribed") {
          data.zones.forEach((zone) => {
            try {
              state.zone_list[zone.zone_id] = zone;
              roonGetZoneQueue(zone.zone_id);
            } catch (err) {
              console.error(err);
            }
          });
        } else if (response == "Changed") {
          if (data.zones_removed) {
            data.zones_removed.forEach((zone_id) => {
              try {
                delete state.zone_list[zone_id];
                delete state.queue_list[zone_id];
              } catch (err) {
                console.error(err);
              }
            });
          }
          if (data.zones_added) {
            data.zones_added.forEach((zone) => {
              try {
                state.zone_list[zone.zone_id] = zone;
                roonGetZoneQueue(zone.zone_id);
              } catch (err) {
                console.error(err);
              }
            });
          }
          if (data.zones_changed) {
            data.zones_changed.forEach((zone) => {
              try {
                state.zone_list[zone.zone_id] = zone;
              } catch (err) {
                console.error(err);
              }
            });
          }
          api.socketio.emit("zone_list", JSON.stringify(state.zone_list));
        }
      });
    },
    core_unpaired: () => {},
  });

  api.roon_status = new RoonApiStatus(api.roon);
  api.roon_status.set_status("Extension enabled", false);

  api.roon.init_services({
    required_services: [RoonApiTransport, RoonApiImage, RoonApiBrowse],
    provided_services: [api.roon_status],
  });
  if (setting.roon.host !== "" || setting.roon.host === undefined) {
    api.roon.ws_connect({
      host: setting.roon.host,
      port: setting.roon.port || 9100,
      onclose: () => setTimeout(setupRoon, 1000 * 3),
    });
  } else {
    api.roon.start_discovery();
  }

  health.roon = "ready";
}

function roonGetZoneQueue(zone_id) {
  api.roon_transport.subscribe_queue(zone_id, 100, (response, data) => {
    if (response === "Subscribed") {
      state.queue_list[zone_id] = {};
      state.queue_list[zone_id].queue = data.items;
    } else if (response === "Changed") {
      data.changes.forEach((change) => {
        if (change.operation === "remove") {
          try {
            delete state.queue_list[zone_id];
          } catch (err) {
            console.error(err);
          }
        }
        if (change.operation === "insert") {
          try {
            state.queue_list[zone_id] = {};
            state.queue_list[zone_id].queue = change.items;
          } catch (err) {
            console.error(err);
          }
        }
      });
    }
    api.socketio.emit("queue_list", JSON.stringify(state.queue_list));
  });
}

function roonGetImage(options, cb) {
  if (options.original === true) {
    try {
      api.roon_image.get_image(
        options.id,
        { format: "image/jpeg" },
        (cb_, contentType, body) => {
          cb(body);
        }
      );
    } catch (err) {
      console.error(err);
    }
  } else {
    try {
      api.roon_image.get_image(
        options.id,
        {
          scale: "fit",
          width: options.width,
          height: options.height,
          format: "image/jpeg",
        },
        (cb_, contentType, body) => {
          cb(body);
        }
      );
    } catch (err) {
      console.error(err);
    }
  }
}

function roonLibraryBrowse(data, cb) {
  api.roon_browse.browse(data.options, (err, payload) => {
    if (err) {
      console.log(err, payload);
      cb({});
      return;
    }

    if (payload.action == "list") {
      let listoffset = 0;
      if (payload.list.display_offset > 0) {
        listoffset = payload.list.display_offset;
      }
      api.roon_browse.load(
        {
          hierarchy: "browse",
          count: data.pager.count,
          offset: listoffset,
          multi_session_key: data.options.multi_session_key,
        },
        (error, payload) => {
          cb(payload);
        }
      );
    } else {
      console.log(payload.action);
    }
  });
}

function roonLibraryLoad(options, cb) {
  api.roon_browse.load(
    {
      hierarchy: "browse",
      count: options.count,
      offset: options.offset,
      multi_session_key: options.multi_session_key,
    },
    (error, payload) => {
      cb(payload);
    }
  );
}

function healthCheck() {
  const express = require("express");
  const http = require("http");
  const app = express();
  const server = http.createServer(app);

  var os = require("os");

  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === "IPv4" && !address.internal) {
        addresses.push(address.address);
      }
    }
  }

  // Setup health check endpoint
  app.get("/live", (req, res) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    if (health.express === "ready") {
      res.sendStatus(200);
    } else {
      res.sendStatus(503);
    }
  });
  app.get("/ready", (req, res) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    if (
      health.roon === "ready" &&
      health.express === "ready" &&
      health.socketio === "ready"
    ) {
      res.sendStatus(200);
    } else {
      res.sendStatus(503);
    }
  });
  app.get("/health", (req, res) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    let item = {};
    item.app = {};
    item.app.name = sw.name;
    item.app.version = sw.version;
    item.app.address = addresses;
    item.health = {};
    item.health.roon = health.roon;
    item.health.express = health.express;
    item.health.socketio = health.socketio;

    res.json(item);
  });

  // Start Server
  server.listen(health.port, () => {
    console.log(sw.name + " health checks listening on port " + health.port);
  });
}

function init() {
  try {
    process.chdir(__dirname);
    healthCheck();
    setupExpress();
    setupRoon();
  } catch (err) {
    console.error(err);
  }
}

init();
