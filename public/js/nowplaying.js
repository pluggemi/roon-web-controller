"use strict";
var socket = io();
var curZone;
var css = [];
var settings = [];
var state = [];
var inVolumeSlider = false;

$(document).ready(function() {
	showPage();
	fixFontSize();
});

function toggleNotifications(elem) {
    if(settings.showNotifications) {
        settings.showNotifications = false;
        elem.value = "Notifiy OFF"
    }
    else {
        settings.showNotifications = true;
        elem.value = "Notifiy ON"
    }
    setCookie('settings[\'showNotifications\']', settings.showNotifications);
}

function notifyMe(three_line) {
	// Let's check if the browser supports notifications
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
	}

	// Let's check whether notification permissions have already been granted
	else if (Notification.permission === "granted") {
	// If it's okay let's create a notification
	var options = {
		body: three_line.line2 + " - " + three_line.line3,
		icon: "/roonapi/getImage?image_key=" + curZone.now_playing.image_key
	}
	var notification = new Notification(three_line.line1, options);
	}

	// Otherwise, we need to ask the user for permission
	else if (Notification.permission !== "denied") {
	Notification.requestPermission(function (permission) {
	// If the user accepts, let's create a notification
		if (permission === "granted") {
		 var options = {
			body: three_line.line3,
			icon: "/roonapi/getImage?image_key=" + curZone.now_playing.image_key
		}
		var notification = new Notification(three_line.line1, options);
		}
	});
	}

	// At last, if the user has denied notifications, and you 
	// want to be respectful there is no need to bother them any more.
}

function fixFontSize() {
	$(".lineMusicInfo").css('font-size', Math.round(parseInt($("#line1").height() * 0.75)));

	var zoneFontSize = Math.round(parseInt($("#containerZoneList").height()/3));
		if (zoneFontSize <= 20) {
			$("#nowplayingZoneList").css("font-size", 20);
		} else {
			$("#nowplayingZoneList").css("font-size", zoneFontSize);
		}
}

function showPage() {
	// Read settings from cookie
	settings.zoneID = readCookie('settings[\'zoneID\']');
	settings.displayName = readCookie('settings[\'displayName\']');
	settings.theme = readCookie('settings[\'theme\']');
    settings.showNotifications = readCookie('settings[\'showNotifications\']');
    
    if(settings.showNotifications == undefined) {
        settings.showNotifications = false;
    }
    else if(settings.showNotifications){
        document.getElementById("notificationsButton").value = "Notify ON";
    }

	// Set page fields to settings
	if (settings.zoneID === undefined) {
		$("#overlayZoneList").show();
	}

	if (settings.displayName !== undefined){
		$(".buttonZoneName").html(settings.displayName);
	}

	if (settings.theme === undefined) {
		settings.theme = "dark";
		setCookie('settings[\'theme\']', settings.theme);
		setTheme(settings.theme);
	} else {
		setTheme(settings.theme);
	}

	// Get Buttons
	$("#buttonVolume").html(getSVG('volume'));
	$("#buttonTheme").html(getSVG('theme'));
	$("#notPlaying").hide();
	$("#isPlaying").hide();

	enableSockets();
}

function enableSockets(){
	socket.on("zoneList", function(payload) {
		$("#zoneList").html("");

		if (payload !== undefined) {
			for (var x in payload){
				$("#zoneList").append("<button type=\"button\" class=\"buttonOverlay\" onclick=\"selectZone(\'" + payload[x].zone_id + "\', \'" + payload[x].display_name + "\')\">" + payload[x].display_name + "</button>");
			}
		}
	});

	socket.on("zoneStatus", function(payload) {
		if (settings.zoneID !== undefined){
			for (var x in payload){
				if (payload[x].zone_id == settings.zoneID) {
					curZone = payload[x];
					updateZone(curZone);
				} else {
					curZone = undefined;
				}
			}
		}
	});
}

