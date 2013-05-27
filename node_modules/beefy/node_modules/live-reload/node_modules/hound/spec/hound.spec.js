var hound = require('../hound')
  , fs = require('fs')
  , path = require('path')
  , util = require('util')

var testSource = path.normalize(__dirname + '/data')
  , testDir = path.normalize(__dirname + '/../tmp')
  , testFileCount = 8

/**
 * Deletes a source recursively, used for set up.
 * @param {string} src
 */
function deleteFile(src) {
  if (!fs.existsSync(src)) return
  var stat = fs.statSync(src)
  // if (stat === undefined) return
  if (stat.isDirectory()) {
    var files = fs.readdirSync(src)
    for (var i = 0, len = files.length; i < len; i++) {
      deleteFile(src + '/' + files[i])
    }
    fs.rmdirSync(src)
  } else {
    fs.unlinkSync(src)
  }
}
/**
 * Copies a source recursively, used for set up.
 * @param {string} src
 * @param {string} src
 */
function copyFile(src, dest) {
  stat = fs.statSync(src)
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest)
    var files = fs.readdirSync(src)
    for (var i = 0, len = files.length; i < len; i++) {
      copyFile(src + '/' + files[i], dest + '/' + files[i])
    }    
  } else {
    if (!fs.existsSync(dest)) {
      util.pump(fs.createReadStream(src), fs.createWriteStream(dest))
    }
  }
}

describe('Hound', function() {
  /**
   * Initialise test area with files.
   */
  beforeEach(function() {
    deleteFile(testDir)
    copyFile(testSource, testDir)
  })

  /**
   * Remove any watchers.
   */
  afterEach(function() {
    if (watcher !== undefined) {
      watcher.clear()
      delete watcher
    }
  })

  it('can watch a file', function() {
    var file = testDir + '/file 1.js'
    watcher = hound.watch(file)
    expect(watcher.watchers[file]).toBeDefined()
  })

  it('can watch a directory', function() {
    watcher = hound.watch(testDir, {recurse: false})
    expect(watcher.watchers[testDir]).toBeDefined()
  })

  it('can watch a directory tree', function() {
    watcher = hound.watch(testDir)
    var watcherCount = 0
    for (var i in watcher.watchers) {
      watcherCount++
    }
    expect(watcherCount).toBe(testFileCount)
  })

  it('can unwatch a file', function(done) {
    var file = testDir + '/file 1.js'
    watcher = hound.watch(file)
    watcher.on('unwatch', function(src) {
      expect(src).toBe(file)
      expect(watcher.watchers.length).toBe(0)
      done()
    })
    watcher.unwatch(file)
  })

  it('can detect a change in a file when watching directly', function(done) {
    var file = testDir + '/subdir 1/subdir file 1.js'  
    watcher = hound.watch(file)
    watcher.on('change', function(src) {
      expect(src).toBe(file)
      done()
    })
    fs.writeFile(file, 'blah blah new data blah')      
  })

  it('can detect deletion of a file when watching directly', function(done) {
    var file = testDir + '/subdir 1/subdir file 1.js'    
    watcher = hound.watch(file)
    watcher.on('delete', function(src) {
      expect(src).toBe(file)
      expect(watcher.watchers[src]).toBeUndefined()
      done()
    })
    fs.unlink(file)
  })

  it('can detect a new file in a dir', function(done) {
    var newFile = testDir + '/new file.js'
    watcher = hound.watch(testDir)
    watcher.on('create', function(src) {
      expect(src).toBe(newFile)
      done()
    })
    fs.writeFile(newFile, 'blah blah blah')
  })

  it('can detect a deleted file in a dir', function(done) {
    var file = testDir + '/subdir 1/subdir file 1.js'
    watcher = hound.watch(testDir)
    watcher.on('delete', function(src) {
      expect(src).toBe(file)
      expect(watcher.watchers[src]).toBeUndefined()
      done()
    })
    fs.unlink(file)
  })

  it('can detect a new file in a new dir', function(done) {
    var dir = testDir + '/new dir'
      , file = dir + '/new dir file.js'
    watcher = hound.watch(testDir)
    watcher.once('create', function(src) {
      expect(src).toBe(dir)
      watcher.once('create', function(src) {
        expect(src).toBe(file)
        done()
      })
      fs.writeFile(file, 'bofbajojsa')
    })
    fs.mkdirSync(dir)
  })

  it('shouldn\'t raise two events for one create', function(done) {
    var file = testDir + '/subdir 1/subdir file 5.js'  
    var createCount = 0
    watcher = hound.watch(testDir)
    watcher.on('create', function(src) {
      expect(++createCount).toBeLessThan(2)
      setTimeout(done, 500)
    })
    fs.writeFile(file, 'blah blah new data blah')
  })

  it('shouldn\'t raise two events for one change', function(done) {
    var file = testDir + '/subdir 1/subdir file 1.js'  
    var changeCount = 0
    watcher = hound.watch(testDir)
    watcher.on('change', function(src) {
      expect(++changeCount).toBeLessThan(2)
      setTimeout(done, 500)
    })
    fs.writeFile(file, 'blah blah new data blah')
  })

  it('shouldn\'t raise two events for one delete', function(done) {
    var file = testDir + '/subdir 1/subdir file 1.js'  
    var deleteCount = 0
    watcher = hound.watch(testDir)
    watcher.on('delete', function(src) {
      expect(++deleteCount).toBeLessThan(2)
      setTimeout(done, 500)
    })
    fs.unlink(file)
  })
})
