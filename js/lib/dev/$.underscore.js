$.require(
	$.path + '$.underscore.js',
	'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.1.7/underscore-min.js',
	function() {
	_.each(_.functions($), function(v, k) {
		_[k] = v;
	});
	_.extend(_, $);
	$ = _;
	_ = void 0;
});