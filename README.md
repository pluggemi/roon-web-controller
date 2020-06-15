# Roon Web Controller ALPHA

NOTE: This is alpha software. There is missing functionality.

## What works

- Touchscreen layout
- Landscape view
- Library functionality
- Now Playing functionality
- Queue display
- Volume controls overlay
- Zone selection overlay
- Loop, Shuffle, and Radio controls on the Queue page

## What does not work

- Portrait mode, only landscape is available right now
- Settings overlay is empty, no settings controls
- Queue "Play from Here" is not functional
- Track seek controls

## TODO - 2.0.0

- [ ] App global: Screen reader layout
- [ ] App global: Change favicons from default Vue icons to Roon Web Controller icons
- [ ] App global: enable Service Worker, configure app manifest colors and icons
- [ ] App global: Desktop notifications
- [ ] App global: Keyboard shortcuts
- [ ] UI: Now Playing: Track seek controls
- [ ] UI: Now Playing: Clock
- [ ] UI: Queue: "play from here"
- [x] ~~UI: Touchscreen Global: Volume overlay~~
- [ ] UI: Touchscreen Global: Settings overlay
- [ ] UI: Settings Overlay: Save settings, including current zone id and layout to browser local storage
- [ ] UI: Settings Overlay: Select Layout
- [ ] UI: Settings Overlay: Clock enable/disable and Moment.js format option
- [ ] UI: Settings Overlay: Desktop Notifications enable/disable
- [ ] UI: Settings Overlay: Background cover art enable/disable
- [ ] UI: Settings Overlay: Keyboard shortcuts enable/disable
- [ ] UI: Settings Overlay: Keyboard shortcuts configure
- [ ] Backend: Environmental variables for Roon host/port
- [ ] Backend: Environmental variables to enable / disable Health checks
- [ ] Backend: Environmental variables to configure Health check port
- [ ] Backend: Dockerfile
- [ ] Backend: Track Seek support
- [ ] Backend: Play from here support

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
