var reconnect = require('../../');
var domready = require('domready');
var es = require('event-stream');

//****************************************
//* copy pasted from shoe/example/invert *
//* but with automatic reconnection!     *
//****************************************

domready(function () {
    var result = document.getElementById('result');
    
    reconnect(function (stream) {
      var s = es.mapSync(function (msg) {
          result.appendChild(document.createTextNode(msg));
          return String(Number(msg)^1);
      });
      s.pipe(stream).pipe(s);

    }).connect('/invert')
});
