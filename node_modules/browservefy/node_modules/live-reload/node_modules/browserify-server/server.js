var http = require("http")
    , ecstatic = require("ecstatic")

module.exports = server

function server(folder, port) {
    port = port || 8080

    http.createServer(ecstatic(folder)).listen(port)

    console.log("Server listening on port", port
        , "serving from folder", folder)
}
