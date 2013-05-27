const util = require('util');
const Stream = require('stream');
const DataStore = require('./datastore');
const fs = {};
const FILESYSTEM = new DataStore();

fs.createWriteStream = function createWriteStream(path) {
  return new WriteStream(path);
};

fs.createReadStream = function createReadStream(path) {
  return new ReadStream(path);
};

fs.rename = FILESYSTEM.rename.bind(FILESYSTEM);
fs.writeFile = FILESYSTEM.writeFile.bind(FILESYSTEM);
fs.readFile = FILESYSTEM.writeFile.bind(FILESYSTEM);
fs.readdir = FILESYSTEM.readdir.bind(FILESYSTEM);
fs.unlink = FILESYSTEM.unlink.bind(FILESYSTEM);

function WriteStream(path) {
  this._buffer = '';
  this.path = path;
  this.writable = true;
  this.bytesWritten = 0;
};
util.inherits(WriteStream, Stream);

WriteStream.prototype.write = function write(data) {
  this._buffer += data;
  this.bytesWritten += data.length;
};

WriteStream.prototype.end = function end() {
  FILESYSTEM.writeFile(this.path, this._buffer, function (err) {
    this.emit('close');
  }.bind(this));
};

function ReadStream(path) {
  this.readable = true;
  this.path = path;
};
util.inherits(ReadStream, Stream);

ReadStream.prototype.pipe = function pipe(dest) {
  console.log('path', this.path);
  FILESYSTEM.readFile(this.path, function (err, dataObj) {
    dest.write(dataObj.data);
  });
  return dest;
};

module.exports = fs;