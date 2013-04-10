var express = require('express'), app = express();
var redis = require("redis"), client = redis.createClient();

function isValid(req){
	if(typeof req.query.eventid === 'string'
			&& typeof req.query.someid === 'string'
			&& typeof req.query.typecode === 'string'
			&& typeof req.query.pagename === 'string'			
			&& typeof req.query.sourcecode === 'string'){
		return true;
	} else if(req.query.siteid === 'string'
			&& typeof req.query.code === 'string'
			&& typeof req.query.time === 'string'			
			&& typeof req.query.length === 'string'){
		return true;
	} else {
		return false;
	}
}

client.on("error", function (err) {
    console.log("error event - " + client.host + ":" + client.port + " - " + err);
});

app.get('/log-event', function(req, res){

	if(!isValid(req)){
		res.send(400);		
		return;
	}

	var resqueObj = {
			"class" : "QueueHandler\\UserEventBuffer",
			"args" : [{
				"event" : req.query
			}]
	};
	
	// Push to redis
	client.rpush("resque:queue:userEventBuffer", JSON.stringify(resqueObj), function(err, replies){
		if(err){
			res.send(500, err);
		}else{
			res.send(200);
		}
	});
});

app.listen(3000);