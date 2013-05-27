hound - directory tree watcher for node.js
=============================================

Cross platform directory tree watcher that works, even on Windows
-----------------------------------------------------------------

The philosophy of hound is:

* **Be reliable, work on every platform**
* **Be fast**
* **Be simple**

hound is designed to be very reliable, fast, and simple.  There are no runtime
dependencies outside of the standard node.js libraries.  There is a development
dependency on [Jasmine](http://pivotal.github.com/jasmine/), which is required
to run the tests.

Installation
------------

Install using npm:

```
npm install hound
```

Because hound has no runtime dependencies, it is also possible to download the
library manually and require it directly.

Usage
-----

```javascript
hound = require('hound')

// Create a directory tree watcher.
watcher = hound.watch('/tmp')

// Create a file watcher.
watcher = hound.watch('/tmp/file.txt')

// Add callbacks for file and directory events.  The change event only applies
// to files.
watcher.on('create', function(file, stats) {
  console.log(file + ' was created')
})
watcher.on('change', function(file, stats) {
  console.log(file + ' was changed')
})
watcher.on('delete', function(file) {
  console.log(file + ' was deleted')
})

// Unwatch specific files or directories.
watcher.unwatch('/tmp/another_file')

// Unwatch all watched files and directories.
watcher.clear()
```

Testing
-------

To run the tests using your global Jasmine binary:

```
jasmine-node spec
```

To run the tests using your local Jasmine binary in node_modules:

```
node_modules/.bin/jasmine-node spec
```

The tests work on actual directory trees that are generated in the tmp
directory.
