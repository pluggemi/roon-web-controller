var socket = io();
var settings = [];

$(document).ready(function() {
    showPage();
});

function showPage() {
    // Read settings from cookie
    settings.zoneID = readCookie('settings[\'zoneID\']');
    settings.displayName = readCookie('settings[\'displayName\']');

    // Set page fields to settings
    if (settings.zoneID === null) {
        $("#overlayZoneList").show();
    }

    if (settings.displayName !== null){
        $("#buttonZoneName").html(settings.displayName);
        if (settings.zoneID !== null) {
            $("#buttonBack").html(getSVG('back')).attr("onclick", "goUp(\'" + settings.zoneID + "\')");
            $("#buttonHome").html(getSVG('home')).attr("onclick", "goHome(\'" + settings.zoneID + "\')");
            goHome(settings.zoneID);
        }
    }

//     $("#buttonSearch").html(getSVG('search'));

    enableSockets();
}

function enableSockets() {
    socket.on("zoneList", function(payload) {
        $("#zoneList").html("");

        if (payload !== null) {
            for (var x in payload){
                $("#zoneList").append("<button type=\"button\" class=\"buttonOverlay\" onclick=\"selectZone(\'" + payload[x].zone_id + "\', \'" + payload[x].display_name + "\')\">" + payload[x].display_name + "</button>");
            }
        }
    });
}

function selectZone(zone_id, display_name) {
    settings.zoneID = zone_id;
//     setCookie('settings[\'zoneID\']', settings.zoneID);

    settings.displayName = display_name;
//     setCookie('settings[\'displayName\']', settings.displayName);
    $("#buttonZoneName").html(settings.displayName);
    $("#buttonBack").html(getSVG('back')).attr("onclick", "goUp(\'" + settings.zoneID + "\')");
    $("#buttonHome").html(getSVG('home')).attr("onclick", "goHome(\'" + settings.zoneID + "\')");

    $("#overlayZoneList").hide();
}

function goUp(zone_id) {
    var data = {};
    data.zone_id = zone_id;
    data.list_size= 20;

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
           contentType: 'application/json',
           url: '/roonapi/goUp',
           success: function(payload) {
               showData(payload, zone_id, 1);
           }
    });
}

function goHome(zone_id) {
    var data = {};
    data.zone_id = zone_id;
    data.list_size= 20;

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
           contentType: 'application/json',
           url: '/roonapi/goHome',
           success: function(payload) {
               showData(payload, zone_id, 1);
           }
    });
}

function showList(item_key, zone_id, page, list_size) {
    var data = {};
    data.item_key = item_key;
    data.zone_id = zone_id;
    data.page = page;
    data.list_size = list_size;

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
           contentType: 'application/json',
           url: '/roonapi/listByItemKey',
           success: function(payload) {
               showData(payload, zone_id, page);
           }
    });
}

function showData( payload, zone_id, page ) {
    $("#items").html("");

    if (payload.list !== null){
        for (var x in payload.list) {
            $("#items").append("<button type=\"button\" class=\"itemListItem\" onclick=\"showList(\'" + payload.list[x].item_key + "\', \'" + settings.zoneID + "\', 1, 10)\">" + payload.list[x].title + "</button>");
//             $("#items").append("<button type=\"button\" class=\"itemListItem\" onclick=\"showList(\'" + payload.list[x].item_key + "\', \'" + settings.zoneID + "\', 1, 10)\">" + payload.list[x].title + " (image_key: " + payload.list[x].image_key + ")</button>")

        }
    }
}


function readCookie(name){
    return Cookies.get(name);
}

// function setCookie(name, value){
//     Cookies.set(name, value, { expires: 7 });
// }

function getSVG(cmd) {
    if (cmd == "home") {
        return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 9.99939,19.998L 9.99939,13.998L 13.9994,13.998L 13.9994,19.998L 18.9994,19.998L 18.9994,11.998L 21.9994,11.998L 11.9994,2.99805L 1.99939,11.998L 4.99939,11.998L 4.99939,19.998L 9.99939,19.998 Z \"/></svg>";
    } else if (cmd == "back") {
        return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 15.4135,16.5841L 10.8275,11.9981L 15.4135,7.41207L 13.9995,5.99807L 7.99951,11.9981L 13.9995,17.9981L 15.4135,16.5841 Z \"/></svg>";
    } else if (cmd == "search") {
        return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 9.5,3C 13.0899,3 16,5.91015 16,9.5C 16,11.1149 15.411,12.5923 14.4362,13.7291L 14.7071,14L 15.5,14L 20.5,19L 19,20.5L 14,15.5L 14,14.7071L 13.7291,14.4362C 12.5923,15.411 11.1149,16 9.5,16C 5.91015,16 3,13.0899 3,9.5C 3,5.91015 5.91015,3 9.5,3 Z M 9.5,5.00001C 7.01472,5.00001 5,7.01473 5,9.50001C 5,11.9853 7.01472,14 9.5,14C 11.9853,14 14,11.9853 14,9.50001C 14,7.01473 11.9853,5.00001 9.5,5.00001 Z \"/></svg>";
    } else if (cmd == "music") {
        return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 21,3L 21,15.5C 21,17.433 19.433,19 17.5,19C 15.567,19 14,17.433 14,15.5C 14,13.567 15.567,12 17.5,12C 18.0368,12 18.5454,12.1208 19,12.3368L 19,6.4698L 9,8.59536L 9,17.5C 9,19.433 7.433,21 5.5,21C 3.567,21 2,19.433 2,17.5C 2,15.567 3.567,14 5.5,14C 6.0368,14 6.54537,14.1208 7,14.3368L 7,5.97579L 21,3 Z \"/></svg>";
    }
}
