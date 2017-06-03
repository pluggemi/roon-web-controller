var socket = io();

var cssBackgroundColor;
var cssForegroundColor;
var curDisplayName;
var curIcon;
var curTheme;
var curZone;
var curZoneID;
var statePrev;
var stateNext;
var statePlayPauseStop;
var statePlayPauseStopLast;
var stateLine1;
var stateLine2;
var stateLine3;
var statePicture;
var stateTitle;

$(document).ready(function() {
    curZoneID = readCookie('curZoneID');
    curDisplayName = readCookie('curDisplayName');
    curTheme = readCookie('curTheme');
    curIcon = readCookie('curIcon');

    if (curTheme == null) {
        curTheme = "coverDark";
        setCookie('curTheme', curTheme);
    };

    if (curIcon == null) {
        curIcon = "circle";
        setCookie('curIcon', curIcon);
    }

    if (curDisplayName != null){
        $("#zoneName").html(curDisplayName);
    }

    if (curZoneID == null) {
        showOverlay('overlayZoneList');
        $("#controlZone").attr("onclick", "showOverlay(\'overlayZoneList\')").html(getSVG('zone', curIcon) + "<br><span id=\"zoneName\">No Zone</span>");
    }

    if (curDisplayName != null) {
        $("#controlZone").attr("onclick", "showOverlay(\'overlayZoneList\')").html(getSVG('zone', curIcon) + "<br><span id=\"zoneName\">" + curDisplayName +"</span>");
    }

    setTheme(curTheme);

    $("#menuButton").attr("onclick", "showOverlay(\'overlayMainMenu\')").html(getSVG('menu', curIcon));
    $("#nowPlaying").show();
    $("#libraryBrowser").hide();


    $("#controlVolume").attr("onclick", "showOverlay(\'overlayVolume\')").html(getSVG('volume', curIcon));

    socket.on("zoneList", function(payload) {
        updateZoneList(payload);
    });

    socket.on("zoneStatus", function(payload) {
        if (curZoneID != null){
            for (x in payload){
                if (payload[x].zone_id == curZoneID) {
                    curZone = payload[x];
                    updateZone(curZone);
                }
            }
        }
    });
});

function updateZoneList(payload){
    $("#zoneList").html("");

    for (x in payload){
        $("#zoneList")
        .append("<button type=\"button\" class=\"buttonOverlay\" onclick=\"selectZone(\'" + payload[x].zone_id + "\', \'" + payload[x].display_name + "\')\">" + payload[x].display_name + "</button>");
    }
    $(".buttonOverlay").css("background-color", cssForegroundColor).css("color", cssBackgroundColor);
}

function selectZone(zone_id, display_name) {
    curZoneID = zone_id;
    setCookie('curZoneID', curZoneID);

    curDisplayName = display_name;
    setCookie('curDisplayName', curDisplayName);
    $("#zoneName").html(curDisplayName);

    hideOverlay('overlayZoneList');
}

function updateZone (curZone){
    if ( curZone.now_playing != null ) {
        showIsPlaying(curZone);
    } else {
        showNotPlaying();
    }
}

