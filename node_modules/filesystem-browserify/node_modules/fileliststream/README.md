# fileliststream

Given a FileList, turn it into a FileListStream.

# install

Use it with npm & [browserify](/substack/node-browserify)

```bash
$ npm install fileliststream
```

# example
```js
const FileListStream = require('fileliststream');
const body = document.body;

// make it so console can be piped to.
console.write = console.log;

function noop(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

['dragenter',
 'dragleave',
 'dragexit',
 'dragover'
].forEach(function (eventType) {
   body.addEventListener(eventType, noop);
});

body.addEventListener('drop', function (event) {
  event.stopPropagation();
  event.preventDefault();

  const fileList = FileListStream(event.dataTransfer.files);

  fileList.files.map(function(file) {
     file.pipe(console);
  });

  return false;
});
```

# usage

```js
FileListStream(fileList, [options])
```

`options` currently has one possible parameter, `output`. Possible values are:

* `binary` [default]
* `dataurl`
* `arraybuffer`
* `text`
