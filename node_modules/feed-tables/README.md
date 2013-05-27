# Feed Tables

Feed tables provide lightweight parsers for Google Spreadsheets data available as a table in cells feed or list feed JSON data formats.
Feed tables work for both Node.js and a client-side JavaScript. Loading the data is out of the scope of this library, the sample code below shows how you can load the data in Node.js 
and in a browser by using JSONP. You can, however, use any other mechanism to access the data including authorization mechanisms. 

### Spreadsheet data

You must have a Google spreadsheet ready. For example, a <a href="https://spreadsheets.google.com/spreadsheet/ccc?key=0AoooUkEfVrhldEpRekRVakVYWmJ2U2Z4SFBVZ0M1Nnc">sample data</a>
contains data about people such as for every person in the table there is a name, a street, and a city. 
In order to use this data, you can access it
as an atom feed in JSON format either as a <a href="https://spreadsheets.google.com/feeds/list/0AoooUkEfVrhldEpRekRVakVYWmJ2U2Z4SFBVZ0M1Nnc/od6/public/basic?alt=json">list feed</a> or a <a href="https://spreadsheets.google.com/feeds/cells/0AoooUkEfVrhldEpRekRVakVYWmJ2U2Z4SFBVZ0M1Nnc/od6/public/basic?alt=json">cells feed</a>. Note that in order to access a spreadsheet data at such URLs without any authorization, 
you need to publish your spreadsheet as a Web page (in Google Spreadsheet go to Share -> Publish as a Web Page).

## Usage in Node.js

### Installation

    npm install feed-tables

### Loading the data 

First, you need to load the data from the spreadsheet. In Node.js, you can use
http and url libraries and the following `receive` function:

```js
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
```

### Parsing the data

You can use either `CellsFeed` or `ListFeed` parser to parse the data. This depends on the format
of the spreadsheet you want to use. Cells feeds are larger as every spreadsheet cell data 
is in a separated atom feed entry. The `CellsFeed` parser expects that there are names of header fields 
in the first row of the spreadsheet. 

The following code shows how to use the `CellsFeed` parser.

```js
var ft = require('feed-tables');

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
```

List feeds are much smaller in size as every atom feed entry contains a single row, however, this format
does not contain a row with all the table's header field names, hence you need to provide 
the header field names expicitly when creating the parser. 

To create the `ListFeed` parser you need to use the List feed url https://spreadsheets.google.com/feeds/list/0AoooUkEfVrhldEpRekRVakVYWmJ2U2Z4SFBVZ0M1Nnc/od6/public/basic?alt=json 
when retrieving the spreadsheet data and the following code

```js
var table = new ft.ListFeed(data, ["name", "street", "city"]);            
```
## Usage in a browser

In a browser you can load the data either by using XMLHttpRequest or JSONP. Google spreadsheets
supports both options including Cross-Origin Resource Sharing if you use XHR. Following code
shows how to load the data using JSONP for which you need to add `callback` parameter at the end of 
the spreadsheet url. You also need to have `feed-tables.js` included in your document.

```html
<html>
    <head>
        <!-- ... -->
        <script type="text/javascript" src="path/to/your/feed-tables.js"></script>
    </head>
    <body>
        <script>
            var URL = "https://spreadsheets.google.com/feeds/list/0AoooUkEfVrhldEpRekRVakVYWmJ2U2Z4SFBVZ0M1Nnc/od6/public/basic?alt=json&callback=dataReady";
            
            function loadData() {
                var scp = document.createElement('script');
            	scp.setAttribute("type","text/javascript");
            	scp.setAttribute("src", URL);	
            	document.getElementsByTagName("head")[0].appendChild(scp);	
            }
            
            function dataReady(data) {
                var table = new ListFeed(data, ["name", "street", "city"]);
                for (var r = 0; r < table.length; r++) {
                    var row = table.getRow(r);
                    // access data here row.name, row.street, row.city
                    // add them to your HTML code
                }
            }
        </script>
        <!-- ... -->
    </body>
</html>
```

## License 

(The MIT License)

Copyright (c) 2011 Tomas Vitvar &lt;tomas@vitvar.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
