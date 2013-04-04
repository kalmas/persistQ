var express = require('express');
var app = express();
var fs = require('fs');

// Serve this directory as static content for an curious browsers
app.use(express.static(__dirname));

// Sanity Checker
app.get('/', function(req, res){
	res.send('servers running');
});

// Simulate multiple pages
app.get(/^\/test\/events\d\.html/, function(req, res){
	res.sendfile(__dirname + '/test/events.html');
});

// Log event to text file
app.get('/ajax/eventLogging.ajax.php', function(req, res){
	fs.appendFile(__dirname + '/log.txt', JSON.stringify(req.query) + "\n", function(err){
		if(err){
			res.send(500, 'opps');
		} else {
			res.send(200, req.query);
		}
	});
});

app.listen(3000);