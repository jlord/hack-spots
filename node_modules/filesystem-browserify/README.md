# filesystem-browser

A (partial) implementation of
[node's `fs`](http://nodejs.org/docs/latest/api/fs.html) in the browser,
on top of
[IndexedDB](https://developer.mozilla.org/en-US/docs/IndexedDB) (by way
of [IDBWrapper](http://jensarps.github.com/IDBWrapper/))

# what's implemented

* `fs.readdir`
* `fs.readFile`
* `fs.writeFile`
* `fs.unlink`
* `fs.rename`
* `fs.createReadStream`
* `fs.createWriteStream`

# tests

I need 'em.
