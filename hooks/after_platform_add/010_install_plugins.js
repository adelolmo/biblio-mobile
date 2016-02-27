#!/usr/bin/env node

//this hook installs all your plugins

// add your plugins to this list--either the identifier, the filesystem location or the URL
var pluginlist = [
    "cordova-plugin-whitelist@1.2.1",
    "phonegap-plugin-barcodescanner@4.1.0",
    "cordova-plugin-screen-orientation@1.4.0",
    "cordova-plugin-dialogs@1.2.0",
    "cordova-plugin-splashscreen@3.2.0"
];

// no need to configure below

var fs = require('fs');
var path = require('path');
var sys = require('sys');
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
    sys.puts(stdout);
}

pluginlist.forEach(function(plug) {
    exec("cordova plugin add " + plug, puts);
});