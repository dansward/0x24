(function() {
	
	var cache = {};
	
	$.events = $['app'] || {};
	
	$.events.subscribe = $.events['subscribe'] || function(event, callback) {
		var handlers = cache[event] || [];
		handlers.push(callback);
		cache[event] = handlers;
	};
	
	$.events.unsubscribe = $.events['unsubscribe'] || function(event, callback) {
		var handlers = cache[event] || [], i;
		for (i=0; i<handlers.length; i++) {
			if (handlers[i] === callback) {
				handlers.splice(i, 1);
			}
		}
	};
	
	$.events.publish = $.events['publish'] || function(event, data) {
		var handlers = cache[event] || [], i;
		for (i=0; i<handlers.length; i++) { handlers[i](data); }
	};
	
})();