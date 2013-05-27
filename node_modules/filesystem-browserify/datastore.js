const util = require('util');
const IDBStore = require('idb-wrapper');
const EventEmitter = require('events').EventEmitter;

function nothing() {}

function DataStore(name) {
  this.ready = false;
  this.store = new IDBStore({
    storeName: 'PseudoFS',
    onStoreReady: function () {
      this.ready = true;
      this.emit('ready')
      this._flush();
    }.bind(this)
  });
  this.queue = [];
};
util.inherits(DataStore, EventEmitter);

DataStore.prototype.writeFile = function writeFile(path, data, callback) {
  callback = callback || nothing;
  if (!this.ready)
    return this._enqueue({
      type: 'write',
      args: [path, data, callback],
    });
  return this.__write(path, data, callback);
};

DataStore.prototype.readFile = function readFile(path, callback) {
  callback = callback || nothing;
  if (!this.ready)
    return this._enqueue({
      type: 'read',
      args: [path, callback],
    });
  return this.__read(path, callback);
};

DataStore.prototype.readdir = function readdir(path, callback) {
  if (!this.ready)
    return this._enqueue({
      type: 'readdir',
      args: [path, callback],
    });
  return this.__readdir(path, callback);
};

DataStore.prototype.unlink = function unlink(path, callback) {
  callback = callback || nothing;
  if (!this.ready)
    return this._enqueue({
      type: 'unlink',
      args: [path, callback],
    });
  return this.__unlink(path, callback);
};

DataStore.prototype.rename = function rename(path, newPath, callback) {
  callback = callback || nothing;
  if (!this.ready)
    return this._enqueue({
      type: 'rename',
      args: [path, newPath, callback],
    });
  return this.__rename(path, newPath, callback);
};

DataStore.prototype._enqueue = function enqueue(actionPlan) {
  console.log('queuing', actionPlan.type);
  this.queue.push(actionPlan);
  if (this.ready)
    this._flush();
};

DataStore.prototype._flush = function flush() {
  var action;
  while ((action = this.queue.shift())) {
    var method = this['__' + action.type];
    method.apply(this, action.args);
  }
};

DataStore.prototype.__write = function write(path, data, callback) {
  const dataObj = {
    id: path,
    data: data,
    lastModified: Date.now(),
  };
  this.store.put(dataObj, function success() {
    callback(null);
  }, function error(err) {
    callback(err);
  });
};

DataStore.prototype.__read = function read(path, callback) {
  this.store.get(path, function success(data) {
    callback(null, data);
  }, function error(err) {
    callback(err);
  });
};

DataStore.prototype.__readdir = function read(path, callback) {
  this.store.getAll(function success(data) {
    callback(null, data.map(extract('id')));
  }, function error(err) {
    callback(err);
  });
};

DataStore.prototype.__unlink = function unlink(path, callback) {
  this.store.remove(path, function success() {
    callback();
  }, function error(err) {
    callback(err);
  });
};

DataStore.prototype.__rename = function rename(path, newPath, callback) {
  console.log('renmaing');
  this.readFile(path, function (err, data) {
    if (err) return callback(err);
    this.writeFile(newPath, data, function (err) {
      if (err) return callback(err);
      this.unlink(path, function (err) {
        return callback(err);
      }.bind(this));
    }.bind(this));
  }.bind(this));
};

function extract(field) {
  return function (doc) {
    return doc[field];
  }
}

module.exports = DataStore;
