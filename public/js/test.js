this.queueTests = {
    'example test': function (test) {
        test.ok(true, 'everything is ok');
        test.done();
    },
    
    'test create' : function(test){
    	var q = new Queue('test', window);
    	test.ok(typeof q === 'object', 'made an object');
    	test.done();
    },
    
    'test peek offer and poll' : function(test){
    	var q = new Queue('test', window);
    	q.removeAll();
    	test.ok(q.peek() === null, 'empty queue is empty');
    	
    	q.offer({id:"test"});
    	
    	var obj1 = q.peek();
    	test.ok(obj1 !== null, 'queue is no longer empty');
    	test.ok(obj1.id == 'test', 'peek fetched expected object');
    	
    	var obj2 = q.peek();
    	test.ok(obj1 !== null, 'peeking dosent remove head');
    	test.ok(obj2.id == 'test', 'peek fetched expected object agian');
    	
    	var obj3 = q.poll();
    	test.ok(obj3.id == 'test', 'poll fetched expected object');
    	test.ok(q.peek() === null, 'queue is empty agian');

    	test.done();
    }
};


this.eventTests = {
    'test log event adds that event to queue': function (test) {
    	// Grab a copy of the queue that event code will use
    	var q = new Queue('event', window);
    	q.removeAll();
    	window.common_log_event('FloorPlan_Detail_Search_List_exact', 1000010783, 'site', 'Search', 'ForRent.com');
    	
    	// There is potential for a race condition here I think
    	// The queue runner could poll the first item before we can peek it
    	var obj = q.peek();    	
    	test.ok(obj.eventid === 'FloorPlan_Detail_Search_List_exact', 'eventid is ok');
    	test.ok(obj.someid === 1000010783, 'someid is ok');
    	test.ok(obj.typecode === 'site', 'typecode is ok');
    	test.ok(obj.pagename === 'Search', 'pagename is ok');
    	test.ok(obj.source === 'ForRent.com', 'source is ok');
    	test.ok((obj.timestamp - Math.round(new window.Date().getTime() / 1000)) < 10, 'timestamp is current');

    	test.done();
    },
    'test log timed event adds that timed event to queue': function (test) {
    	// Grab a copy of the queue that event code will use
    	var q = new Queue('event', window);
    	q.removeAll();
    	window.common_log_timed_event(1000010783, 12345, 14, 90);
    	
    	// There is potential for a race condition here I think
    	// The queue runner could poll the first item before we can peek it
    	var obj = q.peek();    	
    	test.ok(obj.siteid === 1000010783, 'siteid is ok');
    	test.ok(obj.code === 12345, 'code is ok');
    	test.ok(obj.time === 14, 'time is ok');
    	test.ok(obj.length === 90, 'length is ok');
    	test.ok((obj.timestamp - Math.round(new window.Date().getTime() / 1000)) < 10, 'timestamp is current');

    	test.done();
    }
    
};
