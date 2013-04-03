var express = require('express'), app = express();
var resque = require('coffee-resque').connect({
	host: "localhost",
	port: "6379"
});

// Log event to text file
app.get('/log-event', function(req, res){
	var event = req.query;
	var url = req.query.url;
	delete event.url;
	
	var args = [{
		"eventargs" : event,
		"url" : url
	}];
	resque.enqueue("event", 'QueueHandler\EventLog', args);
	res.send(200, JSON.stringify(args));

});

app.listen(3000);