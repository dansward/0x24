$.require($.path + '$.ajax.js', $.path + '$.underscore-min.js',
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
	
	$.ajax = $['ajax'] || function(args) {
		$.defaults(args, defaults);
		if (!args.xhr) {
			try { args.xhr = new XMLHttpRequest(); }
			catch (e1) {
				var XHRIDs = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
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
			$.each(args.headers, function(header) {
				$.each(header, function(content, label) {
					args.xhr.setRequestHeader(label, content);
				})
			});
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
		
});