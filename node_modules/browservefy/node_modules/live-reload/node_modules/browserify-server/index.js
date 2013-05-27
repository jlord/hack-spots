var path = require("path")
    , fs = require("fs")
    , browserify = require("browserify")

module.exports = bundle

function bundle(input, options) {
    var bundle = createBundle(input, options)

    try {
        return bundle.bundle()
    } catch (err) {
        console.error("[BROWSERIFY-SERVER]", err)
    }
}

function createBundle(input, options) {
    var bundle = browserify({
        debug: true
    })

    bundle.register(".html", handleHtml)
    bundle.register(".svg", handleHtml)

    bundle.addEntry(path.join(__dirname, "other.js"), {
        body: "process.env.NODE_ENV = '" +
            process.env.NODE_ENV + "'\n"
    })
    bundle.addEntry(input, options)

    return bundle
}

function handleHtml(file, fileName) {
    return "module.exports = '" + file.replace(/\n/g, "\\n") + "'"
}