function showIsPlaying(curZone) {
    $("#notPlaying").hide();
    $("#isPlaying").show();
    $("#playbackControls").show();

    if ( stateLine1 != curZone.now_playing.three_line.line1) {
        stateLine1 = curZone.now_playing.three_line.line1;
        $("#line1")
        .html(curZone.now_playing.three_line.line1)
        .simplemarquee({
            cycles: Infinity,
            delayBetweenCycles: 5000,
            handleHover: false
        });
    };

    if ( stateLine2 != curZone.now_playing.three_line.line2) {
        stateLine2 = curZone.now_playing.three_line.line2;
        $("#line2")
        .html(curZone.now_playing.three_line.line2)
        .simplemarquee({
            cycles: Infinity,
            delayBetweenCycles: 5000,
            handleHover: false
        });
    };

    if ( stateLine3 != curZone.now_playing.three_line.line3) {
        stateLine3 = curZone.now_playing.three_line.line3;
        $("#line3")
        .html(curZone.now_playing.three_line.line3)
        .simplemarquee({
            cycles: Infinity,
            delayBetweenCycles: 5000,
            handleHover: false
        });
    };

    if (stateTitle != curZone.now_playing.one_line.line1) {
        stateTitle = curZone.now_playing.one_line.line1;
        $(document).prop('title', curZone.now_playing.one_line.line1);
    };

    if ( curZone.is_seek_allowed == true ) {
        $("#line4").show()
        $("#seekPosition").html(secondsConvert(curZone.now_playing.seek_position));
        $("#seekLength").html(secondsConvert(curZone.now_playing.length));
        $("#trackSeekValue")
        .css("width", Math.round((curZone.now_playing.seek_position / curZone.now_playing.length) * 100) + "%");
    } else {
        $("#line4").hide();
    };

    if ( statePicture != curZone.now_playing.image_key ) {
        statePicture = curZone.now_playing.image_key;

        if ( curZone.now_playing.image_key == null ) {
            imgUrl = "/img/transparent.png";

        } else {
            imgUrl = "/roonapi/getImage?image_key=" + curZone.now_playing.image_key;
        }

        $("#coverImageDiv").html("<img src=\"" + imgUrl + "\" id=\"coverImage\">");
        $("#coverBackground").css("background-image", "url(" + imgUrl + ")");
    };

    if (statePrev != curZone.is_previous_allowed || statePrev == null) {
        statePrev = curZone.is_previous_allowed;
        if ( curZone.is_previous_allowed == true ) {
            $("#controlPrev").attr("onclick", "goCmd(\'prev\', \'" + curZone.zone_id + "\')").html(getSVG('prev', curIcon)).css("fill-opacity", "1");
        } else {
            $("#controlPrev").html(getSVG('prev', curIcon)).css("fill-opacity", "0.33");
        };
    };
    if (stateNext != curZone.is_next_allowed || stateNext == null) {
        stateNext = curZone.is_next_allowed;
        if ( curZone.is_next_allowed == true ) {
            $("#controlNext").attr("onclick", "goCmd(\'next\', \'" + curZone.zone_id + "\')").html(getSVG('next', curIcon)).css("fill-opacity", "1");
        } else {
            $("#controlNext").html(getSVG('next', curIcon)).css("fill-opacity", "0.33");
        }
    }

    if ( curZone.is_play_allowed == true ) {
        statePlayPauseStop = "showPlay";
    } else if ( curZone.state == "playing" && curZone.is_play_allowed == false ) {
        if ( curZone.is_pause_allowed == true ) { statePlayPauseStop = "showPause"; }
        else { statePlayPauseStop = "showStop"; }
    } else {
        statePlayPauseStop = "showPlayDisabled";
    }

    if (statePlayPauseStopLast != statePlayPauseStop || statePlayPauseStop == null) {
        statePlayPauseStopLast = statePlayPauseStop;
        if ( statePlayPauseStop == "showPlay") {
            $("#controlPlayPauseStop").attr("onclick", "goCmd(\'play\', \'" + curZone.zone_id + "\')").html(getSVG('play', curIcon)).css("fill-opacity", "1");
        } else if (statePlayPauseStop == "showPause") {
            $("#controlPlayPauseStop").attr("onclick", "goCmd(\'pause\', \'" + curZone.zone_id + "\')").html(getSVG('pause', curIcon)).css("fill-opacity", "1");
        } else if (statePlayPauseStop == "showStop") {
            $("#controlPlayPauseStop").attr("onclick", "goCmd(\'pause\', \'" + curZone.zone_id + "\')").html(getSVG('stop', curIcon)).css("fill-opacity", "1");
        } else if (statePlayPauseStop == "showPlayDisabled") {
            $("#controlPlayPauseStop").html(getSVG('play', curIcon)).css("fill-opacity", "0.33");
        }
    }
}

function goCmd(cmd,zone_id){
    if (cmd == "prev") {
        socket.emit("goPrev", zone_id);
    } else if (cmd == "next") {
        socket.emit('goNext', zone_id);
    } else if (cmd == "play") {
        socket.emit('goPlay', zone_id);
    } else if (cmd == "pause") {
        socket.emit('goPause', zone_id);
    } else if (cmd == "stop") {
        socket.emit('goStop', zone_id);
    }
}

function showNotPlaying() {
    $("#notPlaying").show();
    $("#isPlaying").hide();
    $("#playbackControls").hide();
}

