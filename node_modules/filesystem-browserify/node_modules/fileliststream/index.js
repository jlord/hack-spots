const Stream = require('stream');

function FileListStream(fileList, options) {
  if (!(this instanceof FileListStream))
    return new FileListStream(fileList, options);
  this.files = [].slice.call(fileList).map(function (file) {
    return new FileStream(file, options);
  });
  this.files.forEach(function (file, idx) {
    this[idx] = file;
  }, this);
};

function FileStream(file, options) {
  if (!(this instanceof FileStream))
    return new FileStream(file, options);
  options = options || {};
  options.output = options.output || 'binary';
  this.options = options;
  this._file = file;
  this.readable = true;
  ['name',
   'size',
   'type',
   'lastModifiedDate'].forEach(function (thing) {
     this[thing] = file[thing];
   }, this);
};

FileStream.prototype.pipe = function pipe(dest, options) {
  const outputType = this.options.output;
  const reader = new FileReader();
  reader.onload = function loaded(event) {
    dest.write(event.target.result);
    if (dest !== console && (!options || options.end !== false)) {
      if (dest.end)
        dest.end();
      if (dest.close)
        dest.close();
    }
  };

  if (outputType === 'binary')
    reader.readAsBinaryString(this._file);
  else if (outputType === 'dataurl')
    reader.readAsDataURL(this._file);
  else if (outputType === 'arraybuffer')
    reader.readAsArrayBuffer(this._file);
  else if (outputType === 'text')
    reader.readAsText(this._file);
  return dest;
};

module.exports = FileListStream;