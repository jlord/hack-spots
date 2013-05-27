const fs = require('./');
const FileListStream = require('fileliststream');

const logger = {
  write: function write(data) {
    const textAreaElem = document.getElementById('output');
    textAreaElem.innerHTML = data;
  }
}
const body = document.body;
function noop(name) {
  return function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
};

body.addEventListener('dragenter', noop('dragEnter'));
body.addEventListener('dragleave', noop('dragLeave'));
body.addEventListener('dragexit', noop('dragExit'));
body.addEventListener('dragover', noop('dragOver'));
body.addEventListener('drop', function (event) {
  event.stopPropagation();
  event.preventDefault();

  const fileListStream = FileListStream(event.dataTransfer.files);
  const file = fileListStream[0];

  const writestream = fs.createWriteStream(file.name);
  file.pipe(writestream).on('close', function () {
    addLinkItem(writestream.path);
  });

  return false;
});

function addLinkItem(path) {
  const ol = document.getElementById('fileList');
  const liElem = document.createElement('li');
  const aElem = document.createElement('a');
  aElem.innerHTML = path;

  aElem.addEventListener('click', function () {
    const readstream = fs.createReadStream(path);
    readstream.pipe(logger);
    event.preventDefault();
    return false;
  }, false);

  liElem.appendChild(aElem);
  ol.appendChild(liElem);
}

(function () {
  fs.readdir('.', function (err, files) {
    files.map(addLinkItem);
  });
})();

window.fs = fs;