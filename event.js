(function(window, doc, undef){
	window.yepnope([{
		test : typeof Queue === "undefined",
		yep: ["../queue.js"],
		callback : function(){
			var eventLogQueue = new Queue("event", window.localStorage);	
		
		    var processEventQueue = function(queue){
		    	if(queue.peek() !== null){
		    		sendEvent(queue);
		    	} else {
		    		console.log("queue is empty, sleep");
		    		setTimeout(processEventQueue, 1000, queue);   
		    	}
		    };
			
		    var sendEvent = function(queue){
		    	var xhr = new XMLHttpRequest();
		    	xhr.onreadystatechange = function(){
		    		if(xhr.readyState == 4){
		    			if(xhr.status == 200){
		    				console.log("request succeeded, dequeue this event");
		    				queue.poll();
		    			}
		    			processEventQueue(queue);
		    	    }
		    	};
		    	var event = queue.peek();
//		    	xhr.open("GET", "/ajax/eventLogging.ajax.php?eventid=" + event.eventid
//		    			+ "&someid=" + event.someid
//		    			+ "&typecode" + event.typecode
//		    			+ "&pagename" + event.pagename
//		    			+ "&source" + event.source    			
//		    			, "true");
//		    	xhr.send();   
		    	console.log (event);
		    	queue.poll();
		    	setTimeout(processEventQueue, 1000, queue);
		    };
		    
		    processEventQueue(eventLogQueue);
		
			/**
			 * Global Event Log Functions
			 */
			window.common_log_event = function(eventid, someid, typecode, pagename, source){
				var event = {};
				event.eventid = eventid;
				event.someid = someid;
				event.typecode = typecode;
				event.pagename = pagename;
				event.source = source;
				
				eventLogQueue.offer(event);	
			};
		}
	}]);
})(this, document);