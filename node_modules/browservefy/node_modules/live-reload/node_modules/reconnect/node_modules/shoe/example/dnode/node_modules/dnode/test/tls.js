var test = require('tap').test;
var dnode = require('../');
var tls = require('tls');
var fs = require('fs');

var keys = {
    A : fs.readFileSync(__dirname + '/keys/agent1-key.pem'),
    B : fs.readFileSync(__dirname+'/keys/agent1-key.pem'),
    C : fs.readFileSync(__dirname+'/keys/agent2-key.pem'),
    D : fs.readFileSync(__dirname+'/keys/agent2-key.pem'),
};

var certs = {
    A : fs.readFileSync(__dirname+'/keys/agent1-cert.pem'),
    B : fs.readFileSync(__dirname+'/keys/agent1-cert.pem'),
    C : fs.readFileSync(__dirname+'/keys/agent2-cert.pem'),
    D : fs.readFileSync(__dirname+'/keys/agent2-cert.pem'),
};

var options = {
    A : {
        key : keys.A,
        cert : certs.A,
        ca : [ certs.C, certs.D ],
        requestCert : true,
        //rejectUnauthorized : true,
    },
    B : {
        key : keys.B,
        cert : certs.B,
        ca : [ certs.C, certs.D ],
        requestCert : true,
        rejectUnauthorized : true,
    },
    C : { key : keys.C, cert : certs.C },
};

test('tls A', function (t) {
    t.plan(4);
    
    var names = [ 'B', 'C' ];
    
    var port = Math.floor(Math.random() * 40000 + 10000);
    
    var server = tls.createServer(options.A, function (stream) {
        var A = dnode({ name : function (cb) { cb('A') } });
        A.on('remote', function (remote) {
            remote.name(function (name) {
                var ix = names.indexOf(name);
                t.ok(ix >= 0);
                names.splice(ix, 1);
                A.end();
            });
        });
        A.pipe(stream).pipe(A);
    });
    server.listen(port);
    
    server.on('listening', function () {
        var bs = tls.connect(port, options.B);
        var B = dnode({ name : function (cb) { cb('B') } });
        B.on('remote', function (remote) {
            remote.name(function (name) {
                t.equal(name, 'A');
            });
        });
        B.pipe(bs).pipe(B);
        
        var C = dnode({ name : function (cb) { cb('C') } });
        var cs = tls.connect(port, options.C);
        C.on('remote', function (remote) {
            remote.name(function (name) {
                t.equal(name, 'A');
            });
        });
        C.pipe(cs).pipe(C);
    });
    
    t.on('end', function () {
        server.close();
    });
});
