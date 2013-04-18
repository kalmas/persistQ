(function(window){
    window.yepnope([{
    	load: ["ie!/public/js/polyfill-ie-setTimeout.js"], // IE setTimeout Polyfill
    	test : typeof Queue === "undefined",
		yep: ["/public/js/queue.js"], // Client-side Persistent Queue
		complete : function(){
			var eventLogQueue = new Queue("event", window);
			
			// Limit how many times we will retry a send
			var maxSendAttempts = 3, sendAttempts = 0;
		
		    var processEventQueue = function(queue){
		    	if(queue.peek() !== null){
		    		sendEvent(queue);
		    	} else {
		    		// window.console.log("queue is empty, sleep");
		    		window.setTimeout(processEventQueue, 1000, queue);   
		    	}
		    };
		    
		    /**
		     * Returns a RFC 4122 compliant UUID
		     */
		    var guid = function(){
		    	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(match){
		    		if(match === 'x'){
		    			// Replace x's with a random hex digit
		    			return (window.Math.floor(window.Math.random() * 16)).toString(16);
		    		} else {
		    			// Replace y with one of 4 chars
		    			var options = ['8', '9', 'A', 'B'];
		    			return options[window.Math.floor(window.Math.random() * 4)];
		    		}
		    	});
		    };
			
		    var sendEvent = function(queue){
		    	var xhr = new XMLHttpRequest();
		    	xhr.onreadystatechange = function(){
		    		if(xhr.readyState === 4){
		    			if(xhr.status === 200){
		    				// window.console.log("request succeeded, dequeue this event");
		    				queue.poll();
		    				sendAttempts = 0;
		    			} else {
		    				if(sendAttempts < maxSendAttempts){
		    					sendAttempts = sendAttempts + 1;
		    				} else {
		    					// window.console.log("request failed too many times, dequeue this event");
		    					queue.poll();
		    					sendAttempts = 0;
		    				}
		    			}
		    			processEventQueue(queue);
		    	    }
		    	};
		    	var event = queue.peek();
		    	if(typeof event.time === "undefined"){
		    		// log common event
		    		xhr.open("GET", "/ajax/eventLogging.ajax.php?eventid=" + event.eventid +
			    			"&someid=" + event.someid +
			    			"&typecode=" + event.typecode +
			    			"&pagename=" + event.pagename +
			    			"&sourcecode=" + event.sourcecode +
			    			"&jsguid=" + event.jsguid +
			    			"&rand=" + window.Math.random()
			    			, true);
		    	} else {
		    		// log timed event
			    	xhr.open("GET", "/ajax/theaterLogging.ajax.php?siteid=" + event.siteid +
			    			((event.code) ? ("&code=" + event.code) : "") + 
			    			"&time=" + event.time +
			    			"&length=" + event.length +
			    			"&jsguid=" + event.jsguid +
			    			"&rand=" + window.Math.random()
			    			, true);
		    	}
		    	xhr.send();
		    };
		    
		    processEventQueue(eventLogQueue);
		
			/**
			 * Global Common Log Event Functions
			 */
			window.common_log_event = function(eventid, someid, typecode, pagename, sourcecode){
				var event = {};
				event.eventid = eventid;
				event.someid = someid;
				event.typecode = typecode;
				event.pagename = pagename;
				event.sourcecode = sourcecode;
				event.jsguid = guid();
				// window.console.log("Queueing:" + window.JSON.stringify(event));
				eventLogQueue.offer(event);	
			};
			
			window.common_log_timed_event = function(siteid, code, time, length){
				var event = {};
				event.siteid = siteid;
				event.code = code;
				event.time = time;
				event.length = length;
				event.jsguid = guid();
				// window.console.log("Queueing:" + window.JSON.stringify(event));
				eventLogQueue.offer(event);	
			};
		}
    }]);
})(this);