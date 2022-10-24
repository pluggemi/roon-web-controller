# Roon Web Controller 2.0.0

NOTE: This is alpha software. There is missing functionality.

## What works

Touchscreen layout

- Landscape and Portrait view
- Library functionality
- Now Playing functionality
- Clock, with settings for enabled, position, and format
  - Browser language detection for localized clock format
- Queue display and "play from here"
- Volume controls overlay
- Zone selection overlay
- Loop, Shuffle, and Radio controls on the Queue page

## What does not work

- Settings overlay is in progress, partial settings controls
- Track seek controls

## Known Issues
- Volume overlay does not display when a zone with a fixed volume is selected (such as a Chromecast or an AppleTV).
- Volume overlay only works if volume.type is number, should work with volume.type = incremental, and possible UI update for volume.type = db. [reference this post](https://community.roonlabs.com/t/roon-extension-roon-web-controller-v1-2-0/28412/362?u=mike_plugge)
- Song information does not display correctly in portrait view.  It overflows into other view elements.

## TODO - 2.0.0

- [ ] App global: Screen reader layout
- [x] ~~App global: Change favicons from default Vue icons to Roon Web Controller icons~~
- [x] ~~App global: configure app manifest colors and icons~~
- [ ] App global: enable Service Worker
- [ ] App global: Desktop notifications
- [ ] App global: Keyboard shortcuts
- [ ] App global: Option to prevent screensaver/screen blank
- [x] ~~App global: Option to update browser title with track information~~
- [x] ~~App global: Circle Icons option~~
- [ ] UI: Now Playing: Track seek controls
- [x] ~~UI: Now Playing: Track length / Time Remaining option~~
- [x] ~~UI: Now Playing: Clock~~
- [x] ~~UI: Queue: "play from here"~~
- [x] ~~UI: Queue: queue items/time remaining~~
- [x] ~~UI: Touchscreen Global: Volume overlay~~
- [ ] UI: Touchscreen Global: Settings overlay
- [ ] UI: Settings Overlay: Save settings, including current zone id and layout to browser local storage
- [ ] UI: Settings Overlay: Select Layout
- [x] ~~UI: Settings Overlay: Clock enable/disable and Moment.js format option~~
- [ ] UI: Settings Overlay: Desktop Notifications enable/disable
- [x] ~~UI: Settings Overlay: Track Name in Browser Title enable/disable~~
- [ ] UI: Settings Overlay: Option to prevent screensaver/screen blank
- [x] ~~UI: Settings Overlay: Circle Icons option~~
- [x] ~~UI: Settings Overlay: Background cover art enable/disable~~
- [ ] UI: Settings Overlay: Keyboard shortcuts enable/disable
- [ ] UI: Settings Overlay: Keyboard shortcuts configure
- [x] ~~UI: Settings Overlay: Current Position / Time Left option~~
- [x] ~~Backend: Environmental variables for Roon host/port~~
- [ ] Backend: Environmental variables to enable / disable Health checks
- [ ] Backend: Environmental variables to configure Health check port
- [x] ~~Backend: Multi Session Key support for library browser~~
- [x] ~~Backend: Dockerfile~~
- [ ] Backend: Track Seek support
- [x] ~~Backend: Play from here support~~

## TODO - 2.1.0

- Multi-touch gestures using Hammer.js?
- Dominant color theme?
- 10 foot / TV layout?

## To use:

Using this alpha requires git, Node JS 10+ and npm.

1. Clone / update the git repository:

`git clone https://github.com/pluggemi/roon-web-controller.git`

2. Switch to the alpha branch:

`git checkout alpha`

3. Install the dependencies:

`npm install`

4. Build the application:

`npm run build`

5. Start the application:

`npm start`

6. Enable the extension in an official Roon client

7. View the application by opening a browser to [http://localhost:8080](http://localhost:8080)

## Update instructions

1. Pull the latest changes

`git pull`

2. Switch to the alpha branch (if you are not already there):

`git checkout alpha`

3. Install the updated/changed dependencies:

`npm install`

4. Build the application:

`npm run build`

5. Start the application:

`npm start`

6. Enable the extension in an official Roon client (if not already done)

7. View the application by opening a browser to [http://localhost:8080](http://localhost:8080)

## To develop:

This application is compatible with Vue UI Graphical User Interface and the Vue devtools browser extensions.

For more information, visit [https://cli.vuejs.org/](https://cli.vuejs.org/)

## Docker / Kubernetes support

Docker will be the preferred way to use Roon Web Controller. Images will be published to Docker Hub at [pluggemi/roon-web-controller](https://hub.docker.com/repository/docker/pluggemi/roon-web-controller).

### Environmental Options

The following environmental settings are available to configure the Roon Web Controller image:

- ROON_HOST: This is set to the ip address (or host name if you have a working DNS setup) of the Roon Core. If this is not set, Roon Web Controller will attempt to auto discover the Roon Core.
- ROON_PORT: This is used to set the port that the Roon Core is running on. The default port is 9100 and most likely will not need to be changed.

### Example run command

Here is an example command to run this docker container.

```
docker run -d \
  -p 8080:8080 \
  -e ROON_HOST="<YOUR ROON CORE IP>" \
  pluggemi/roon-web-controller:alpha
```

To also publish the live/ready/health endpoints (see below):

```
docker run -d \
  -p 8080:8080 \
  -p 9090:9090 \
  -e ROON_HOST="<YOUR ROON CORE IP>" \
  pluggemi/roon-web-controller:alpha
```

### Kubernetes Live and Ready endpoints

This docker image has Live, Ready and Health endpoints for Kubernetes deployments. The health endpoints run on port 9090 within the docker container.

- /live: this returns an HTTP 200 status code (OK) when the software is running
- /ready: this returns an HTTP 200 status code (OK) when the software is running and is paired with a Roon core. Otherwise, this returns a HTTP 503 status code (Service Unavailable).
- /health: this returns a JSON payload showing detailed health status. This is an example of the output from /health:

```javascript
{
  "app": {
    "name":"Roon Web Controller",
    "version":"2.0.0-alpha.0",
    "address":["172.17.0.2"]
  },
  "health":{
    "roon":"ready",
    "express":"ready",
    "socketio":"ready"
  }
}
```
