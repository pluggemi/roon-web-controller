# Roon Web Controller 2.0.1

NOTE: This is a fork of pluggemi/roon-web-controller

## Changes to the original software are
- UI: Settings Overlay: Save settings, including current zone id and layout to browser local storage
- UI: Settings Overlay: Reset settings in Settings About added
- Dockerfile adjusted to avoid error:0308010C

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
    "version":"2.0.1",
    "address":["172.17.0.2"]
  },
  "health":{
    "roon":"ready",
    "express":"ready",
    "socketio":"ready"
  }
}
```
