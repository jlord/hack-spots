window.Tabletop = require('./tabletop.js').Tabletop
var fs = require('filesystem-browserify')

module.exports = SheetSee

function SheetSee(URL){
  console.log("this is fs", fs)
  var self = this
	Tabletop.init( { key: URL,
                 	 callback: function(data, tabletop) {self.readyData(data, tabletop)},
                   simpleSheet: true } )
  this.sheetData = []
}

SheetSee.prototype.readyData = function(data, tabletop, callback){
  this.sheetData = data

  fs.writeFile('message.txt', 'Hello Node', function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });

  console.log("the datas", this.sheetData)
  callback(this.sheetData)
}
	 
