var dnode = require('../');
var test = require('tap').test;

test('middleware', function (t) {
    t.plan(5);
    
    var port = Math.floor(Math.random() * 40000 + 10000);
    var tf = setTimeout(function () {
        t.fail('never finished');
    }, 1000);
    
    var tr = setTimeout(function () {
        t.fail('never ready');
    }, 1000);
    
    var tc = setTimeout(function () {
        t.fail('connection not ready');
    }, 1000);
    
    var server = dnode(function (client, conn) {
        t.ok(!conn.zing);
        t.ok(!client.moo);
        
        conn.on('remote', (function () {
            clearTimeout(tr);
            t.ok(conn.zing);
            t.ok(this.moo);
        }).bind(this));
        
        this.baz = 42;
    }).listen(port);
    
    server.on('local', function (client, conn) {
        conn.zing = true;
    });
    
    server.on('local', function (client, conn) {
        client.moo = true;
        conn.on('remote', function () {
            clearTimeout(tc);
        });
    });
    
    server.on('listening', function () {
        dnode.connect(port, function (remote, conn) {
            clearTimeout(tf);
            t.ok(remote.baz);
            conn.end();
            server.close();
            t.end();
        });
    });
});
