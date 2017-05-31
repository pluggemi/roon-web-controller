var socket = io();

var cssBackgroundColor;
var cssForegroundColor;
var curDisplayName;
var curTheme;
var curZone;
var curZoneID;
var lastLine1;
var lastLine2;
var lastLine3;
var lastPicture;
var lastTitle;

$(document).ready(function() {
    curZoneID = readCookie('curZoneID');
    curDisplayName = readCookie('curDisplayName');
    curTheme = readCookie('curTheme');

    $("#menuButton").attr("onclick", "showOverlay(\'overlayMainMenu\')").html(getSVG('menu'));
    $("#nowPlaying").show();
    $("#libraryBrowser").hide();

    $("#controlZone").attr("onclick", "showOverlay(\'overlayZoneList\')").html(getSVG('zone') + "<br><span id=\"zoneName\">No Zone</span>");

    if (curDisplayName != null){
        $("#zoneName").html(curDisplayName);
    }

    if (curZoneID == null) {
        showOverlay('overlayZoneList');
    }

    setTheme(curTheme);
});

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

    if ( lastLine1 != curZone.now_playing.three_line.line1) {
        lastLine1 = curZone.now_playing.three_line.line1;
        $("#line1")
        .html(curZone.now_playing.three_line.line1)
        .simplemarquee({
            cycles: Infinity,
            delayBetweenCycles: 5000,
            handleHover: false
        });
    };

    if ( lastLine2 != curZone.now_playing.three_line.line2) {
        lastLine2 = curZone.now_playing.three_line.line2;
        $("#line2")
        .html(curZone.now_playing.three_line.line2)
        .simplemarquee({
            cycles: Infinity,
            delayBetweenCycles: 5000,
            handleHover: false
        });
    };

    if ( lastLine3 != curZone.now_playing.three_line.line3) {
        lastLine3 = curZone.now_playing.three_line.line3;
        $("#line3")
        .html(curZone.now_playing.three_line.line3)
        .simplemarquee({
            cycles: Infinity,
            delayBetweenCycles: 5000,
            handleHover: false
        });
    };

    if (lastTitle != curZone.now_playing.one_line.line1) {
        lastTitle = curZone.now_playing.one_line.line1;
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

    if ( lastPicture != curZone.now_playing.image_key ) {
        lastPicture = curZone.now_playing.image_key;

        if ( curZone.now_playing.image_key == null ) {
            imgUrl = "/img/transparent.png";

        } else {
            imgUrl = "/roonapi/getImage?image_key=" + curZone.now_playing.image_key;
        }

        $("#coverImageDiv").html("<img src=\"" + imgUrl + "\" id=\"coverImage\">");
        $("#coverBackground").css("background-image", "url(" + imgUrl + ")");
    };

    if ( curZone.is_previous_allowed == true ) {
        $("#controlPrev").attr("onclick", "goCmd(\'prev\', \'" + curZone.zone_id + "\')").html(getSVG('prev')).css("fill-opacity", "1");
    } else {
        $("#controlPrev").html(getSVG('prev')).css("fill-opacity", "0.33");
    };

    if ( curZone.is_next_allowed == true ) {
        $("#controlNext").attr("onclick", "goCmd(\'next\', \'" + curZone.zone_id + "\')").html(getSVG('next')).css("fill-opacity", "1");
    } else {
        $("#controlNext").html(getSVG('next')).css("fill-opacity", "0.33");
    }

    if ( curZone.is_play_allowed == true ) {
        $("#controlPlayPauseStop").attr("onclick", "goCmd(\'play\', \'" + curZone.zone_id + "\')").html(getSVG('play')).css("fill-opacity", "1");
    } else if ( curZone.state == "playing" && curZone.is_play_allowed == false ) {
        if ( curZone.is_pause_allowed == true ) {
            $("#controlPlayPauseStop").attr("onclick", "goCmd(\'pause\', \'" + curZone.zone_id + "\')").html(getSVG('pause')).css("fill-opacity", "1");
        } else {
            $("#controlPlayPauseStop").attr("onclick", "goCmd(\'stop\', \'" + curZone.zone_id + "\')").html(getSVG('stop')).css("fill-opacity", "1");
        }
    } else {
        $("#controlPlayPauseStop").html(getSVG('play')).css("fill-opacity", "0.33");
    }

//     $("#controlRepeat").html(getSVG('repeat'));
//     $("#controlShuffle").html(getSVG('shuffle'));
    $("#controlVolume").attr("onclick", "showOverlay(\'overlayVolume\')").html(getSVG('volume'));
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
    } else if (overlay == "overlayMainMenu") {
        $("#overlayMainMenu").hide();
    }
}

