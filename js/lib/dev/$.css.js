(function() {
		
	var head = document.getElementsByTagName('head')[0],
		styles = {};
	
	$.css = $['css'] || {};
	
	$.css.style = $.css['style'] || function(srcs) {
		var src, i;
		srcs = srcs && srcs.push ? srcs : [srcs];
		for (i=srcs.length; i--;) {
			src = srcs[i]['url'] ? srcs[i] : { url : srcs[i] };
			if (!styles[src.url]) {
				styles[src.url] = [];
				if (typeof src.callback === 'function') styles[src.url].push(src.callback);
				$.require($.path + '$.css.js', $.path + '$.ajax.js', fetch(src.url));
			} else if (typeof src.callback === 'function') src.callback(url);
		}
	}
	
	$.css.link = $.css['link'] || function(urls) {
		var url, style, i;
		urls = urls && urls.push ? urls.reverse() : [urls];
		for (i=urls.length; i--;) {
			if (!styles[urls[i]]) {
				styles[urls[i]] = [];
				style = document.createElement('link');
				style.rel = 'stylesheet';
				style.type = 'text/css';
				style.href = urls[i];
				head.appendChild(style);
			}
		}
	};
	
	$.css.replace = $.css['replace'] || function(oldUrl, newUrl) {
		var i, links = head.getElementsByTagName('link');
		for (i=0; i<links.length; i++) {
			if (links[i].href === oldUrl) {
				links[i].href = newUrl;
				break;
			}
		}
	};
	
	function appendStyle(resp) {
		var style;
		if (document.createStyleSheet) { 
			style = document.createStyleSheet();
			style.cssText = resp.xhr.responseText;
		} else {
			style = document.createElement('style');
			style.innerHTML = resp.xhr.responseText;
			head.appendChild(style);
		}
		while (styles[resp.url].length) styles[resp.url].shift()();
	}
	
	function fetch(url) { return function() { $.ajax({ url : url, callback : appendStyle }); }; }
	
})();