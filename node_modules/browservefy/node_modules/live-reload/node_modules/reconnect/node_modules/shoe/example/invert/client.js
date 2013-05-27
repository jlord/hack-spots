var shoe = require('../../');
var es = require('event-stream');

var result = document.getElementById('result');

var stream = shoe('/invert');
var s = es.mapSync(function (msg) {
    result.appendChild(document.createTextNode(msg));
    return String(Number(msg)^1);
});
s.pipe(stream).pipe(s);
