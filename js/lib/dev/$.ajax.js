$.require($.path + '$.ajax.js', $.path + '$.underscore.js',
function() {
	
	var defaults = {
			headers: [],
			method: "GET",
			url: "",
			username: null,
			password: null,
			timeout: 0,
			async: true,
			data: null,
			callback: function() {}
		};
	
	$.ajax = $['ajax'] || {};
	
	$.ajax.send = $.ajax['send'] || function(args) {
		var XHRIDs, label, i;
		$.defaults(args, defaults);
		if (!args.xhr) {
			try { args.xhr = new XMLHttpRequest(); }
			catch (e1) {
				XHRIDs = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
				while (XHRIDs.length) {
					try { args.xhr = new ActiveXObject(XHRIDs.shift()); }
					catch (e2) { continue; }
					break;
				}
			}
			if (!args.xhr) { throw new Error("No known XmlHttpRequest implementation supported."); }
		}
		args.xhr.open(args.method, args.url, args.async, args.username, args.password);
		args.xhr.onreadystatechange = function() {
			if (args.xhr.readyState === 4) {
				clearTimeout(args.timerid);
				delete args.timerid;
				args.callback(args);
			}
		};
		if (args.headers.length) {
			for (i = 0; i < args.headers.length; i++) {
				for (label in args.headers[i]) {
					args.xhr.setRequestHeader(label, args.headers[i][label]);
				}
			}
		}
		if (args.timeout && args.timeout > 0) {
			args.timerid = setTimeout(function() {
				delete args.timerid;
				args.xhr.abort();
				args.callback(args);
			}, args.timeout);
		}
		args.xhr.send(args.data);
	};
	
	$.ajax.get = $.ajax['get'] || function(args) {
		args.method = "GET";
		args.data = null;
		$.ajax.send(args);
	};
	
	$.ajax.postJSON = $.ajax['postJSON'] || function(args) {
		args.method = "POST";
		args.headers = [{'content-type' : 'application/json'}];
		args.data = args.data;
		$.ajax.send(args);
	};
		
});