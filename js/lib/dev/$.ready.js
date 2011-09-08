(function() {
	
	var ready = false,
		onready = [];
	
	$.ready = $['ready'] || function(fn) {
		if (typeof fn === 'function') onready.push(fn);
		while (ready && onready.length) onready.shift()();
	};
	
	function domready() {
		ready = true;
		$.ready();
	}
	
	if (document.addEventListener) document.addEventListener('DOMContentLoaded', domready, false);
	else if (document.all && !window.opera) $.require($.path + '$.ready.js', {url : 'javascript'.concat(':void(0)'), defer : true}, domready);
	window.onload = function() { setTimeout(domready, 0); };
	
})();