function Queue(name, localStorage){
	var queueName = "_queue-" + name;
	
	var load = function(){
		var queue = JSON.parse(localStorage.getItem(queueName));
		if(Object.prototype.toString.call(queue) !== '[object Array]'){
			// Initalize as an empty array
			queue = [];
		}
		return queue;
	}; 
	
	this.offer = function(item){
		var queue = load();
		queue.push(item);
		localStorage.setItem(queueName, JSON.stringify(queue));
	}
	
	this.poll = function(){
		var queue = load();
		if(queue.length === 0) return null;
		var value = queue.shift();
		localStorage.setItem(queueName, JSON.stringify(queue));
		return value;
	}
	
	this.peek = function(){
		var queue = load();
		if(queue.length === 0) return null;
	    return queue[0];
	}
	
	this.removeAll = function(){
		localStorage.removeItem(queueName);		
	}

}