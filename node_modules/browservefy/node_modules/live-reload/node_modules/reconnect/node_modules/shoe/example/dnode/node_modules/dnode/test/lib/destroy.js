module.exports = function (server) {
    server.close();
    Object.keys(server.sessions).forEach(function (id) {
        server.sessions[id].end();
    });
};
