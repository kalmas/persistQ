(function () {	
	var eventLogQueue = new Queue("eventQ");	
	
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
		
	    //$.get("/ajax/eventLogging.ajax.php", { eventid:eventid, someid: someid, typecode: typecode, pagename: pagename, sourcecode: source}); 
	}


})();