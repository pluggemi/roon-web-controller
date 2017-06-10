# Roon Web Controller 1.1.0
This is an extension for the Roon music player that provides a web based remote.

## New Feature Highlights
- Complete rewrite of UI - now supports both Portrait and Landscape view making it more suitable for phones
- Added new theme based on the dominant color of the cover art
- Added controls for Volume, Loop, Shuffle, and Auto Radio
- Added optional command line options and local configuration file

See the [CHANGELOG.md](CHANGELOG.md) for complete list of changes

## Upgrade notes
Please run `npm install` after upgrading due to new dependencies.

## Screenshots

### Dark Theme
![Dark Theme](https://raw.githubusercontent.com/pluggemi/project-screenshots/master/roon-web-controller/dark-Portrait.png)
![Dark Theme](https://raw.githubusercontent.com/pluggemi/project-screenshots/master/roon-web-controller/dark-Landscape.png)

Album Credit: [Seofon, Zero Point](https://seofon.bandcamp.com/album/zero-point)

### Cover Art Theme
![Cover Art Theme](https://raw.githubusercontent.com/pluggemi/project-screenshots/master/roon-web-controller/cover-Portrait.png)
![Cover Art Theme](https://raw.githubusercontent.com/pluggemi/project-screenshots/master/roon-web-controller/cover-Landscape.png)

Album Credit: [A Winged Victory for the Sullen, IRIS (Musique Originale)](https://erasedtapes.bandcamp.com/album/iris-musique-originale-bonus-track-version)

### Dominant Color Theme
![Dominant Color Theme](https://raw.githubusercontent.com/pluggemi/project-screenshots/master/roon-web-controller/color-Portrait.png)
![Dominant Color Theme](https://raw.githubusercontent.com/pluggemi/project-screenshots/master/roon-web-controller/color-Landscape.png)

Album Credit: [Biosphere, Departed Glories](https://biosphere.bandcamp.com/album/departed-glories)

## Installation
Ensure that Node.JS version 6.x or higher is installed.

Grab the software:
* Via git (preferred): ```git clone https://github.com/pluggemi/roon-web-controller.git```
* Or download and extract the zip file.

Change directory into the software:
```cd roon-web-controller```

Install the Node.JS modules
```npm install```

Run the application:
```node app.js```

On an existing Roon client, go to "Settings" then "Extensions". Click "Enable" beside "Web Controller".

Open a web browser to your server at "http://localhost:8080"

### (Optional) Local configuration file
Simply copy `config/local.conf.EXAMPLE` to `config/local.conf` and edit `config/local.conf` as needed.
* `config/local.conf` is not tracked by `git`, so it will not be clobbered with updates
* `config/local.conf.EXAMPLE` is tracked by `git` and will be updated in the future as new options are available

Content of `config/local.conf`

```
// Copy this file to "local.json" and change the port as desired.
{
  "server": {
    "port": "1234"
  }
}
```

### (Optional) Command Line Options
This is the output `node app.js -h` which shows usage of the command line options
```
Roon Web Controller

 A web based controller for the Roon Media System.

 Usage: node app.js <options>

Options

 -h, --help          Display this usage guide.
 -p, --port number   Specify the port the server listens on.

 Project home: https://github.com/pluggemi/roon-web-controller
```
###S (Optional) Sample systemd unit file
[systemd](https://www.freedesktop.org/wiki/Software/systemd/) is the init system used by modern Linux systems.  Here is a sample systemd unit file which can be used to automatically start this application at Linux system boot time.
```
[Unit]
Description=NodeJS app - Roon Web Controller
After=network.target

[Service]
User=node
WorkingDirectory=/srv/node/roon-web-controller
ExecStart=/usr/bin/node app.js

[Install]
WantedBy=multi-user.target
```
#### Usage
To use this unit file:
* Save this template to a file called ```roon-web-controller.service```
* Edit the ```user``` field to be the user running the application
* Edit the ```WorkingDirectory``` field to be the location where the application is installed (**NOTE**: the ```user``` must have read and write access to this location!)
* Using either ```sudo``` or as ```root```, copy the edited ```roon-web-controller.service``` file to ```/usr/lib/systemd/system```
* Reload systemd: ```sudo systemctl daemon-reload```
* Start the application: ```sudo systemctl start roon-web-controller.service```
* Enable the application at boot up: ```sudo systemctl enable roon-web-controller.service```

You can monitor the output of this application using ```journalctl```.
* To show the application output: ```sudo journalctl -u roon-web-controller```
* To follow the application output: ```sudo journalctl -f -u roon-web-controller```

## Credits
In addition to those packages installed via npm, this project uses:
* [jquery.simplemarquee.js](https://github.com/IndigoUnited/jquery.simplemarquee) to automatically scroll the long text
* Color palette from the KDE Visual Design Group [Human Interface Guidelines](https://community.kde.org/KDE_Visual_Design_Group/HIG/Color)
* Icons from [Material Design Icons](https://materialdesignicons.com/)
* [Color Thief](https://github.com/lokesh/color-thief) to calculate the dominant color of the album art

Thanks go to [st0g1e](https://github.com/st0g1e) for doing one of the first [web clients](https://github.com/st0g1e/roon-extension-ws-player) for the Roon API.

And of course thanks go to [Roon Labs](https://roonlabs.com/) for making the music player and the [APIs](https://github.com/RoonLabs).

## License
The MIT License
Copyright 2017 Mike Plugge

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
