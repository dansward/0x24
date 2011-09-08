$.require('/0x24/js/intro.js', $.path + '$.css.js',
function() {
	
	$.css.style([
   	    '/0x24/css/0x24.css?30',
   	    '/0x24/css/menu.css'
   	]);
	
	WebFontConfig = {
		google: { families: [ 'Istok Web:400,700', 'Droid Sans Mono' ] }
	};
	
	$.require('/0x24/js/intro.js', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
	
	$.css.link('http://alexgorbatchev.com/pub/sh/current/styles/shThemeMidnight.css');
	
	$.require('/0x24/js/intro.js', {
		url : 'http://alexgorbatchev.com/pub/sh/current/scripts/shCore.js',
		async : true
	}, function() {
		$.require('http://alexgorbatchev.com/pub/sh/current/scripts/shCore.js', {
			url : 'http://alexgorbatchev.com/pub/sh/current/scripts/shAutoloader.js',
			async : true
		}, function() {
			SyntaxHighlighter.defaults['auto-links'] = false;
			SyntaxHighlighter.defaults['smart-tabs'] = false;
			SyntaxHighlighter.autoloader.apply(null, [
				'js   http://alexgorbatchev.com/pub/sh/current/scripts/shBrushJScript.js',
				'html http://alexgorbatchev.com/pub/sh/current/scripts/shBrushXml.js'
			]);
			SyntaxHighlighter.all();
		});
	});
	
});