function showSection(section){
    if (section == "nowPlaying") {
        $("#nowPlaying").show();
        $("#libraryBrowser").hide();
    } else if (section == "libraryBrowser"){
        $("#nowPlaying").hide();
        $("#libraryBrowser").show();
    }
}

function showOverlay(overlay) {
    if (overlay == "overlayZoneList") {
        $("#overlayZoneList").show();
        overlayZoneListState = true;
    } else if (overlay == "overlayVolume") {
        $("#overlayVolume").show();
    } else if (overlay == "overlayTheme") {
        $("#overlayTheme").show();
    } else if (overlay == "overlayIcons") {
        $("#overlayIcons").show();
    } else if (overlay == "overlayMainMenu") {
        $("#overlayMainMenu").show();
    }
}

function hideOverlay(overlay) {
    if (overlay == "overlayZoneList") {
        $("#overlayZoneList").hide();
        overlayZoneListState = false;
    } else if (overlay == "overlayVolume") {
        $("#overlayVolume").hide();
    } else if (overlay == "overlayTheme") {
        $("#overlayTheme").hide();
    } else if (overlay == "overlayIcons") {
        $("#overlayIcons").hide();
    } else if (overlay == "overlayMainMenu") {
        $("#overlayMainMenu").hide();
    }
}

function setIcon(icon) {
    curIcon = icon;
    setCookie('curIcon', curIcon);
    statePrev = "getSVG";
    statePlayPauseStopLast = "getSVG";
    stateNext = "getSVG";
}

function setTheme(theme) {
    curTheme = theme;
    setCookie('curTheme', curTheme);
    showTheme(curTheme);
}

function showTheme(curTheme) {
    if (curTheme == "dark") {
        cssBackgroundColor = "#232629";
        cssForegroundColor = "#eff0f1";

        $("#trackSeek").css("background-color", "rgba(239, 240, 241, 0.33)");
        $("#coverBackground").hide();
    }
    else if (curTheme == "light") {
        cssBackgroundColor = "#eff0f1";
        cssForegroundColor = "#232629";

        $("#trackSeek").css("background-color", "rgba(35, 38, 41, 0.33)");
        $("#coverBackground").hide();
    }
    else if (curTheme == "coverDark") {
        cssBackgroundColor = "#232629";
        cssForegroundColor = "#eff0f1";

        $("#trackSeek").css("background-color", "rgba(239, 240, 241, 0.33)");
        $("#coverBackground").show();
    }
    else if (curTheme == "coverLight") {
        cssBackgroundColor = "#eff0f1";
        cssForegroundColor = "#232629";

        $("#trackSeek").css("background-color", "rgba(35, 38, 41, 0.33)");
        $("#coverBackground").show();
    }
    else {
        curTheme = null;
        setTheme(curTheme);
    }

    $("body").css("background-color", cssBackgroundColor).css("color", cssForegroundColor);
    $(".buttonTrans").css("color", cssForegroundColor);
    $(".buttonOverlay").css("background-color", cssForegroundColor).css("color", cssBackgroundColor);
    $(".overlayContent").css("background-color", cssBackgroundColor);
}

function readCookie(name){
    return Cookies.get(name);
}

function setCookie(name, value){
    Cookies.set(name, value, { expires: 7 });
}

function secondsConvert(seconds) {
    seconds = Number(seconds);
    var hour = Math.floor(seconds / 3600);
    var minute = Math.floor(seconds % 3600 / 60);
    var second = Math.floor(seconds % 3600 % 60);
    return ((hour > 0 ? hour + ":" + (minute < 10 ? "0" : "") : "") + minute + ":" + (second < 10 ? "0" : "") + second);
}

