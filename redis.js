var express = require('express'), app = express();
var redis = require("redis"), client = redis.createClient();

client.on("error", function (err) {
    console.log("error event - " + client.host + ":" + client.port + " - " + err);
});

app.get('/log-event', function(req, res){

	// Quick Validate
	if(typeof req.query.eventid !== 'string' 
			|| typeof req.query.typecode !== 'string'
			|| typeof req.query.someid !== 'string'
			|| typeof req.query.sourcecode !== 'string'
			|| typeof req.query.pagename !== 'string'
			|| typeof req.query.url !== 'string'){
		con
		res.send(400, "Expected Params: eventid, typecode, someid, sourcecode, pagename, url");		
		return;
	}
	
	// Shape data the way the resque worker expects
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
	
	// Push to redis
	client.rpush("resque:queue:event", JSON.stringify(resqueObj), function(err, replies){
		if(err){
			res.send(500, err);
		}else{
			res.send(200);
		}
	});
});

app.listen(3000);