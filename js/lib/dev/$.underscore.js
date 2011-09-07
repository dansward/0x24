$.require(
	$.path + '$.underscore.js',
	$.path + 'underscore.js',
	function() {
	_.each(_.functions($), function(v, k) {
		_[k] = v;
	});
	_.extend(_, $);
	$ = _;
	_ = void 0;
});