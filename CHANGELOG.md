# Change Log
## Version 1.1.0 (PENDING RELEASE)
### Open Bugs
- (BUG) - After ungrouping a zone, the grouped zone name stays on the zone list. Workaround: restart the node application.

### Pre Release TODO
- Clear all blocker bugs
- Complete regression test checklist
- Check for impacts of Roon Server 1.3 (Build 234)
- Complete pre tag / pre release checklist

### Install Notes
See the [README.md](README.md) for installation instructions

### Upgrade notes
Please run `npm install` after upgrading due to new dependencies.

### New
- Complete rewrite of UI - now supports both Portrait and Landscape view making it more suitable for phones
- Added new theme based on the dominant color of the cover art
- Added volume controls
- Added controls for Loop, Shuffle, and Auto Radio
- Added a check to see if the extension is enabled
- Added visual feedback when clicking overlay buttons
- Added close buttons to certain overlays
- Switching zones is now much more responsive
- Depreciated the "Light" and "Cover Light" themes

### Implemented Feature Requests
- Added config file for server settings (config/local.json).  The example file `config/local.conf.EXAMPLE` shows usage and is tracked by `git`.  The `config/local.conf` is not tracked by `git` so that local settings will not be clobbered by `git pull`.
- Added command line options for help and to set the server port (`node app.js -h` for usage).

### Fixed Bugs
- After switching a zone, the zone_id did not update for the controls. This could lead to controlling the previous zone with the new zone's controls.
- Tweaked jquery.simplemarquee.js to use "span" instead of "div". Caused problems with CSS layouts.

### Known issues


------------------
# Release History
## Version 1.0.1
- Resolved bug that could result in repeated listings in Zone Listings
- Changed all icons to utilize SVGs from Material Design Icons (https://materialdesignicons.com/)
- Dramactically reduced the number of times the icons were being called and redrawn
- Changed default theme to "Cover Dark"
- Set default icon theme to "Circles"
- Added configuration option to select icons between icons with or without circles
- Miscellaneous aesthetic changes

## Version 1.0.0
- Initial Release