function setTheme(curTheme) {
    if (curTheme == null) {
        curTheme = "dark";
        setCookie('curTheme', curTheme);
        showTheme(curTheme);
    } else {
        setCookie('curTheme', curTheme);
        showTheme(curTheme);
    }
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

function getSVG(cmd) {
    if (cmd == "zone") {
        return "<svg class=\"svgSmall\"  viewBox=\"0 0 52 72\"><g transform=\"matrix(-1 0 0 1 76 -966.36)\"><path style=\"fill:currentColor;stroke:none\" transform=\"translate(0 952.36)\" d=\"m30 14c-3.2894 0-6 2.7106-6 6v60c0 3.2894 2.7106 6 6 6h40c3.2894 0 6-2.7106 6-6v-60c0-3.2894-2.7106-6-6-6zm0 4h40c1.1426 0 2 0.85741 2 2v60c0 1.1426-0.85741 2-2 2h-40c-1.1426 0-2-0.8574-2-2v-60c0-1.1426 0.85741-2 2-2zm3 3c-1.1046 0-2 0.89543-2 2s0.89543 2 2 2 2-0.89543 2-2-0.89543-2-2-2zm17 0c-5.4992 0-10 4.5008-10 10s4.5008 10 10 10 10-4.5008 10-10-4.5008-10-10-10zm17 0c-1.1046 0-2 0.89543-2 2s0.89543 2 2 2 2-0.89543 2-2-0.89543-2-2-2zm-17 4c3.3374 0 6 2.6626 6 6s-2.6626 6-6 6-6-2.6626-6-6 2.6626-6 6-6zm0 4c-1.1046 0-2 0.89543-2 2s0.89543 2 2 2 2-0.89543 2-2-0.89543-2-2-2zm0 18c-8.8129 0-16 7.1871-16 16s7.1871 16 16 16 16-7.1871 16-16-7.1871-16-16-16zm0 4c6.6511 0 12 5.3489 12 12s-5.3489 12-12 12-12-5.3489-12-12 5.3489-12 12-12zm0 6c-3.29 0-6 2.71-6 6s2.71 6 6 6 6-2.71 6-6-2.71-6-6-6zm0 4c1.1283 0 2 0.8717 2 2s-0.87174 2-2 2-2-0.8717-2-2 0.87174-2 2-2zm-17 14c-1.1046 0-2 0.89543-2 2s0.89543 2 2 2 2-0.89543 2-2-0.89543-2-2-2zm34 0c-1.1046 0-2 0.89543-2 2s0.89543 2 2 2 2-0.89543 2-2-0.89543-2-2-2z\"/></g></svg>";
    } else if (cmd == "volume") {
        return "<svg class=\"svgSmall\" viewBox=\"0 0 22 22\"><path style=\"fill:currentColor;fill-opacity:1;stroke:none\" d=\"M 10.988281 3 L 6 7.9902344 L 6 8 L 6 9 L 6 13 L 6 14 L 6 14.009766 L 10.988281 19 L 12 19 L 12 18.597656 L 12 3.4023438 L 12 3 L 10.988281 3 z M 14.324219 7.28125 L 13.785156 8.1425781 A 4 4 0 0 1 15 11 A 4 4 0 0 1 13.789062 13.861328 L 14.328125 14.724609 A 5 5 0 0 0 16 11 A 5 5 0 0 0 14.324219 7.28125 z M 3 8 L 3 9 L 3 13 L 3 14 L 5 14 L 5 13 L 5 9 L 5 8 L 3 8 z \"/><path style=\"fill:currentColor;fill-opacity:0.25;stroke:none\" d=\"M 13.865234 3.5371094 L 13.621094 4.5136719 A 7 7 0 0 1 18 11 A 7 7 0 0 1 13.619141 17.478516 L 13.863281 18.453125 A 8 8 0 0 0 19 11 A 8 8 0 0 0 13.865234 3.5371094 z \"/></svg>";
    } else if (cmd == "prev"){
        return "<svg class=\"svgMedium\" max-width=\"72px\" max-height=\"72px\" viewBox=\"0 0 32 32\"><path style=\"fill:currentColor;stroke:none\" d=\"M 16.001953 3.9980469 A 12 12 0 0 0 4.0019531 15.998047 A 12 12 0 0 0 16.001953 27.998047 A 12 12 0 0 0 28.001953 15.998047 A 12 12 0 0 0 16.001953 3.9980469 z M 16.001953 4.9980469 A 11 11 0 0 1 27.001953 15.998047 A 11 11 0 0 1 16.001953 26.998047 A 11 11 0 0 1 5.0019531 15.998047 A 11 11 0 0 1 16.001953 4.9980469 z M 11 12 L 11 20 L 13 20 L 13 12 L 11 12 z M 21 12 L 14 16 L 21 20 L 21 12 z \"/></svg>";
    } else if (cmd == "next") {
        return "<svg class=\"svgMedium\" viewBox=\"0 0 32 32\"><path style=\"fill:currentColor;stroke:none\" d=\"M 16.001953 3.9980469 A 12 12 0 0 0 4.0019531 15.998047 A 12 12 0 0 0 16.001953 27.998047 A 12 12 0 0 0 28.001953 15.998047 A 12 12 0 0 0 16.001953 3.9980469 z M 16.001953 4.9980469 A 11 11 0 0 1 27.001953 15.998047 A 11 11 0 0 1 16.001953 26.998047 A 11 11 0 0 1 5.0019531 15.998047 A 11 11 0 0 1 16.001953 4.9980469 z M 11 12 L 11 20 L 18 16 L 11 12 z M 19 12 L 19 20 L 21 20 L 21 12 L 19 12 z \"/></svg>";
    } else if (cmd == "play") {
        return "<svg class=\"svgLarge\" viewBox=\"0 0 32 32\"><path style=\"fill:currentColor;stroke:none\" d=\"M 16.001953 3.9980469 A 12 12 0 0 0 4.0019531 15.998047 A 12 12 0 0 0 16.001953 27.998047 A 12 12 0 0 0 28.001953 15.998047 A 12 12 0 0 0 16.001953 3.9980469 z M 16.001953 4.9980469 A 11 11 0 0 1 27.001953 15.998047 A 11 11 0 0 1 16.001953 26.998047 A 11 11 0 0 1 5.0019531 15.998047 A 11 11 0 0 1 16.001953 4.9980469 z M 13 12 L 13 20 L 20 16 L 13 12 z \"/></svg>";
    } else if (cmd == "pause") {
        return "<svg class=\"svgLarge\" viewBox=\"0 0 32 32\"><path style=\"fill:currentColor;fill-opacity:1;stroke:none\" d=\"M 16.001953 3.9980469 A 12 12 0 0 0 4.0019531 15.998047 A 12 12 0 0 0 16.001953 27.998047 A 12 12 0 0 0 28.001953 15.998047 A 12 12 0 0 0 16.001953 3.9980469 z M 16.001953 4.9980469 A 11 11 0 0 1 27.001953 15.998047 A 11 11 0 0 1 16.001953 26.998047 A 11 11 0 0 1 5.0019531 15.998047 A 11 11 0 0 1 16.001953 4.9980469 z M 12 12 L 12 20 L 14 20 L 14 12 L 12 12 z M 18 12 L 18 20 L 20 20 L 20 12 L 18 12 z \"/></svg>";
    } else if (cmd == "stop") {
        return "<svg class=\"svgLarge\" viewBox=\"0 0 32 32\"><path style=\"fill:currentColor;fill-opacity:1;stroke:none\" d=\"M 16.001953 3.9980469 A 12 12 0 0 0 4.0019531 15.998047 A 12 12 0 0 0 16.001953 27.998047 A 12 12 0 0 0 28.001953 15.998047 A 12 12 0 0 0 16.001953 3.9980469 z M 16.001953 4.9980469 A 11 11 0 0 1 27.001953 15.998047 A 11 11 0 0 1 16.001953 26.998047 A 11 11 0 0 1 5.0019531 15.998047 A 11 11 0 0 1 16.001953 4.9980469 z M 12 12 L 12 20 L 20 20 L 20 12 L 12 12 z \"/></svg>";
    } else if (cmd == "menu") {
        return "<svg class=\"svgSmall\" viewBox=\"0 0 512 512\"><path style=\"fill:currentColor;fill-opacity:1;stroke:none\" d=\"M64 128h384v42.667H64V128m0 106.667h384v42.666H64v-42.666m0 106.666h384V384H64v-42.667z\"/></svg>";
    } else if (cmd == "repeat") {
        return "<svg class=\"svgSmall\" viewBox=\"0 0 32 32\"><path style=\"fill:currentColor;fill-opacity:1;stroke:none\" d=\"M 16.001953 3.9980469 A 12 12 0 0 0 4.0019531 15.998047 A 12 12 0 0 0 16.001953 27.998047 A 12 12 0 0 0 28.001953 15.998047 A 12 12 0 0 0 16.001953 3.9980469 z M 16.001953 4.9980469 A 11 11 0 0 1 27.001953 15.998047 A 11 11 0 0 1 16.001953 26.998047 A 11 11 0 0 1 5.0019531 15.998047 A 11 11 0 0 1 16.001953 4.9980469 z M 10 12 L 10 20 L 11 20 L 11 13 L 21 13 L 21 19 L 18 19 L 18 17.5 L 14 19.5 L 18 21.5 L 18 20 L 22 20 L 22 12 L 11 12 L 10 12 z \"/></svg>";
    } else if (cmd == "shuffle") {
        return "<svg class=\"svgSmall\" viewBox=\"0 0 32 32\"> <path style=\"fill:currentColor;fill-opacity:1;stroke:none\" d=\"M 16.001953 3.9980469 A 12 12 0 0 0 4.0019531 15.998047 A 12 12 0 0 0 16.001953 27.998047 A 12 12 0 0 0 28.001953 15.998047 A 12 12 0 0 0 16.001953 3.9980469 z M 16.001953 4.9980469 A 11 11 0 0 1 27.001953 15.998047 A 11 11 0 0 1 16.001953 26.998047 A 11 11 0 0 1 5.0019531 15.998047 A 11 11 0 0 1 16.001953 4.9980469 z M 20 10.5 L 20 12 L 17.560547 12 L 15.001953 15.201172 L 12.439453 12 L 11.160156 12 L 8 12 L 8 13 L 11.960938 13 L 14.359375 16 L 11.960938 19 L 8 19 L 8 20 L 12.4375 20 L 15.001953 16.798828 L 17.5625 20 L 20 20 L 20 21.5 L 24 19.5 L 20 17.5 L 20 19 L 18.039062 19 L 15.640625 16 L 18.039062 13 L 20 13 L 20 14.5 L 24 12.5 L 20 10.5 z \" /></svg>";
    }
}
