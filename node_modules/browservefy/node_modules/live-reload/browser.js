var reconnect = require("reconnect/shoe")

module.exports = LiveReloadClient

function LiveReloadClient(uri) {
    if (typeof uri === "number") {
        uri = "http://localhost:" + uri
    }

    reconnect(function (stream) {
        stream.on("data", ondata)
    }).connect(uri + "/shoe")
}

function ondata(data) {
    if (data === "reload") {
        document.location.reload()
    }
}
