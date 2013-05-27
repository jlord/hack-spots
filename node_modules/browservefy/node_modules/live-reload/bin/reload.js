#!/usr/bin/env node

var argv = require("optimist").argv
    , path = require("path")
    , filed = require("filed")

    , Reload = require("..")

    , uri = argv.uri = argv._[0]
    , help = argv.help || argv.h

if (help) {
    filed(path.join(__dirname, "usage.txt")).pipe(process.stdout)
} else {
    Reload(argv)
}

