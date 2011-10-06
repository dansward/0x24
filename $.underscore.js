$.require($.path + '$.underscore.js', 'http://goo.gl/kUvZi',
function() {
	_.each(_.functions($), function(v, k) { _[k] = v; });
	_.extend(_, $);
	$ = _;
	_ = void 0;
});