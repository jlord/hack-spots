# reconnect

reconnect to a network stream, (currently supports [tcp](http://nodejs.org/api/net.html), 
and [shoe](https://github.com/substack/shoe) on the client-side.

## Example

pass function will be called every time the stream connects.
if the connection is broken, reconnect will make a new connection
and call this function again.
``` js
var reconnect = require('reconnect')

reconnect(function (stream) {
  //called every time the connection is remade.
  //only one connection will ever be live at one time.
}).connect(port)
```

## API

### reconnect (opts, onConnect)

if `opts` is an object it will be passed to [backoff](https://github.com/MathieuTurcotte/node-backoff)
which handles throtteling the reconnection attempts. it also accepts a `type` parameter, which may 
be either `'fibonacci'` or `'exponential'`.

``` js
//example opts
var opts = {
  randomisationFactor: 0,
  initialDelay: 10,
  maxDelay: 300
}
```

`opts` is optional.

passing `onConnect` to reconnect is short hand for `reconnect(opts).on('connect', onConnect)`

### reconnect.connect (...)

attempt to connect. the arguments will be passed onto the underlying stream type.
(either you are calling `shoe(uri)` or `net.connect(port)`)
these arguments will be used for every subsequent connection attempt.

### emit('connect', stream)

emitted when a new connection is made (that includes after a disconnection!)

### emit('disconnect', stream)

emitted when the stream has disconnected.

### emit ('backoff', attempts, delay)

reemitted from [backoff](https://github.com/MathieuTurcotte/node-backoff) 
when reconnect is waiting for the next time to connect.

### emit ('reconnect', attempts, delay)

emitted when attempting a new connection.

### reconnector.reconnect

set to `false` and `reconnect` will not automatically reconnect.
starts out true.

## Extending

Inject a handler for a custom stream type, example http would look like this

``` js
var inject  = require('reconnect/inject')
var request = require('request')

module.exports = inject(function () {
  var req = request.apply(null, [].slice.call(arguments))
  //you might need to add some event stuff here
  return req
})

```

you must return a stream, and it must emit a 'connect' event when it has
actually connected to the server like in [net](http://nodejs.org/api/net.html)

## Widget

Also, there is a small widget to show current connection status.

``` js
var reconnect = require('reconnect')

var r = reconnect(function (stream) {
  ...
})
//add the widget to the page.

document.body.appendChild(r.widget())

```

## License

MIT
