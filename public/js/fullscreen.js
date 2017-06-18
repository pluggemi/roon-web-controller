var socket = io();

$(document).ready(function() {
    $("#buttonMenu").html(getSVG('menu'));

    socket.on("pairStatus", function(payload) {
        pairEnabled=payload.pairEnabled;

        if (pairEnabled === true ) {
            showSection('nowPlaying');
        } else {
            showSection('pairDisabled');
        }
    });

});

function getSVG(cmd) {
    if (cmd == "menu") {
        return "<svg viewBox=\"0 0 512 512\"><path d=\"M64 128h384v42.667H64V128m0 106.667h384v42.666H64v-42.666m0 106.666h384V384H64v-42.667z\"/></svg>";
    }
}

function showSection(sectionName) {
    if (sectionName == "nowPlaying") {
        $("#buttonMenu").show();
        // Show Now Playing screen
        $("#nowPlaying").show();
        // Hide inactive sections
        $("#pairDisabled").hide();
        $("#libraryBrowser").hide();
        $('#overlayMainMenu').hide();
    } else if (sectionName == "libraryBrowser") {
        $("#buttonMenu").show();
        // Show libraryBrowser
        $("#libraryBrowser").show();
        // Hide inactive sections
        $("#pairDisabled").hide();
        $("#nowPlaying").hide();
        $('#overlayMainMenu').hide();
    } else if (sectionName == "pairDisabled") {
        // Show pairDisabled section
        $("#pairDisabled").show();
        // Hide everthing else
        $("#buttonMenu").hide();
        $("#libraryBrowser").hide();
        $("#nowPlaying").hide();
        $("#pageLoading").hide();
    }
    t = setTimeout(function (){ $("#pageLoading").hide()}, 250);
}