function selectZone(zone_id, display_name) {
	settings.zoneID = zone_id;
	setCookie('settings[\'zoneID\']', settings.zoneID);

	settings.displayName = display_name;
	setCookie('settings[\'displayName\']', settings.displayName);
	$(".buttonZoneName").html(settings.displayName);

	// Reset state on zone switch
	state = [];
	socket.emit("getZone", zone_id);

	$("#overlayZoneList").hide();
}

function updateZone(curZone){
	if ( curZone.now_playing ) {
		showIsPlaying(curZone);
	} else {
		showNotPlaying();
	}
}

function showNotPlaying() {
	$("#notPlaying").show();
	$("#isPlaying").hide();

	// Reset icons
	$("#controlPrev").html(getSVG('prev')).removeClass("buttonAvailable").addClass("buttonInactive");
	$("#controlPlayPauseStop").html(getSVG('play')).removeClass("buttonAvailable").addClass("buttonInactive");
	$("#controlNext").html(getSVG('next')).removeClass("buttonAvailable").addClass("buttonInactive");
	$("#buttonLoop").html(getSVG('loop')).removeClass("buttonAvailable buttonActive").addClass("buttonInactive");
	$("#buttonShuffle").html(getSVG('shuffle')).removeClass("buttonAvailable buttonActive").addClass("buttonInactive");
	$("#buttonRadio").html(getSVG('radio')).removeClass("buttonAvailable buttonActive").addClass("buttonInactive");

	// Blank text fields
	$("#line1, #line2, #line3, #seekPosition, #seekLength").html("&nbsp;");
	$("#trackSeekValue").css("width", "0%");

	// Reset pictures
	$("#containerCoverImage").html("<img src=\"/img/transparent.png\" class=\"itemImage\">");
	$("#coverBackground").css("background-image", "url(\'/img/transparent.png\')");

	// Reset state and browser title
	state = [];
	$(document).prop("title", "Roon Web Controller");
}

