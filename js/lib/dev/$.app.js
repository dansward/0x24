(function() {
	
	var cache = {};
	
	$.app = $['app'] || {};
	
	$.app.subscribe = $.app['subscribe'] || function(event, callback) {
		var handlers = cache[event] || [];
		handlers.push(callback);
		cache[event] = handlers;
	};
	
	$.app.unsubscribe = $.app['unsubscribe'] || function(event, callback) {
		var handlers = cache[event] || [],
			i = handlers.length;
		while (i--) {
			if (handlers[i] === callback) {
				handlers.splice(i, 1);
			}
		}
	};
	
	$.app.publish = $.app['publish'] || function(event, data) {
		var handlers = cache[event] || [],
			i = handlers.length;
		while (i--) { handlers[i](data); }
	};
	
})();