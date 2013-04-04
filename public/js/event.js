(function(window){
	window.yepnope([{
		test : typeof Queue === "undefined",
		yep: ["/public/js/queue.js"],
		callback : function(){
			var eventLogQueue = new Queue("event", window);	
		
		    var processEventQueue = function(queue){
		    	if(queue.peek() !== null){
		    		sendEvent(queue);
		    	} else {
		    		// window.console.log("queue is empty, sleep");
		    		window.setTimeout(processEventQueue, 1000, queue);   
		    	}
		    };
			
		    var sendEvent = function(queue){
		    	var xhr = new XMLHttpRequest();
		    	xhr.onreadystatechange = function(){
		    		if(xhr.readyState == 4){
		    			if(xhr.status == 200){
		    				// window.console.log("request succeeded, dequeue this event");
		    				queue.poll();
		    			}
		    			processEventQueue(queue);
		    	    }
		    	};
		    	var event = queue.peek();
		    	if(typeof event.time === "undefined"){
		    		// log common event
		    		xhr.open("GET", "/ajax/eventLogging.ajax.php?eventid=" + event.eventid
			    			+ "&someid=" + event.someid
			    			+ "&typecode=" + event.typecode
			    			+ "&pagename=" + event.pagename
			    			+ "&source=" + event.source    			
			    			, true);
		    	} else {
		    		// log timed event
			    	xhr.open("GET", "/ajax/theaterLogging.ajax.php?siteid=" + event.siteid
			    			+ "&code=" + event.code
			    			+ "&time=" + event.time
			    			+ "&length=" + event.length  			
			    			, true);
		    	}
		    	xhr.send();
		    };
		    
		    processEventQueue(eventLogQueue);
		
			/**
			 * Global Common Log Event Functions
			 */
			window.common_log_event = function(eventid, someid, typecode, pagename, source){
				var event = {};
				event.eventid = eventid;
				event.someid = someid;
				event.typecode = typecode;
				event.pagename = pagename;
				event.source = source;
				// window.console.log("Queueing:" + window.JSON.stringify(event));
				eventLogQueue.offer(event);	
			};
			
			window.common_log_timed_event = function(siteid, code, time, length){
				var event = {};
				event.siteid = siteid;
				event.code = code;
				event.time = time;
				event.length = length;
				// window.console.log("Queueing:" + window.JSON.stringify(event));
				eventLogQueue.offer(event);	
			};
		}
	}]);
})(this);