function getSVG(cmd, curIcon) {
    if (cmd == "zone") {
        return "<svg class=\"svgSmall\" viewBox=\"0 0 24.00 24.00\"><path style=\"fill:currentColor\" d=\"M 11.9994,11.9981C 10.3434,11.9981 8.99943,13.3421 8.99943,14.9981C 8.99943,16.6541 10.3434,17.9981 11.9994,17.9981C 13.6554,17.9981 14.9994,16.6541 14.9994,14.9981C 14.9994,13.3421 13.6554,11.9981 11.9994,11.9981 Z M 11.9994,19.9981C 9.23942,19.9981 6.99943,17.7601 6.99943,14.9981C 6.99943,12.2361 9.23942,9.99807 11.9994,9.99807C 14.7604,9.99807 16.9994,12.2361 16.9994,14.9981C 16.9994,17.7601 14.7604,19.9981 11.9994,19.9981 Z M 11.9994,3.99807C 13.1024,3.99807 13.9994,4.89406 13.9994,5.99807C 13.9994,7.10207 13.1024,7.99807 11.9994,7.99807C 10.8934,7.99807 9.99943,7.10207 9.99943,5.99807C 9.99943,4.89406 10.8934,3.99807 11.9994,3.99807 Z M 16.9994,1.99807L 6.99943,1.99807C 5.89442,1.99807 4.99943,2.89406 4.99943,3.99807L 4.99943,19.9981C 4.99943,21.1021 5.89442,21.9881 6.99943,21.9881L 16.9994,21.9981C 18.1034,21.9981 18.9994,21.1021 18.9994,19.9981L 18.9994,3.99807C 18.9994,2.89406 18.1034,1.99807 16.9994,1.99807 Z \"/></svg>";
    } else if (cmd == "volume") {
        return "<svg class=\"svgSmall\" viewBox=\"0 0 24.00 24.00\"><path style=\"fill:currentColor\" d=\"M 3,9.00002L 6.99998,9.00004L 12,4.00002L 12,20L 6.99998,15L 2.99998,15L 3,9.00002 Z M 20.9999,12.0001C 20.9999,16.2832 18.008,19.8676 14,20.777L 14,18.7102C 16.8914,17.8496 18.9999,15.1711 18.9999,12.0001C 18.9999,8.8291 16.8914,6.15058 14,5.29L 14,3.22307C 18.008,4.13255 20.9999,7.71688 20.9999,12.0001 Z M 17,12C 17,14.0503 15.7659,15.8124 14,16.584L 14,7.41605C 15.7659,8.1876 17,9.94968 17,12 Z \"/></svg>";
    } else if (cmd == "menu") {
        return "<svg class=\"svgSmall\" viewBox=\"0 0 512 512\"><path style=\"fill:currentColor;fill-opacity:1;stroke:none\" d=\"M64 128h384v42.667H64V128m0 106.667h384v42.666H64v-42.666m0 106.666h384V384H64v-42.667z\"/></svg>";
    }
    if (curIcon == 'circle') {
        if (cmd == "prev"){
            return "<svg class=\"svgMedium\" viewBox=\"0 0 24.00 24.00\"><path style=\"fill:currentColor\" d=\"M 12.0025,2.0025C 17.525,2.0025 22.0025,6.475 22.0025,12.0025C 22.0025,17.525 17.525,22.0025 12.0025,22.0025C 6.475,22.0025 2.0025,17.525 2.0025,12.0025C 2.0025,6.475 6.475,2.0025 12.0025,2.0025 Z M 12.0025,3.99875C 7.5875,3.99875 3.99875,7.5875 3.99875,12.0025C 3.99875,16.4113 7.5875,20 12.0025,20C 16.4112,20 20,16.4113 20,12.0025C 20,7.5875 16.4112,3.99875 12.0025,3.99875 Z M 16.0012,7.9975L 16.0012,16.0012L 11.0013,12.0025M 10,7.9975L 10,16.0012L 7.9975,16.0012L 7.9975,7.9975\"/></svg>";
        } else if (cmd == "next") {
            return "<svg class=\"svgMedium\" viewBox=\"0 0 24.00 24.00\"><path style=\"fill:currentColor\" d=\"M 12.0025,2.0025C 6.475,2.0025 2.0025,6.475 2.0025,12.0025C 2.0025,17.525 6.475,22.0025 12.0025,22.0025C 17.525,22.0025 22.0025,17.525 22.0025,12.0025C 22.0025,6.475 17.525,2.0025 12.0025,2.0025 Z M 12.0025,3.99875C 16.4112,3.99875 20,7.5875 20,12.0025C 20,16.4113 16.4112,20 12.0025,20C 7.5875,20 3.99875,16.4113 3.99875,12.0025C 3.99875,7.5875 7.5875,3.99875 12.0025,3.99875 Z M 7.9975,7.9975L 7.9975,16.0012L 12.9975,12.0025M 13.9987,7.9975L 13.9987,16.0012L 16.0012,16.0012L 16.0012,7.9975\"/></svg>";
        } else if (cmd == "play") {
            return "<svg class=\"svgLarge\" viewBox=\"0 0 24.00 24.00\"><path style=\"fill:currentColor\" d=\"M 12,20C 7.589,20 4.00001,16.411 4.00001,12C 4.00001,7.589 7.589,4.00001 12,4.00001C 16.411,4.00001 20,7.589 20,12C 20,16.411 16.411,20 12,20 Z M 12,2.00001C 6.477,2.00001 2.00001,6.477 2.00001,12C 2.00001,17.523 6.477,22 12,22C 17.523,22 22,17.523 22,12C 22,6.477 17.523,2.00001 12,2.00001 Z M 10,16.5L 16,12L 10,7.50001L 10,16.5 Z \"/></svg>";
        } else if (cmd == "pause") {
            return "<svg class=\"svgLarge\" viewBox=\"0 0 24.00 24.00\"><path style=\"fill:currentColor\" d=\"M 13,16L 13,8L 15,8L 15,16L 13,16 Z M 8.99994,16L 8.99994,8.00004L 10.9999,8.00004L 10.9999,16L 8.99994,16 Z M 12,2C 17.5228,2 22,6.47716 22,12C 22,17.5229 17.5228,22 12,22C 6.47715,22 2,17.5229 2,12C 2,6.47716 6.47715,2 12,2 Z M 12,4C 7.58172,4 4,7.58173 4,12C 4,16.4183 7.58172,20 12,20C 16.4183,20 20,16.4183 20,12C 20,7.58173 16.4183,4 12,4 Z \"/></svg>";
        } else if (cmd == "stop") {
            return "<svg class=\"svgLarge\"  viewBox=\"0 0 24.00 24.00\"><path style=\"fill:currentColor\" d=\"M 12.0025,2.0025C 6.475,2.0025 2.0025,6.475 2.0025,12.0025C 2.0025,17.525 6.475,22.0025 12.0025,22.0025C 17.525,22.0025 22.0025,17.525 22.0025,12.0025C 22.0025,6.475 17.525,2.0025 12.0025,2.0025 Z M 12.0025,3.99875C 16.4112,3.99875 20,7.5875 20,12.0025C 20,16.4113 16.4112,20 12.0025,20C 7.5875,20 3.99875,16.4113 3.99875,12.0025C 3.99875,7.5875 7.5875,3.99875 12.0025,3.99875 Z M 8.99875,8.99875L 8.99875,15L 15,15L 15,8.99875\"/></svg>";
        }
    }
    else if (curIcon == 'standard') {
        if (cmd == "prev"){
            return "<svg class=\"svgMedium\" viewBox=\"0 0 24.00 24.00\"><path style=\"fill:currentColor\" d=\"M 6,17.9997L 6,5.99972L 8,5.99972L 8,17.9997L 6,17.9997 Z M 9.5,12L 18,6L 18,18L 9.5,12 Z \"/></svg>";
        } else if (cmd == "next") {
            return "<svg class=\"svgMedium\" viewBox=\"0 0 24.00 24.00\"><path style=\"fill:currentColor\" d=\"M 16,18L 18,18L 18,5.99999L 16,5.99999M 6,18L 14.5,12L 6,5.99999L 6,18 Z \"/></svg>";
        } else if (cmd == "play") {
            return "<svg class=\"svgLarge\" viewBox=\"0 0 24.00 24.00\"><path style=\"fill:currentColor\" d=\"M 7.99939,5.13684L 7.99939,19.1368L 18.9994,12.1368L 7.99939,5.13684 Z \"/></svg>";
        } else if (cmd == "pause") {
            return "<svg class=\"svgLarge\" viewBox=\"0 0 24.00 24.00\"><path style=\"fill:currentColor\" d=\"M 14,19L 18,19L 18,4.99999L 14,4.99999M 6,19L 10,19L 10,4.99999L 6,4.99999L 6,19 Z \"/></svg>";
        } else if (cmd == "stop") {
            return "<svg class=\"svgLarge\" viewBox=\"0 0 24.00 24.00\"><path style=\"fill:currentColor\" d=\"M 18,18L 6,18L 5.99988,6.00011L 18,5.99999L 18,18 Z \"/></svg>";
        }
    }
}
