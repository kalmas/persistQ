function Queue(name, window){
	var queueName = "_persistQueue-" + name;
	var storage = window.localStorage;
	
	var load = function(){
		var queue = window.JSON.parse(storage.getItem(queueName));
		if(window.Object.prototype.toString.call(queue) !== '[object Array]'){
			// Initialize as an empty array
			queue = [];
		}
		return queue;
	}; 
	
	this.offer = function(item){
		var queue = load();
		queue.push(item);
		storage.setItem(queueName, window.JSON.stringify(queue));
	};
	
	this.poll = function(){
		var queue = load();
		if(queue.length === 0){ return null; }
		var value = queue.shift();
		storage.setItem(queueName, window.JSON.stringify(queue));
		return value;
	};
	
	this.peek = function(){
		var queue = load();
		if(queue.length === 0){ return null; }
	    return queue[0];
	};
	
	this.removeAll = function(){
		storage.removeItem(queueName);		
	};

}