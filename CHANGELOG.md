# Change Log
## Version 1.1.0 (PENDING RELEASE)
### Open Bugs
- (BUG, BLOCKER) - volume buttons not functional
- (BUG, minor) - seekPosition, seekLength, and seekValue refreshes with every zone update whether they actually change or not.  Causes frequent page repaints.

### Pre Release TODO
- Clear all blocker bugs, prefer clear all known bugs
- Add volume support
- Complete regression test checklist
- Check for impacts of Roon Server 1.3 (Build 234)
- Complete pre tag / pre release checklist

### Install Notes
See the [README.md](README.md) for installation instructions

### Upgrade notes
Please run `npm install` after upgrading due to new dependencies.

### New
- Complete rewrite of UI - now supports both Portrait and Landscape view
- Added new theme based on the dominant color of the cover art
- Added controls for Loop, Shuffle, and Auto Radio
- Added a check to see if the extension is enabled
- Added visual cues to clicking overlay buttons
- Added close buttons to overlays
- Switching zones is now much more responsive
- Tweaked jquery.simplemarquee.js to use "span" instead of "div" due to problems with CSS layouts

### Implemented Feature Requests
- Added config file for server settings (config/local.json).  Example file "config/local.conf.EXAMPLE" shows usage.  The example file is tracked by "git".  The "config/local.conf" is not tracked by "git" so that local settings will not be clobbered by "git pull".
- Added command line option for help and to set the server port ('node app.js -h' for options).

### Fixed Bugs
- After switching a zone, the zone_id did not update for the controls. This can lead to controlling the previous zone with the new zone's controls.

### A note on the volume controls
You may be wondering why I did not implement a slider for the volume controls.  There are three reasons: Browser limitations, CSS limitations, and Roon API realities.

Browser limitations: The slider - known as an "input type=range" - is not yet a standard input type. While all of the most current browsers (except Opera mini), older browsers do not.  Including mobile browsers on older versions of Android and IOS. This prevents the common use case of using an old tablet as a control point.

CSS limitations: CSS styling of the "input type=range" requires quite a few browser specific hacks.  And my goal for maintainability is to only use standardized CSS.

Roon API realities: Many devices that work with Roon utlize both positive and negative numbers for "min", "max", and "value" volumes.  Even without the browser issues and CSS issues involved with "input type=range", the reality is that none of them natively support the use of both positive and negative numbers for "min", "max", and "value".  Additionally, the values supplied by the Roon API are floating point values. The "input type=range" is designed to work with integers. There are ways to get this to work, but code portability and maintainability is a major concern.

It is for these reasons that I decided to go with volume buttons instead of sliders.

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
