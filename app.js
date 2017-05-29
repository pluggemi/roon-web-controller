// Setup general variables
const listenPort = 8080;

var core;
var zoneStatus = [];
var zoneList = [];

// Setup Express
var express = require('express');
var http = require('http');

var app = express();
app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Setup Socket IO
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(listenPort, function() {
    console.log('Listening on port ' + listenPort);
})

// Setup Roon
var RoonApi          = require("node-roon-api");
var RoonApiImage     = require("node-roon-api-image");
var RoonApiStatus    = require("node-roon-api-status");
var RoonApiTransport = require("node-roon-api-transport");

var roon = new RoonApi({
    extension_id:        'com.pluggemi.roon.web.controller',
    display_name:        "Web Controller",
    display_version:     "1.0.0",
    publisher:           'Mike Plugge',
    email:               'masked',
    website:             'https://github.com/pluggemi/roon-web-controller',

    core_paired: function(core_) {
        core = core_;

        transport = core_.services.RoonApiTransport;

        transport.subscribe_zones(function(response, data){
            if (response == "Subscribed") {
                for ( x in data.zones ) {
                    var zone_id = data.zones[x].zone_id;
                    var display_name = data.zones[x].display_name;

                    for (y in data.zones[x].outputs){
                        var output_id = data.zones[x].outputs[y].output_id;
                    }

                    item = {};
                    item ["zone_id"] = zone_id;
                    item ["output_id"] = output_id;
                    item ["display_name"] = display_name;

                    zoneList.push(item);

                    zoneStatus.push(data.zones[x])
                }

                io.emit("zoneList", zoneList);
                io.emit("zoneStatus", zoneStatus);
            }
            else if (response == "Changed") {
                if (data.zones_added){
                    for ( x in data.zones_added ) {
                        var zone_id = data.zones_added[x].zone_id;
                        var display_name = data.zones_added[x].display_name;

                        for (y in data.zones_added[x].outputs){
                            var output_id = data.zones_added[x].outputs[y].output_id;
                        }

                        item = {};
                        item ["zone_id"] = zone_id;
                        item ["output_id"] = output_id;
                        item ["display_name"] = display_name;

                        zoneList.push(item);
                        zoneStatus.push(data.zones_added[x])
                    }
                    io.emit("zoneList", zoneList);
                    io.emit("zoneStatus", zoneStatus);
                }
                else if (data.zones_removed){
                    for (x in data.zones_removed) {
                        zoneList = zoneList.filter(function(zone){
                            return zone.zone_id != data.zones_removed[x];
                        });

                        zoneStatus = zoneStatus.filter(function(zone){
                            return zone.zone_id != data.zones_removed[x];
                        });
                    }
                    io.emit("zoneList", zoneList);
                    io.emit("zoneStatus", zoneStatus);
                }
                else if (data.zones_changed){
                    for (x in data.zones_changed){
                        for (y in zoneStatus){
                            if (zoneStatus[y].zone_id == data.zones_changed[x].zone_id){
                                zoneStatus[y] = data.zones_changed[x];
                            }
                        }
                    }
                    io.emit("zoneStatus", zoneStatus);
                }
                else {
                    console.log("Unknown transport response: " + response + " : " + data);
                }
            }
        });
    },

    core_unpaired: function(core_) {

    }
});

var svc_status = new RoonApiStatus(roon);

roon.init_services({
    required_services: [ RoonApiTransport, RoonApiImage ],
    provided_services: [ svc_status ]
});

svc_status.set_status("Extenstion enabled", false);

roon.start_discovery();

// ---------------------------- WEB SOCKET --------------

io.on('connection', function(socket){
    io.emit("zoneList", zoneList);
    io.emit("zoneStatus", zoneStatus);

    socket.on('disconnect', function(){
        //    console.log('user disconnected');
    });

    socket.on('changeVolume', function(msg) {
        var obj = JSON.parse(msg);

        transport.change_volume(obj.outputId, "absolute", obj.volume);
    });

    socket.on('seek', function(msg) {
        var obj = JSON.parse(msg);

        transport.seek(obj.outputId, "absolute", obj.seek);
    });

    socket.on('goPrev', function(msg){
        transport.control(msg, 'previous');
    });

    socket.on('goNext', function(msg){
        transport.control(msg, 'next');
    });

    socket.on('goPlayPause', function(msg){
        transport.control(msg, 'playpause');
    });

    socket.on('goPlay', function(msg){
        transport.control(msg, 'play');
    });

    socket.on('goPause', function(msg){
        transport.control(msg, 'pause');
    });

    socket.on('goStop', function(msg){
        transport.control(msg, 'stop');
    });

});


// Web Routes
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/roonapi/getImage', function(req, res){
    core.services.RoonApiImage.get_image(req.query['image_key'], {"format": "image/jpeg"}, function(cb, contentType, body) {

        res.contentType = contentType;

        res.writeHead(200, {'Content-Type': 'image/jpeg' });
        res.end(body, 'binary');
    });
});
