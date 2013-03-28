this.queueTests = {
    'example test': function (test) {
        test.ok(true, 'everything is ok');
        test.done();
    },
    
    'test create' : function(test){
    	q = new Queue('test');
    	test.ok(typeof q === 'object', 'made an object');
    	test.done();
    },
    
    'test offer' : function(test){
    	q = new Queue('test');
    	test.ok(typeof q === 'object', 'made an object');
    	test.done();
    },
};
