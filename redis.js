var express = require('express'), app = express();
var redis = require("redis"), client = redis.createClient();

client.on("error", function (err) {
    console.log("error event - " + client.host + ":" + client.port + " - " + err);
});

// Log event to text file
app.get('/log-event', function(req, res){
	var args = {};
	args.event = req.query;
	args.url = req.query.url;
	delete args.event.url;
	var resqueObj = {
			"class" : "QueueHandler\\EventLog",
			"args" : [{
				"eventargs" : args.event,
				"url" : args.url
			}]
	};
	
	client.rpush("resque:queue:event", JSON.stringify(resqueObj), function(err, replies){
		if(err){
			res.send(500, err);
		}else{
			res.send(200);
		}
	});

});

app.listen(3000);