# Roon Web Controller
---------------------------
This is an extension for the Roon music player that provides a web based remote.

## Screenshots
All of these screenshots were taken from a web client sized at 800x480 - the same size as a Raspberry Pi touch screen.  The application looks great natively on the Raspberry Pi Touch screen as well as in a web browser window. The application resizes to your screen size. Also notice the scrolling text in the "Cover Art - Light Theme".

### Light Theme
![Light Theme](https://raw.githubusercontent.com/pluggemi/roon-web-controller/master/screenshots/light.png)
Album Credit: [Biosphere, Sound Installations (2000-2009)](https://biosphere.bandcamp.com/album/sound-installations-2000-2009)

### Dark Theme
![Dark Theme](https://raw.githubusercontent.com/pluggemi/roon-web-controller/master/screenshots/dark.png)
Album Credit: [Carbon Based Lifeforms, Twentythree](https://carbonbasedlifeforms.bandcamp.com/album/twentythree)

### Cover Art - Dark Theme
![Cover Art - Dark Theme](https://raw.githubusercontent.com/pluggemi/roon-web-controller/master/screenshots/coverLight.png)
Album Credit: [Android Lust, Crater Vol​.​1](http://music.androidlust.com/album/crater-vol-1)

### Cover Art - Light Theme
![Cover Art - Light Theme](https://raw.githubusercontent.com/pluggemi/roon-web-controller/master/screenshots/coverLight.png)
Album Credit: [Rachel Grimes, The Clearing](https://rachelgrimes.bandcamp.com/album/the-clearing)

## Installation
Ensure that Node.JS version 5.x or higher is installed.

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

### Usage
* To select or change a zone, click the Speaker icon at the lower left
* To select or change the theme, click the Gears icon at the lower left

## Known issues/TODO
* The volume control overlay does not have any volume controls yet.

## Sample systemd unit file
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
* [jquery.simplemarquee.js](https://github.com/IndigoUnited/jquery.simplemarquee)
* Color palette from the KDE Visual Design Group [Human Interface Guidelines](https://community.kde.org/KDE_Visual_Design_Group/HIG/Color)

Thanks go to [st0g1e](https://github.com/st0g1e) for doing one of the first [web clients](https://github.com/st0g1e/roon-extension-ws-player) for the Roon API.

And of course thanks go to [Roon Labs](https://roonlabs.com/) for making the music player and the [APIs](https://github.com/RoonLabs).
