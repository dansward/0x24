(function() {
	
	var modules = {},
		srx = /^(.+)\$(-min)?\.js$/,
		scripts, env, src, i;
	
	$ = window.$ || {};
	
	$.require = $['require'] || function (modUrl, depSrcs, callback) {
		var scripts = [], inlines = [], script, module, src, i;
		depSrcs = depSrcs && depSrcs.push ? depSrcs.reverse() : [depSrcs];
		if (!modules[modUrl]) modules[modUrl] = newmod();
		module = modules[modUrl];
		module.ready = true;
		if (callback) module.stack.unshift(callback);
		for (i=depSrcs.length; i--;) {
			src = depSrcs[i]['url'] ? depSrcs[i] : { url : depSrcs[i] };
			module.deps[src.url] = null;
			if (!modules[src.url]) {
				modules[src.url] = newmod();
				if (src['inline']) inlines.push(src.url);
				else {
					script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = src.url;
					script.async = src.async === void 0 || !!src.async;
					script.defer = !!src.defer;
					script.onload = script.onreadystatechange = modload(src.url, script);
					scripts.push(script);
				}
			}
			modules[src.url].mods[modUrl] = null;					
			if (src['callback']) modules[src.url].stack.push(src.callback);
		}
		if (!scripts.length && !inlines.length && modready(modUrl, {})) depready(modUrl);
		while (scripts.length) env.appendChild(scripts.shift());
		while (inlines.length)
			$.require(modUrl, {
				url : $.path + '$.ajax.js',
				callback : fetch(inlines.shift())
			});
	};
			
	function modready(url, urls) {
		var mod = modules[url],
			ready = mod.ready,
			i = mod.stack.length,
			dep;
		urls[url] = true;
		for (dep in mod.deps) {
			if (!ready) break;
			if (urls[dep]) continue;
			ready = modready(dep, urls);
		}
		while (ready && i--) mod.stack.shift()();
		return ready;
	}
	
	function depready(url) {
		for (var mod in modules[url].mods)
			if (modready(mod, {})) depready(mod);
	}
	
	function newmod() { return { mods : {}, deps : {}, stack : [], ready : false }; }
	
	function modload(url, script) {
		return function() {
			if (script.readyState === void 0 || /de|et/.test(script.readyState)) {
				modules[url].ready = true;
				if (modready(url, {})) depready(url);
			}
		};
	}
	
	function inline(resp) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.text = resp.xhr.responseText;
		env.appendChild(script);
		modules[resp.url].ready = true;
		if (modready(resp.url, {})) depready(resp.url);
	}
	
	function fetch(url) { return function() { $.ajax({ url : url, callback : inline }); }; }

	scripts = document.getElementsByTagName('script');
	for (i=0; i<scripts.length; i++) {
		if (srx.test(scripts[i].src)) {
			$.path = scripts[i].src.replace(srx, '$1');
			env = scripts[i].parentNode || document.body;
			src = scripts[i].getAttribute('main-src');
			if (src) $.require($.path + '$.js', src);
			break;
		}
	}
	
})();