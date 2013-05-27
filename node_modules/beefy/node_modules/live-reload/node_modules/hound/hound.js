var fs = require('fs')
  , util = require('util')
  , events = require('events')
  , path = require('path')

/**
 * Watch one or more files or directories for changes.
 * @param {string|array} src The file or directory to watch.
 * @return {Hound}
 */
exports.watch = function(src) {
  var watcher = new Hound()
  watcher.watch(src)
  return watcher
}

/**
 * The Hound class tracks watchers and changes and emits events.
 */
function Hound() {
  events.EventEmitter.call(this)
}
util.inherits(Hound, events.EventEmitter)
Hound.prototype.watchers = []

/**
 * Watch a file or directory tree for changes, and fire events when they happen.
 * Fires the following events:
 * 'create' (file, stats)
 * 'change' (file, stats)
 * 'delete' (file)
 * @param {string} src
 * @return {Hound}
 */
Hound.prototype.watch = function(src) {
  var self = this
  var stats = fs.statSync(src)
  var lastChange = null
  if (stats.isDirectory()) {
    var files = fs.readdirSync(src)
    for (var i = 0, len = files.length; i < len; i++) {
      self.watch(src + '/' + files[i])
    }
  }
  self.watchers[src] = fs.watch(src, function(event, filename) {
    if (fs.existsSync(src)) {
      stats = fs.statSync(src)
      if (stats.isFile()) {
        if (lastChange === null || stats.mtime.getTime() > lastChange)
          self.emit('change', src, stats)
        lastChange = stats.mtime.getTime()
      } else if (stats.isDirectory()) {
        // Check if the dir is new
        if (self.watchers[src] === undefined) {
          self.emit('create', src, stats)
        }
        // Check files to see if there are any new files
        var dirFiles = fs.readdirSync(src)
        for (var i = 0, len = dirFiles.length; i < len; i++) {
          var file = src + '/' + dirFiles[i]
          if (self.watchers[file] === undefined) {
            self.watch(file)
            self.emit('create', file, fs.statSync(file))
          }
        }
      }
    } else {
      self.unwatch(src)
      self.emit('delete', src)
    }
  })
  self.emit('watch', src)    
}

/**
 * Unwatch a file or directory tree.
 * @param {string} src
 */
Hound.prototype.unwatch = function(src) {
  var self = this
  if (self.watchers[src] !== undefined) {
    self.watchers[src].close()
    delete self.watchers[src]
  }
  self.emit('unwatch', src)
}

/**
 * Unwatch all currently watched files and directories in this watcher.
 */
Hound.prototype.clear = function() {
  var self = this
  for (var file in this.watchers) {
    self.unwatch(file)
  }
}
