// Setup general variables
const defaultListenPort = 8080;

var core;
var pairStatus = 0;
var zoneStatus = [];
var zoneList = [];

// Read command line options
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');

const optionDefinitions = [
    { name: 'help', alias: 'h', description: 'Display this usage guide.', type: Boolean },
    { name: 'port', alias: 'p', description: 'Specify the port the server listens on.', type: Number }
]

const options = commandLineArgs(optionDefinitions, { partial: true })

const usage = getUsage([
{
    header: 'Roon Web Controller',
    content: 'A web based controller for the Roon Music Player.\n\nUsage: [bold]{node app.js <options>}'
},
{
    header: 'Options',
    optionList: optionDefinitions
},
{
    content: 'Project home: [underline]{https://github.com/pluggemi/roon-web-controller}'
}
])

if (options.help) {
    console.log(usage)
    process.exit()
}

// Read config file
var config = require('config');

var configPort = config.get('server.port')

// Determine listen port
if (options.port) {
    var listenPort = options.port;
} else if (configPort){
    var listenPort = configPort
} else {
    var listenPort = defaultListenPort;
}

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
    display_version:     "1.1.1",
    publisher:           'Mike Plugge',
    email:               'masked',
    website:             'https://github.com/pluggemi/roon-web-controller',

    core_paired: function(core_) {
        core = core_;

        pairStatus = true;
        io.emit("pairStatus", JSON.parse('{"pairEnabled": ' + pairStatus + '}'));

        transport = core_.services.RoonApiTransport;

        transport.subscribe_zones(function(response, data){
            if (response == "Subscribed") {
                for ( x in data.zones ) {
                    var zone_id = data.zones[x].zone_id;
                    var display_name = data.zones[x].display_name;
                    item = {};
                    item.zone_id = zone_id;
                    item.display_name = display_name;

                    zoneList.push(item);
                    zoneStatus.push(data.zones[x])
                }

                removeDuplicateList(zoneList, 'zone_id');
                removeDuplicateStatus(zoneStatus, 'zone_id');
            }
            else if (response == "Changed") {
                for (i in data ){
                    if (i == "zones_changed") {
                        for (x in data.zones_changed){
                            for (y in zoneStatus){
                                if (zoneStatus[y].zone_id == data.zones_changed[x].zone_id){
                                    zoneStatus[y] = data.zones_changed[x];
                                }
                            }
                        }
                        io.emit("zoneStatus", zoneStatus);

                    } else if (i == "zones_added") {

                        for ( x in data.zones_added ) {
                            var zone_id = data.zones_added[x].zone_id;
                            var display_name = data.zones_added[x].display_name;

                            item = {};
                            item.zone_id = zone_id;
                            item.display_name = display_name;

                            zoneList.push(item);
                            zoneStatus.push(data.zones_added[x])
                        }

                        removeDuplicateList(zoneList, 'zone_id');
                        removeDuplicateStatus(zoneStatus, 'zone_id');

                    } else if (i == "zones_removed") {
                        for (x in data.zones_removed) {
                            zoneList = zoneList.filter(function(zone){
                                return zone.zone_id != data.zones_removed[x];
                            });
                            zoneStatus = zoneStatus.filter(function(zone){
                                return zone.zone_id != data.zones_removed[x];
                            });
                        }
                        removeDuplicateList(zoneList, 'zone_id');
                        removeDuplicateStatus(zoneStatus, 'zone_id');
                    }
                }

            }
        });
    },

    core_unpaired: function(core_) {
        pairStatus = 0;
        io.emit("pairStatus", JSON.parse('{"pairEnabled": ' + pairStatus + '}'));
    }

});

var svc_status = new RoonApiStatus(roon);

roon.init_services({
    required_services: [ RoonApiTransport, RoonApiImage ],
    provided_services: [ svc_status ]
});

svc_status.set_status("Extenstion enabled", false);

roon.start_discovery();

// Remove duplicates from zoneList array
function removeDuplicateList(array, property) {
    var new_array = [];
    var lookup = {};
    for (x in array) {
        lookup[array[x][property]] = array[x];
    }

    for (x in lookup) {
        new_array.push(lookup[x]);
    }

    zoneList = new_array;
    io.emit("zoneList", zoneList);
}

// Remove duplicates from zoneStatus array
function removeDuplicateStatus(array, property) {
    var new_array = [];
    var lookup = {};
    for (x in array) {
        lookup[array[x][property]] = array[x];
    }

    for (x in lookup) {
        new_array.push(lookup[x]);
    }

    zoneStatus = new_array;
    io.emit("zoneStatus", zoneStatus);
}

// ---------------------------- WEB SOCKET --------------
io.on('connection', function(socket){
    io.emit("pairStatus", JSON.parse('{"pairEnabled": ' + pairStatus + '}'));
    io.emit("zoneList", zoneList);
    io.emit("zoneStatus", zoneStatus);

    socket.on('getZone', function(){
        io.emit("zoneStatus", zoneStatus);
    });

    socket.on('changeVolume', function(msg) {
        transport.change_volume(msg.output_id, "absolute", msg.volume);
    });

    socket.on('changeSetting', function(msg) {
        settings = [];

        if (msg.setting == "shuffle") {
            settings.shuffle = msg.value;
        } else if (msg.setting == "auto_radio") {
            settings.auto_radio = msg.value;
        } else if (msg.setting == "loop") {
            settings.loop = msg.value;
        }

        transport.change_settings(msg.zone_id, settings, function(error){
        })
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
    core.services.RoonApiImage.get_image(req.query.image_key, {"format": "image/jpeg"}, function(cb, contentType, body) {

        res.contentType = contentType;

        res.writeHead(200, {'Content-Type': 'image/jpeg' });
        res.end(body, 'binary');
    });
});

app.use('/jquery/jquery.min.js', express.static(__dirname + '/node_modules/jquery/dist/jquery.min.js'));

app.use('/js-cookie/js.cookie.js', express.static(__dirname + '/node_modules/js-cookie/src/js.cookie.js'));
