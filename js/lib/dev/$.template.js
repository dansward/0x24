$.require($.path + '$.template.js',
[
 	$.path + '$.underscore.js',
 	$.path + '$.ajax.js'
],
function () {

	var defaults = {
			src: '',
			binding: {},
			callback: null
		},
		cache = {},
		build = isFunction($.template) ? $.template : void 0;
	
	$.template = $['template'] || {};

	$.template.parse = $.template['parse'] || function(args) {
		var i, conf, template;
		args = args && args.push ? args.reverse() : [args];
		for (i=args.length; i--;) {
			conf = $.defaults(args[i], defaults);
			template = cache[conf.src];
			if (!template) {
				get(conf);
				if (!conf.source) { fetch(conf); }
			}
			if (conf.source) {
				template = cache[conf.src] = build(conf.source);
				delete conf.source;
			}
			if (template && $.isFunction(conf.callback)) {
				conf.callback(template(conf.binding));
			}
		}
	};

	function get(conf) {
		var source = document.getElementById(conf.src);
		if (source) { conf.source = source.innerHTML; }
	}

	function fetch(conf) {
		$.ajax.send({
			method : 'GET',
			url : conf.src,
			callback : function (args) {
				conf.source = args.xhr.responseText;
				$.template.parse(conf);
			}
		});
	}

});