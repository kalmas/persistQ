
function Queue(name){
	
	var queueName = "_queue-" + name;
	if(localStorage.getItem(queueName) === null){
		// Initialize Queue as an empty array
		localStorage.setItem(queueName, JSON.stringify([]));
	}
	
	this.offer = function(item){
		var queue = JSON.parse(localStorage.getItem(queueName));
		queue.push(item);
		localStorage.setItem(queueName, JSON.stringify(queue));
	}
	
	this.poll = function(){
		var queue = JSON.parse(localStorage.getItem(queueName));
		if(queue.length === 0) return null;
		var value = queue.shift();
		localStorage.setItem(queueName, JSON.stringify(queue));
		return value;
	}
	
	this.peek = function(){
		var queue = JSON.parse(localStorage.getItem(queueName));
		if(queue.length === 0) return null;
	    return queue[0];
	}

}