var socket = io();
var curZone;
var css = [];
var settings = [];
var state = [];

$(document).ready(function() {
    settings['zoneID'] = readCookie('settings[\'zoneID\']');
    settings['displayName'] = readCookie('settings[\'displayName\']');
    settings['theme'] = readCookie('settings[\'theme\']');
    settings['iconTheme'] = readCookie('settings[\'iconTheme\']');
    settings['statusBar'] = readCookie('settings[\'statusBar\']');

    if (settings['zoneID'] == null) {
        $("#overlayZoneList").show();
    }

    if (settings['displayName'] != null){
        $("#statusZoneName").html(settings['displayName']);
    }

    if (settings['theme'] == null) {
        settings['theme'] = "coverDark";
        setCookie('settings[\'theme\']', settings['theme']);
    };

    if (settings['iconTheme'] == null) {
        settings['iconTheme'] = "circle";
        setCookie('settings[\'iconTheme\']', settings['iconTheme']);
    }

    if (settings['statusBar'] == "hide") {
        $('#statusBar').hide();
    } else if (settings['statusBar'] == "show") {
        $('#statusBar').show();
    } else {
        settings['statusBar'] = "show";
        setCookie('settings[\'statusBar\']', settings['statusBar']);
        $('#statusBar').show();
    }

    setTheme(settings['theme']);

    $("#nowPlaying").show();
    $("#libraryBrowser").hide();
    startTime();
    overlayButtons();

    socket.on("zoneList", function(payload) {
        updateZoneList(payload);
    });

    socket.on("zoneStatus", function(payload) {
        if (settings['zoneID'] != null){
            for (x in payload){
                if (payload[x].zone_id == settings['zoneID']) {
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
    $(".buttonOverlay").css("background-color", css['foregroundColor']).css("color", css['backgroundColor']);
}

function selectZone(zone_id, display_name) {
    settings['zoneID'] = zone_id;
    setCookie('settings[\'zoneID\']', settings['zoneID']);

    settings['displayName'] = display_name;
    setCookie('settings[\'displayName\']', settings['displayName']);
    $("#statusZoneName").html(settings['displayName']);

    $("#overlayZoneList").hide();
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

    if ( state['Line1'] != curZone.now_playing.three_line.line1) {
        state['Line1'] = curZone.now_playing.three_line.line1;
        $("#line1")
        .html(curZone.now_playing.three_line.line1)
        .simplemarquee({
            cycles: Infinity,
            delayBetweenCycles: 5000,
            handleHover: false
        });
    };

    if ( state['Line2'] != curZone.now_playing.three_line.line2) {
        state['Line2'] = curZone.now_playing.three_line.line2;
        $("#line2")
        .html(curZone.now_playing.three_line.line2)
        .simplemarquee({
            cycles: Infinity,
            delayBetweenCycles: 5000,
            handleHover: false
        });
    };

    if ( state['Line3'] != curZone.now_playing.three_line.line3) {
        state['Line3'] = curZone.now_playing.three_line.line3;
        $("#line3")
        .html(curZone.now_playing.three_line.line3)
        .simplemarquee({
            cycles: Infinity,
            delayBetweenCycles: 5000,
            handleHover: false
        });
    };

    if (state['Title'] != curZone.now_playing.one_line.line1) {
        state['Title'] = curZone.now_playing.one_line.line1;
        $(document).prop("title", curZone.now_playing.one_line.line1);
    };

    if ( curZone.is_seek_allowed == true ) {
        $("#line4").show();
        $("#line5").show();
        $("#seekPosition").html(secondsConvert(curZone.now_playing.seek_position));
        $("#seekLength").html(secondsConvert(curZone.now_playing.length));
        $("#trackSeekValue")
        .css("width", Math.round((curZone.now_playing.seek_position / curZone.now_playing.length) * 100) + "%");
    } else {
        $("#line4").hide();
        $("#line5").hide();
    };

    if ( state['image_key'] != curZone.now_playing.image_key ) {
        state['image_key'] = curZone.now_playing.image_key;

        if ( curZone.now_playing.image_key == null ) {
            imgUrl = "/img/transparent.png";

        } else {
            imgUrl = "/roonapi/getImage?image_key=" + curZone.now_playing.image_key;
        }

        $("#coverImageDiv").html("<img src=\"" + imgUrl + "\" id=\"coverImage\">");

        if (settings['theme'] == "coverDark" || settings['theme'] == "coverLight") {
            $("#coverBackground").css("background-image", "url(" + imgUrl + ")");
        }

        if (settings['theme'] == "color"){
            var colorThief = new ColorThief();
            colorThief.getColorAsync(imgUrl, function(color){
                r = color[0];
                g = color[1];
                b = color[2];
                $("#colorBackground").css("background-color", 'rgb('+ r +','+ g +','+ b +')');

                yiq = ((r*299)+(g*587)+(b*114))/1000;
                if (yiq >= 128) {
                    css['backgroundColor'] = "#eff0f1";
                    css['foregroundColor'] = "#232629";
                    css['trackSeek'] = "rgba(35, 38, 41, 0.33)"
                } else {
                    css['backgroundColor'] = "#232629";
                    css['foregroundColor'] = "#eff0f1";
                    css['trackSeek'] = "rgba(239, 240, 241, 0.33)";
                }
                showTheme('color');
            });
        }
    };

    if (state['Prev'] != curZone.is_previous_allowed || state['Prev'] == null) {
        state['Prev'] = curZone.is_previous_allowed;
        if ( curZone.is_previous_allowed == true ) {
            $("#controlPrev").attr("onclick", "goCmd(\'prev\', \'" + curZone.zone_id + "\')").html(getSVG('prev', settings['iconTheme'])).css("fill-opacity", "1");
        } else {
            $("#controlPrev").html(getSVG('prev', settings['iconTheme'])).css("fill-opacity", "0.33");
        };
    };

    if (state['Next'] != curZone.is_next_allowed || state['Next'] == null) {
        state['Next'] = curZone.is_next_allowed;
        if ( curZone.is_next_allowed == true ) {
            $("#controlNext").attr("onclick", "goCmd(\'next\', \'" + curZone.zone_id + "\')").html(getSVG('next', settings['iconTheme'])).css("fill-opacity", "1");
        } else {
            $("#controlNext").html(getSVG('next', settings['iconTheme'])).css("fill-opacity", "0.33");
        }
    }

    if ( curZone.is_play_allowed == true ) {
        state['PlayPauseStop'] = "showPlay";
    } else if ( curZone.state == "playing" && curZone.is_play_allowed == false ) {
        if ( curZone.is_pause_allowed == true ) { state['PlayPauseStop'] = "showPause"; }
        else { state['PlayPauseStop'] = "showStop"; }
    } else {
        state['PlayPauseStop'] = "showPlayDisabled";
    }

    if (state['PlayPauseStopLast'] != state['PlayPauseStop'] || state['PlayPauseStop'] == null) {
        state['PlayPauseStopLast'] = state['PlayPauseStop'];
        if ( state['PlayPauseStop'] == "showPlay") {
            $("#controlPlayPauseStop").attr("onclick", "goCmd(\'play\', \'" + curZone.zone_id + "\')").html(getSVG('play', settings['iconTheme'])).css("fill-opacity", "1");
        } else if (state['PlayPauseStop'] == "showPause") {
            $("#controlPlayPauseStop").attr("onclick", "goCmd(\'pause\', \'" + curZone.zone_id + "\')").html(getSVG('pause', settings['iconTheme'])).css("fill-opacity", "1");
        } else if (state['PlayPauseStop'] == "showStop") {
            $("#controlPlayPauseStop").attr("onclick", "goCmd(\'pause\', \'" + curZone.zone_id + "\')").html(getSVG('stop', settings['iconTheme'])).css("fill-opacity", "1");
        } else if (state['PlayPauseStop'] == "showPlayDisabled") {
            $("#controlPlayPauseStop").html(getSVG('play', settings['iconTheme'])).css("fill-opacity", "0.33");
            $(document).prop("title", "Roon Web Controller");
        }
    }


    if (state['Loop'] != curZone.settings.loop || state['Loop'] == null) {
        state['Loop'] = curZone.settings.loop;
        if (state['Loop'] == "disabled"){
            $("#statusLoop").html(getSVG('loop', settings['iconTheme'])).css("fill-opacity", "0.33");
            $("#buttonLoopOff svg").addClass("selected");
            $("#buttonLoopAll svg").removeClass("selected");
            $("#buttonLoopOne svg").removeClass("selected");
        } else if (state['Loop'] == "loop"){
            // yes this looks weird - but the node-roon-api does not match the roon client view
            $("#statusLoop").html(getSVG('loopOne', settings['iconTheme'])).css("fill-opacity", "1");
            $("#buttonLoopOff svg").removeClass("selected");
            $("#buttonLoopAll svg").removeClass("selected");
            $("#buttonLoopOne svg").addClass("selected");
        } else if (state['Loop'] == "loop_one"){
            // yes this looks weird - but the node-roon-api does not match the roon client view
            $("#statusLoop").html(getSVG('loop', settings['iconTheme'])).css("fill-opacity", "1");
            $("#buttonLoopOff svg").removeClass("selected");
            $("#buttonLoopAll svg").addClass("selected");
            $("#buttonLoopOne svg").removeClass("selected");
        }
    }

    if (state['Shuffle'] != curZone.settings.shuffle || state['Shuffle'] == null) {
        state['Shuffle'] = curZone.settings.shuffle;
        if (state['Shuffle'] == false) {
            $("#statusShuffle").html(getSVG('shuffle', settings['iconTheme'])).css("fill-opacity", "0.33");
            $("#buttonShuffleOff svg").addClass("selected");
            $("#buttonShuffleOn svg").removeClass("selected");
        } else if (state['Shuffle'] == true) {
            $("#statusShuffle svg").html(getSVG('shuffle', settings['iconTheme'])).css("fill-opacity", "1");
            $("#buttonShuffleOff svg").removeClass("selected");
            $("#buttonShuffleOn svg").addClass("selected");
        }
    }

    if (state['Radio'] != curZone.settings.auto_radio || state['Radio'] == null) {
        state['Radio'] = curZone.settings.auto_radio;
        if (state['Radio'] == false) {
            $("#statusRadio").html(getSVG('radio', settings['iconTheme'])).css("fill-opacity", "0.33");
            $("#buttonRadioOff svg").addClass("selected");
            $("#buttonRadioOn svg").removeClass("selected");
        } else if (state['Radio'] == true) {
            $("#statusRadio").html(getSVG('radio', settings['iconTheme'])).css("fill-opacity", "1");
            $("#buttonRadioOff svg").removeClass("selected");
            $("#buttonRadioOn svg").addClass("selected");
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
    $("#statusLoop").html(getSVG('loop', settings['iconTheme'])).css("fill-opacity", "0.33");
    $("#statusShuffle").html(getSVG('shuffle', settings['iconTheme'])).css("fill-opacity", "0.33");
    $("#statusRadio").html(getSVG('radio', settings['iconTheme'])).css("fill-opacity", "0.33");
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

function toggleStatusBar(cmd) {
    if (cmd == "show"){
        $('#statusBar').show();
        settings['statusBar'] = "show";
        setCookie('settings[\'statusBar\']', "show");
        startTime();
    } else if (cmd == "hide"){
        $('#statusBar').hide();
        settings['statusBar'] = "hide";
        setCookie('settings[\'statusBar\']', "hide");
        startTime();
    }
}

function setIcon(icon) {
    settings['iconTheme'] = icon;
    setCookie('settings[\'iconTheme\']', settings['iconTheme']);
    state['Prev'] = null;
    state['PlayPauseStopLast'] = null;
    state['Next'] = null;
    overlayButtons();
}

function overlayButtons() {
    $("#menuButton").html(getSVG('menu', settings['iconTheme']));
    $("#buttonZone").html(getSVG('zone', settings['iconTheme']));
    $("#buttonVolume").html(getSVG('volume', settings['iconTheme']));
    $("#buttonLoop").html(getSVG('loop', settings['iconTheme']));
    $("#buttonShuffle").html(getSVG('shuffle', settings['iconTheme']));
    $("#buttonRadio").html(getSVG('radio', settings['iconTheme']));

    $("#buttonLoopOff").html(getSVG('loopOff', settings['iconTheme']));
    $("#buttonLoopOne").html(getSVG('loopOne', settings['iconTheme']));
    $("#buttonLoopAll").html(getSVG('loop', settings['iconTheme']));

    $("#buttonShuffleOff").html(getSVG('shuffleOff', settings['iconTheme']));
    $("#buttonShuffleOn").html(getSVG('shuffle', settings['iconTheme']));

    $("#buttonRadioOff").html(getSVG('radio', settings['iconTheme'])).css("fill-opacity", "0.33");;
    $("#buttonRadioOn").html(getSVG('radio', settings['iconTheme'])).css("fill-opacity", "1");;

    $("#buttonIconStandard").html(getSVG('play', 'standard'));
    $("#buttonIconCircle").html(getSVG('play', 'circle'));
}

function setTheme(theme) {
    setCookie('settings[\'theme\']', theme);
    showTheme(theme);
}

function showTheme(theme) {
    if (theme == "dark") {
        css['backgroundColor'] = "#232629";
        css['foregroundColor'] = "#eff0f1";
        css['trackSeek'] = "rgba(239, 240, 241, 0.33)";

        $("#coverBackground").hide();
        $("#colorBackground").hide();
    }
    else if (theme == "light") {
        css['backgroundColor'] = "#eff0f1";
        css['foregroundColor'] = "#232629";
        css['trackSeek'] = "rgba(35, 38, 41, 0.33)"

        $("#coverBackground").hide();
        $("#colorBackground").hide();
    }
    else if (theme == "coverDark") {
        css['backgroundColor'] = "#232629";
        css['foregroundColor'] = "#eff0f1";
        css['trackSeek'] = "rgba(239, 240, 241, 0.33)";

        state['image_key'] = null;
        $("#coverBackground").show();
        $("#colorBackground").hide();
    }
    else if (theme == "coverLight") {
        css['backgroundColor'] = "#eff0f1";
        css['foregroundColor'] = "#232629";
        css['trackSeek'] = "rgba(35, 38, 41, 0.33)"

        state['image_key'] = null;
        $("#coverBackground").show();
        $("#colorBackground").hide();
    }
    else if (theme == "color") {
        $("#coverBackground").hide();
        $("#colorBackground").show();
    }
    else {
        settings['theme'] = null;
        setTheme(settings['theme']);
    }

    settings['theme'] = theme;
    $("body").css("background-color", css['backgroundColor']).css("color", css['foregroundColor']);
    $(".buttonTrans").css("color", css['foregroundColor']);
    $(".buttonOverlay").css("background-color", css['foregroundColor']).css("color", css['backgroundColor']);
    $(".buttonStatusBar").css("color", css['foregroundColor']);
    $(".overlayContent").css("background-color", css['backgroundColor']);
    $("#trackSeek").css("background-color", css['trackSeek']);
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

// For clock applet
function startTime() {
    if (settings['statusBar'] == "show"){
        $("#clock").html(moment().format('LTS'));
        var t = setTimeout(startTime, 1000);
    }
}

function getSVG(cmd, theme) {
    if (cmd == "zone") {
        return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 11.9994,11.9981C 10.3434,11.9981 8.99943,13.3421 8.99943,14.9981C 8.99943,16.6541 10.3434,17.9981 11.9994,17.9981C 13.6554,17.9981 14.9994,16.6541 14.9994,14.9981C 14.9994,13.3421 13.6554,11.9981 11.9994,11.9981 Z M 11.9994,19.9981C 9.23942,19.9981 6.99943,17.7601 6.99943,14.9981C 6.99943,12.2361 9.23942,9.99807 11.9994,9.99807C 14.7604,9.99807 16.9994,12.2361 16.9994,14.9981C 16.9994,17.7601 14.7604,19.9981 11.9994,19.9981 Z M 11.9994,3.99807C 13.1024,3.99807 13.9994,4.89406 13.9994,5.99807C 13.9994,7.10207 13.1024,7.99807 11.9994,7.99807C 10.8934,7.99807 9.99943,7.10207 9.99943,5.99807C 9.99943,4.89406 10.8934,3.99807 11.9994,3.99807 Z M 16.9994,1.99807L 6.99943,1.99807C 5.89442,1.99807 4.99943,2.89406 4.99943,3.99807L 4.99943,19.9981C 4.99943,21.1021 5.89442,21.9881 6.99943,21.9881L 16.9994,21.9981C 18.1034,21.9981 18.9994,21.1021 18.9994,19.9981L 18.9994,3.99807C 18.9994,2.89406 18.1034,1.99807 16.9994,1.99807 Z \"/></svg>";
    } else if (cmd == "volume") {
        return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 3,9.00002L 6.99998,9.00004L 12,4.00002L 12,20L 6.99998,15L 2.99998,15L 3,9.00002 Z M 20.9999,12.0001C 20.9999,16.2832 18.008,19.8676 14,20.777L 14,18.7102C 16.8914,17.8496 18.9999,15.1711 18.9999,12.0001C 18.9999,8.8291 16.8914,6.15058 14,5.29L 14,3.22307C 18.008,4.13255 20.9999,7.71688 20.9999,12.0001 Z M 17,12C 17,14.0503 15.7659,15.8124 14,16.584L 14,7.41605C 15.7659,8.1876 17,9.94968 17,12 Z \"/></svg>";
    } else if (cmd == "menu") {
        return "<svg viewBox=\"0 0 512 512\"><path d=\"M64 128h384v42.667H64V128m0 106.667h384v42.666H64v-42.666m0 106.666h384V384H64v-42.667z\"/></svg>";
    } else if (cmd == "loop") {
        return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 17,17L 7,17L 7,14L 3,18L 7,22L 7,19L 19,19L 19,13L 17,13M 7,7L 17,7L 17,10L 21,6L 17,2L 17,5L 5,5L 5,11L 7,11L 7,7 Z \"/></svg>";
    } else if (cmd == "loopOne") {
        return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 13,15L 13,9L 12,9L 10,10L 10,11L 11.5,11L 11.5,15M 17,17L 7,17L 7,14L 3,18L 7,22L 7,19L 19,19L 19,13L 17,13M 7,7L 17,7L 17,10L 21,6L 17,2L 17,5L 5,5L 5,11L 7,11L 7,7 Z \"/></svg>";
    } else if (cmd == "loopOff") {
        return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 2,5.26848L 3.27711,4L 20,20.7229L 18.7315,22L 15.7315,19L 7,19L 7,22L 3,18L 7,14L 7,17L 13.7315,17L 7,10.2685L 7,11L 5,11L 5,8.26848L 2,5.26848 Z M 17,13L 19,13L 19,17.1773L 17,15.1773L 17,13 Z M 17,5.00001L 17,2.00001L 21,6.00001L 17,10L 17,7.00001L 8.82269,7.00001L 6.82269,5.00001L 17,5.00001 Z \"/></svg>";
    } else if (cmd == "shuffle") {
        return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 17,3L 22.25,7.50002L 17,12L 22.25,16.5L 17,21L 17,18L 14.2574,18L 11.4393,15.182L 13.5607,13.0607L 15.5,15L 17,15L 17,12L 17,9L 15.5,9L 6.49999,18L 2,18L 2,15L 5.25736,15L 14.2574,6L 17,6L 17,3 Z M 2,6.00001L 6.5,6.00001L 9.31802,8.81803L 7.1967,10.9393L 5.25737,9.00001L 2,9.00001L 2,6.00001 Z \"/></svg>";
    } else if (cmd == "shuffleOff") {
        return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 16.0012,4.5025L 16.0012,6.9925L 5,7.00625L 5,8.99875L 16.0012,8.99875L 16.0012,11.4987L 19.5025,7.9975M 16.0012,12.5L 16.0012,14.99L 5,15.005L 5,17.0025L 16.0012,17.0025L 16.0012,19.5025L 19.5025,16.0012\"/></svg>";
    } else if (cmd == "radio") {
        return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 20,6C 21.1046,6 22,6.89543 22,8L 22,20C 22,21.1046 21.1046,22 20,22L 4,22C 2.89543,22 2,21.1046 2,20L 2,8C 2,7.15034 2.52983,6.42443 3.27712,6.13463L 15.707,0.986006L 16.4724,2.83377L 8.82842,6L 20,6 Z M 20,8.00001L 4,8.00001L 4,12L 16,12L 16,10L 18,10L 18,12L 20,12L 20,8.00001 Z M 7,14C 5.34314,14 4,15.3431 4,17C 4,18.6569 5.34314,20 7,20C 8.65685,20 10,18.6569 10,17C 10,15.3431 8.65685,14 7,14 Z \"/></svg>";
    }
    if (theme == 'circle') {
        if (cmd == "prev"){
            return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 12.0025,2.0025C 17.525,2.0025 22.0025,6.475 22.0025,12.0025C 22.0025,17.525 17.525,22.0025 12.0025,22.0025C 6.475,22.0025 2.0025,17.525 2.0025,12.0025C 2.0025,6.475 6.475,2.0025 12.0025,2.0025 Z M 12.0025,3.99875C 7.5875,3.99875 3.99875,7.5875 3.99875,12.0025C 3.99875,16.4113 7.5875,20 12.0025,20C 16.4112,20 20,16.4113 20,12.0025C 20,7.5875 16.4112,3.99875 12.0025,3.99875 Z M 16.0012,7.9975L 16.0012,16.0012L 11.0013,12.0025M 10,7.9975L 10,16.0012L 7.9975,16.0012L 7.9975,7.9975\"/></svg>";
        } else if (cmd == "next") {
            return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 12.0025,2.0025C 6.475,2.0025 2.0025,6.475 2.0025,12.0025C 2.0025,17.525 6.475,22.0025 12.0025,22.0025C 17.525,22.0025 22.0025,17.525 22.0025,12.0025C 22.0025,6.475 17.525,2.0025 12.0025,2.0025 Z M 12.0025,3.99875C 16.4112,3.99875 20,7.5875 20,12.0025C 20,16.4113 16.4112,20 12.0025,20C 7.5875,20 3.99875,16.4113 3.99875,12.0025C 3.99875,7.5875 7.5875,3.99875 12.0025,3.99875 Z M 7.9975,7.9975L 7.9975,16.0012L 12.9975,12.0025M 13.9987,7.9975L 13.9987,16.0012L 16.0012,16.0012L 16.0012,7.9975\"/></svg>";
        } else if (cmd == "play") {
            return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 12,20C 7.589,20 4.00001,16.411 4.00001,12C 4.00001,7.589 7.589,4.00001 12,4.00001C 16.411,4.00001 20,7.589 20,12C 20,16.411 16.411,20 12,20 Z M 12,2.00001C 6.477,2.00001 2.00001,6.477 2.00001,12C 2.00001,17.523 6.477,22 12,22C 17.523,22 22,17.523 22,12C 22,6.477 17.523,2.00001 12,2.00001 Z M 10,16.5L 16,12L 10,7.50001L 10,16.5 Z \"/></svg>";
        } else if (cmd == "pause") {
            return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 13,16L 13,8L 15,8L 15,16L 13,16 Z M 8.99994,16L 8.99994,8.00004L 10.9999,8.00004L 10.9999,16L 8.99994,16 Z M 12,2C 17.5228,2 22,6.47716 22,12C 22,17.5229 17.5228,22 12,22C 6.47715,22 2,17.5229 2,12C 2,6.47716 6.47715,2 12,2 Z M 12,4C 7.58172,4 4,7.58173 4,12C 4,16.4183 7.58172,20 12,20C 16.4183,20 20,16.4183 20,12C 20,7.58173 16.4183,4 12,4 Z \"/></svg>";
        } else if (cmd == "stop") {
            return "<svg  viewBox=\"0 0 24.00 24.00\"><path d=\"M 12.0025,2.0025C 6.475,2.0025 2.0025,6.475 2.0025,12.0025C 2.0025,17.525 6.475,22.0025 12.0025,22.0025C 17.525,22.0025 22.0025,17.525 22.0025,12.0025C 22.0025,6.475 17.525,2.0025 12.0025,2.0025 Z M 12.0025,3.99875C 16.4112,3.99875 20,7.5875 20,12.0025C 20,16.4113 16.4112,20 12.0025,20C 7.5875,20 3.99875,16.4113 3.99875,12.0025C 3.99875,7.5875 7.5875,3.99875 12.0025,3.99875 Z M 8.99875,8.99875L 8.99875,15L 15,15L 15,8.99875\"/></svg>";
        }
    }
    else if (theme == 'standard') {
        if (cmd == "prev"){
            return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 6,17.9997L 6,5.99972L 8,5.99972L 8,17.9997L 6,17.9997 Z M 9.5,12L 18,6L 18,18L 9.5,12 Z \"/></svg>";
        } else if (cmd == "next") {
            return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 16,18L 18,18L 18,5.99999L 16,5.99999M 6,18L 14.5,12L 6,5.99999L 6,18 Z \"/></svg>";
        } else if (cmd == "play") {
            return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 7.99939,5.13684L 7.99939,19.1368L 18.9994,12.1368L 7.99939,5.13684 Z \"/></svg>";
        } else if (cmd == "pause") {
            return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 14,19L 18,19L 18,4.99999L 14,4.99999M 6,19L 10,19L 10,4.99999L 6,4.99999L 6,19 Z \"/></svg>";
        } else if (cmd == "stop") {
            return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 18,18L 6,18L 5.99988,6.00011L 18,5.99999L 18,18 Z \"/></svg>";
        }
    }
}
