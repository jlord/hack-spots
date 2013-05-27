var http = require('http');
var url = require('url');

var receive = function(dataUrl, dataReady) {
    var urlp = url.parse(dataUrl);
    var service = http.createClient(urlp.port ? urlp.port : 80, urlp.hostname);
    var req = service.request('GET', urlp.pathname + urlp.search,
        {'host': urlp.hostname});

    var data = null, status = null, finished = false;

    req.on('response', function (res) {
        var body = "";
        status = res.statusCode;

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            data = JSON.parse(body);
            if (!finished) {
                finished = true;
                dataReady(data);
            }
        });
    });

    req.end();

    setTimeout(function() {
        if (!finished) {
            finished = true;
            dataReady(null);
        }
    }, 2000);
};

console.log(process.cwd());
var ft = require(process.cwd() + '/lib/feed-tables.js');

receive("https://spreadsheets.google.com/feeds/cells/0AoooUkEfVrhldEpRekRVakVYWmJ2U2Z4SFBVZ0M1Nnc/od6/public/basic?alt=json",
 function(data) {
        if (data) {
            var table = new ft.CellsFeed(data);            
            for (var r = 0; r < table.length; r++) {
                var row = table.getRow(r);
                console.log("name: " + row.name + ", street: " + row.street, " city: " + row.city + "\n");
            }
        } else
            console.log("Timeout while fetching the Google Spreadsheet data.");
    });
  
  