function showIsPlaying(curZone) {
    $("#notPlaying").hide();
    $("#isPlaying").show();

    if ( state.line1 != curZone.now_playing.three_line.line1) {
        if(settings.showNotifications) {
          notifyMe(curZone.now_playing.three_line);
        }
        state.line1 = curZone.now_playing.three_line.line1;
        fixFontSize();
        $("#line1")
        .html(state.line1)
        .simplemarquee({
            cycles: Infinity,
            delayBetweenCycles: 5000,
            handleHover: false
        });
    }

    if ( state.line2 != curZone.now_playing.three_line.line2) {
        state.line2 = curZone.now_playing.three_line.line2;
        $("#line2")
        .html(curZone.now_playing.three_line.line2)
        .simplemarquee({
            cycles: Infinity,
            delayBetweenCycles: 5000,
            handleHover: false
        });
    }

    if ( state.line3 != curZone.now_playing.three_line.line3) {
        state.line3 = curZone.now_playing.three_line.line3;
        $("#line3")
        .html(curZone.now_playing.three_line.line3)
        .simplemarquee({
            cycles: Infinity,
            delayBetweenCycles: 5000,
            handleHover: false
        });
    }

    if (state.title != curZone.now_playing.one_line.line1) {
        state.title = curZone.now_playing.one_line.line1;
        $(document).prop("title", curZone.now_playing.one_line.line1);
    }

    if ( curZone.is_seek_allowed === true ) {
        $("#seekPosition").html(secondsConvert(curZone.now_playing.seek_position));
        $("#seekLength").html(secondsConvert(curZone.now_playing.length));
        $("#trackSeekValue")
        .css("width", Math.round((curZone.now_playing.seek_position / curZone.now_playing.length) * 100) + "%");
    } else {
        $("#seekPosition, #seekLength").html("&nbsp;");
        $("#trackSeekValue").css("width", "0%");
    }

    if ( state.image_key != curZone.now_playing.image_key || state.image_key === undefined) {
        state.image_key = curZone.now_playing.image_key;

        if ( curZone.now_playing.image_key === undefined ) {
            state.imgUrl = "/img/transparent.png";
        } else {
            state.imgUrl = "/roonapi/getImage?image_key=" + curZone.now_playing.image_key;
        }
        $("#containerCoverImage").html("<img src=\"" + state.imgUrl + "\" class=\"itemImage\">");
        $("#coverBackground").css("background-image", "url(" + state.imgUrl + ")");

        if (settings.theme == "color"){
            var colorThief = new ColorThief();

            colorThief.getColorAsync(state.imgUrl, function(color){
                var r = color[0];
                var g = color[1];
                var b = color[2];
                css.colorBackground = "rgb(" + color +")";

                var yiq = ((r*299)+(g*587)+(b*114))/1000;
                if (yiq >= 128) {
                    css.backgroundColor = "#eff0f1";
                    css.foregroundColor = "#232629";
                    css.trackSeek = "rgba(35, 38, 41, 0.33)";
                } else {
                    css.backgroundColor = "#232629";
                    css.foregroundColor = "#eff0f1";
                    css.trackSeek = "rgba(239, 240, 241, 0.33)";
                }
                $("#colorBackground").show();
                showTheme('color');
            });
        }
    }

    if (state.Prev != curZone.is_previous_allowed || state.Prev === undefined) {
        state.Prev = curZone.is_previous_allowed;
        if ( curZone.is_previous_allowed === true ) {
            $("#controlPrev")
            .attr("onclick", "goCmd(\'prev\', \'" + curZone.zone_id + "\')")
            .html(getSVG('prev'))
            .addClass("buttonAvailable")
            .removeClass("buttonInactive");
        } else {
            $("#controlPrev")
            .attr("onclick", "")
            .html(getSVG('prev'))
            .addClass("buttonInactive")
            .removeClass("buttonAvailable");
        }
    }

    if (state.Next != curZone.is_next_allowed || state.Next === undefined) {
        state.Next = curZone.is_next_allowed;
        if ( curZone.is_next_allowed === true ) {
            $("#controlNext")
            .attr("onclick", "goCmd(\'next\', \'" + curZone.zone_id + "\')")
            .html(getSVG('next'))
            .addClass("buttonAvailable")
            .removeClass("buttonInactive");
        } else {
            $("#controlNext")
            .attr("onclick", "")
            .html(getSVG('next'))
            .addClass("buttonInactive")
            .removeClass("buttonAvailable");
        }
    }

    if ( curZone.is_play_allowed === true ) {
        state.PlayPauseStop = "showPlay";
    } else if ( curZone.state == "playing" && curZone.is_play_allowed === false ) {
        if ( curZone.is_pause_allowed === true ) { state.PlayPauseStop = "showPause"; }
        else { state.PlayPauseStop = "showStop"; }
    } else {
        state.PlayPauseStop = "showPlayDisabled";
    }

    if (state.PlayPauseStopLast != state.PlayPauseStop || state.PlayPauseStop === undefined) {
        state.PlayPauseStopLast = state.PlayPauseStop;
        if ( state.PlayPauseStop == "showPlay") {
            $("#controlPlayPauseStop")
            .attr("onclick", "goCmd(\'play\', \'" + curZone.zone_id + "\')")
            .html(getSVG('play'))
            .addClass("buttonAvailable")
            .removeClass("buttonInactive");
        } else if (state.PlayPauseStop == "showPause") {
            $("#controlPlayPauseStop")
            .attr("onclick", "goCmd(\'pause\', \'" + curZone.zone_id + "\')")
            .html(getSVG('pause'))
            .addClass("buttonAvailable")
            .removeClass("buttonInactive");
        } else if (state.PlayPauseStop == "showStop") {
            $("#controlPlayPauseStop")
            .attr("onclick", "goCmd(\'stop\', \'" + curZone.zone_id + "\')")
            .html(getSVG('stop'))
            .addClass("buttonAvailable")
            .removeClass("buttonInactive");
        } else if (state.PlayPauseStop == "showPlayDisabled") {
            $("#controlPlayPauseStop")
            .html(getSVG('play'))
            .attr("onclick", "")
            .addClass("buttonInactive")
            .removeClass("buttonAvailable");
        }
    }

    if (state.Loop != curZone.settings.loop || state.Loop === undefined) {
        state.Loop = curZone.settings.loop;
        if (state.Loop == "disabled"){
            $("#buttonLoop")
            .html(getSVG('loop'))
            .attr("onclick", "changeZoneSetting(\'loop\', \'loop\', \'" + curZone.zone_id + "\')")
            .removeClass("buttonActive buttonInactive")
            .addClass("buttonAvailable")
            .css("color", css.foregroundColor);
        } else if (state.Loop == "loop_one"){
            $("#buttonLoop")
            .html(getSVG('loopOne'))
            .attr("onclick", "changeZoneSetting(\'loop\', \'disabled\', \'" + curZone.zone_id + "\')")
            .removeClass("buttonAvailable buttonInactive")
            .addClass("buttonActive")
            .css("color", "#3daee9");
        } else if (state.Loop == "loop"){
            $("#buttonLoop")
            .html(getSVG('loop'))
            .attr("onclick", "changeZoneSetting(\'loop\', \'loop_one\', \'" + curZone.zone_id + "\')")
            .removeClass("buttonAvailable buttonInactive")
            .addClass("buttonActive")
            .css("color", "#3daee9");
        } else {
            $("#buttonLoop")
            .html(getSVG('loop'))
            .attr("onclick", "")
            .removeClass("buttonAvailable buttonActive")
            .addClass("buttonInactive")
            .css("color", css.foregroundColor);
        }
    }

    if (state.Shuffle != curZone.settings.shuffle || state.Shuffle === undefined) {
        state.Shuffle = curZone.settings.shuffle;
        if (state.Shuffle === false) {
            $("#buttonShuffle")
            .html(getSVG('shuffle'))
            .attr("onclick", "changeZoneSetting(\'shuffle\', \'true\', \'" + curZone.zone_id + "\')")
            .removeClass("buttonActive buttonInactive")
            .addClass("buttonAvailable")
            .css("color", css.foregroundColor);
        } else if (state.Shuffle === true) {
            $("#buttonShuffle")
            .html(getSVG('shuffle'))
            .attr("onclick", "changeZoneSetting(\'shuffle\', \'false\', \'" + curZone.zone_id + "\')")
            .removeClass("buttonAvailable buttonInactive")
            .addClass("buttonActive")
            .css("color", "#3daee9");
        } else {
            $("#buttonShuffle")
            .html(getSVG('shuffle'))
            .attr("onclick", "")
            .removeClass("buttonAvailable buttonActive")
            .addClass("buttonInactive")
            .css("color", css.foregroundColor);
        }
    }

    if (state.Radio != curZone.settings.auto_radio || state.Radio === undefined) {
        state.Radio = curZone.settings.auto_radio;
        if (state.Radio === false) {
            $("#buttonRadio")
            .html(getSVG('radio'))
            .attr("onclick", "changeZoneSetting(\'auto_radio\', \'true\', \'" + curZone.zone_id + "\')")
            .removeClass("buttonActive buttonInactive")
            .addClass("buttonAvailable")
            .css("color", css.foregroundColor);
        } else if (state.Radio === true) {
            $("#buttonRadio")
            .html(getSVG('radio'))
            .attr("onclick", "changeZoneSetting(\'auto_radio\', \'false\', \'" + curZone.zone_id + "\')")
            .removeClass("buttonAvailable buttonInactive")
            .addClass("buttonActive")
            .css("color", "#3daee9");
        } else {
            $("#buttonRadio")
            .html(getSVG('radio'))
            .attr("onclick", "")
            .removeClass("buttonAvailable buttonActive")
            .addClass("buttonInactive")
            .css("color", css.foregroundColor);
        }
    }

    if (inVolumeSlider === false ) {
        $("#volumeList").html("");
        for (var x in curZone.outputs) {
            if (x >= 1) { $("#volumeList").append("<hr>"); }
            if (curZone.outputs[x].volume) {
                var html = "<div class=\"textBold\">" + curZone.outputs[x].display_name + "</div>";
                html += "<div>" + curZone.outputs[x].volume.value + "</div>";

                html += "<div class=\"volumeGroup\">";
                html += "<button type=\"button\" class=\"buttonFillHeight volumeButton\"";
                html += "onclick=\"volumeButton(\'volumeValue" + x + "\', " + (curZone.outputs[x].volume.value - curZone.outputs[x].volume.step) + ", \'" + curZone.outputs[x].output_id + "\')\"";
                html += ">"+ getSVG('volume-minus') + "</button>";
                html += "<div class=\"volumeSlider\">";
                html += "<input type=\"range\" min=\"" + curZone.outputs[x].volume.min + "\"  max=\"" + curZone.outputs[x].volume.max +  "\" step=\"" + curZone.outputs[x].volume.step + "\" value=\"" + curZone.outputs[x].volume.value + "\" oninput=\"volumeInput(\'volumeValue" + x + "\', this.value, \'" + curZone.outputs[x].output_id + "\')\" onchange=\"volumeChange(\'volumeValue" + x + "\', this.value, \'" + curZone.outputs[x].output_id + "\')\"/>"
                html += "</div>";
                html += "<button type=\"button\" class=\"buttonFillHeight volumeButton\"";
                html += "onclick=\"volumeButton(\'volumeValue" + x + "\', " + (curZone.outputs[x].volume.value + curZone.outputs[x].volume.step) + ", \'" + curZone.outputs[x].output_id + "\')\"";
                html += ">"+ getSVG('volume-plus') + "</button>";
                html += "</div>";

                $("#volumeList").append(html);
            } else {
                $("#volumeList")
                .append("<div class=\"textBold\">" + curZone.outputs[x].display_name + "</div>")
                .append("<div>Fixed Volume</div>");
            }
        }
    }

    if (state.themeShowing === undefined) {
        state.themeShowing = true;
        showTheme(settings.theme);
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

function changeZoneSetting(zoneSetting, zoneSettingValue, zone_id) {
//		 for (x in curZone.outputs){
		var msg = JSON.parse('{"zone_id": "' + zone_id + '", "setting": "' + zoneSetting + '", "value": "' + zoneSettingValue + '" }');
		socket.emit("changeSetting", msg);
//		 }
}

function volumeButton(spanId, value, output_id) {
    $("#" + spanId + "").html(value);

    var msg = JSON.parse('{"output_id": "' + output_id + '", "volume": "' + value + '" }');
    socket.emit("changeVolume", msg);
}

function volumeInput(spanId, value, output_id) {
	inVolumeSlider = true;
	$("#" + spanId + "").html(value);

   var msg = JSON.parse('{"output_id": "' + output_id + '", "volume": "' + value + '" }');
    socket.emit("changeVolume", msg);
}

function volumeChange(id, value, output_id) {
	inVolumeSlider = false;
}

function setTheme(theme) {
	settings.theme = theme;
	state.themeShowing = undefined;
	setCookie('settings[\'theme\']', theme);

	if (theme == "dark" || theme === undefined) {
		css.backgroundColor = "#232629";
		css.foregroundColor = "#eff0f1";
		css.trackSeek = "rgba(239, 240, 241, 0.33)";

		$("#coverBackground").hide();
		$("#colorBackground").hide();
	}
	else if (theme == "cover") {
		css.backgroundColor = "#232629";
		css.foregroundColor = "#eff0f1";
		css.trackSeek = "rgba(239, 240, 241, 0.33)";

		$("#coverBackground").show();
		$("#colorBackground").hide();
	}
	else if (theme == "color") {
		state.image_key = undefined;
		$("#coverBackground").hide();
		$("#colorBackground").show();
	}
	else {
		settings.theme = undefined;
		setTheme(settings.theme);
	}

	socket.emit("getZone", true);
}

function showTheme(theme) {
	$("body").css("background-color", css.backgroundColor).css("color", css.foregroundColor);
	$(".colorChange").css("color", css.foregroundColor);
	$("#colorBackground").css("background-color", css.colorBackground);
	$(".buttonAvailable").css("color", css.foregroundColor);
	$(".buttonInactive").css("color", css.foregroundColor);
	$("#trackSeek").css("background-color", css.trackSeek);
	socket.emit("getZone", true);
}

function readCookie(name){
	return Cookies.get(name);
}

function setCookie(name, value){
    Cookies.set(name, value, { expires: 365 });
}

function secondsConvert(seconds) {
	seconds = Number(seconds);
	var hour = Math.floor(seconds / 3600);
	var minute = Math.floor(seconds % 3600 / 60);
	var second = Math.floor(seconds % 3600 % 60);
	return ((hour > 0 ? hour + ":" + (minute < 10 ? "0" : "") : "") + minute + ":" + (second < 10 ? "0" : "") + second);
}

function getSVG(cmd) {
	switch (cmd) {
		case "loop":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 17,17L 7,17L 7,14L 3,18L 7,22L 7,19L 19,19L 19,13L 17,13M 7,7L 17,7L 17,10L 21,6L 17,2L 17,5L 5,5L 5,11L 7,11L 7,7 Z \"/></svg>";
		case "loopOne":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 13,15L 13,9L 12,9L 10,10L 10,11L 11.5,11L 11.5,15M 17,17L 7,17L 7,14L 3,18L 7,22L 7,19L 19,19L 19,13L 17,13M 7,7L 17,7L 17,10L 21,6L 17,2L 17,5L 5,5L 5,11L 7,11L 7,7 Z \"/></svg>";
		case "shuffle":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 17,3L 22.25,7.50002L 17,12L 22.25,16.5L 17,21L 17,18L 14.2574,18L 11.4393,15.182L 13.5607,13.0607L 15.5,15L 17,15L 17,12L 17,9L 15.5,9L 6.49999,18L 2,18L 2,15L 5.25736,15L 14.2574,6L 17,6L 17,3 Z M 2,6.00001L 6.5,6.00001L 9.31802,8.81803L 7.1967,10.9393L 5.25737,9.00001L 2,9.00001L 2,6.00001 Z \"/></svg>";
		case "radio":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 20,6C 21.1046,6 22,6.89543 22,8L 22,20C 22,21.1046 21.1046,22 20,22L 4,22C 2.89543,22 2,21.1046 2,20L 2,8C 2,7.15034 2.52983,6.42443 3.27712,6.13463L 15.707,0.986006L 16.4724,2.83377L 8.82842,6L 20,6 Z M 20,8.00001L 4,8.00001L 4,12L 16,12L 16,10L 18,10L 18,12L 20,12L 20,8.00001 Z M 7,14C 5.34314,14 4,15.3431 4,17C 4,18.6569 5.34314,20 7,20C 8.65685,20 10,18.6569 10,17C 10,15.3431 8.65685,14 7,14 Z \"/></svg>";
		case "prev":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 6,17.9997L 6,5.99972L 8,5.99972L 8,17.9997L 6,17.9997 Z M 9.5,12L 18,6L 18,18L 9.5,12 Z \"/></svg>";
		case "next":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 16,18L 18,18L 18,5.99999L 16,5.99999M 6,18L 14.5,12L 6,5.99999L 6,18 Z \"/></svg>";
		case "play":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 7.99939,5.13684L 7.99939,19.1368L 18.9994,12.1368L 7.99939,5.13684 Z \"/></svg>";
		case "pause":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 14,19L 18,19L 18,4.99999L 14,4.99999M 6,19L 10,19L 10,4.99999L 6,4.99999L 6,19 Z \"/></svg>";
		case "stop":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 18,18L 6,18L 5.99988,6.00011L 18,5.99999L 18,18 Z \"/></svg>";
		case "volume":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 3,9.00002L 6.99998,9.00004L 12,4.00002L 12,20L 6.99998,15L 2.99998,15L 3,9.00002 Z M 20.9999,12.0001C 20.9999,16.2832 18.008,19.8676 14,20.777L 14,18.7102C 16.8914,17.8496 18.9999,15.1711 18.9999,12.0001C 18.9999,8.8291 16.8914,6.15058 14,5.29L 14,3.22307C 18.008,4.13255 20.9999,7.71688 20.9999,12.0001 Z M 17,12C 17,14.0503 15.7659,15.8124 14,16.584L 14,7.41605C 15.7659,8.1876 17,9.94968 17,12 Z \"/></svg>";
		case "volume-mute":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 3,9.00002L 6.99998,9.00004L 12,4.00002L 12,20L 6.99998,15L 2.99998,15L 3,9.00002 Z M 16.5858,12L 14,9.41422L 15.4142,8L 18,10.5858L 20.5858,8L 22,9.41421L 19.4142,12L 22,14.5858L 20.5858,16L 18,13.4142L 15.4142,16L 14,14.5858L 16.5858,12 Z \"/></svg>";
		case "volume-minus":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 3,9.00002L 6.99998,9.00004L 12,4.00002L 12,20L 6.99998,15L 2.99998,15L 3,9.00002 Z M 14,11L 22,11L 22,13L 14,13L 14,11 Z \"/></svg>";
		case "volume-plus":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 3,9.00002L 6.99998,9.00004L 12,4.00002L 12,20L 6.99998,15L 2.99998,15L 3,9.00002 Z M 14,11L 17,11L 17,8L 19,8L 19,11L 22,11L 22,13L 19,13L 19,16L 17,16L 17,13L 14,13L 14,11 Z \"/></svg>";
		case "theme":
			return "<svg viewBox=\"0 0 24.00 24.00\"><path d=\"M 7.5,2.00001C 5.71094,3.15144 4.5,5.18431 4.5,7.5C 4.5,9.8157 5.71095,11.8486 7.53415,12.9999C 4.46243,13 2,10.5376 2,7.5C 2,4.46243 4.46243,2.00001 7.5,2.00001 Z M 19.0711,3.51472L 20.4853,4.92893L 4.92893,20.4853L 3.51471,19.0711L 19.0711,3.51472 Z M 12.8894,5.9344L 11.4059,5.00146L 9.96582,6.00001L 10.3947,4.30087L 9,3.23983L 10.7485,3.12264L 11.3266,1.46834L 11.9784,3.09504L 13.7304,3.13367L 12.3847,4.25622L 12.8894,5.9344 Z M 9.58647,9.53659L 8.43268,8.81097L 7.3126,9.58762L 7.64616,8.26607L 6.56141,7.44081L 7.92135,7.34966L 8.37101,6.06298L 8.87794,7.3282L 10.2406,7.35825L 9.19396,8.23134L 9.58647,9.53659 Z M 19,13.5C 19,16.5376 16.5376,19 13.5,19C 12.2782,19 11.1494,18.6016 10.2366,17.9276L 17.9276,10.2366C 18.6016,11.1495 19,12.2782 19,13.5 Z M 14.6009,20.0824L 17.3726,18.9343L 17.1348,22.28L 14.6009,20.0824 Z M 18.9305,17.3849L 20.0786,14.6132L 22.2762,17.1471L 18.9305,17.3849 Z M 20.0845,12.416L 18.9365,9.64433L 22.2822,9.8821L 20.0845,12.416 Z M 9.62856,18.9285L 12.4002,20.0766L 9.86632,22.2742L 9.62856,18.9285 Z \"/></svg>";
		default:
			break;
	}
}
