# Roon Web Controller
---------------------------
This is an extension for the Roon music player that provides a web based remote.  It uses websockets, jQuery, js.cookie.js and jquery.simplemarquee.js.

## Screenshots
(TODO)

## Installation
(TODO)

## Upgrade
(TODO)

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
* Using either ```sudo``` or as ```root```, copy the file to ```/usr/lib/systemd/system```
* Reload systemd: ```sudo systemctl daemon-reload```
* Start the application: ```sudo systemctl start roon-web-controller.service```
* Enable the application at boot up: ```sudo systemctl enable roon-web-controller.service```

You can monitor the output of this application using ```journalctl```.
* To show the log: ```journalctl -u roon-web-controller```
* To follow the log: ```journalctl -f -u roon-web-controller```

## Credits
In addition to those packages installed via npm, this project uses:
* [jquery.simplemarquee.js](https://github.com/IndigoUnited/jquery.simplemarquee).
* Color palette from the KDE Visual Design Group [Human Interface Guidelines](https://community.kde.org/KDE_Visual_Design_Group/HIG/Color)

Thanks go to [st0g1e](https://github.com/st0g1e) for doing one of the first [web clients](https://github.com/st0g1e/roon-extension-ws-player) for the Roon API.

And of course thanks go to [Roon Labs](https://roonlabs.com/) for making the music player and the [APIs](https://github.com/RoonLabs).
