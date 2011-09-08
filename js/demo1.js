$.require(
/*
 * 1st parameter should always be the url of the current script.
 */
'/0x24/js/intro.js',
/*
 * 2nd parameter is the sources of the dependencies of the current script.
 * 
 * Sources may be a single string, an array of strings, a single object, or an array of objects.
 * Here we are using an array of strings to specify the urls of the scripts
 * that need to be loaded before the callback in the 3rd parameter can be executed.
 * The other options for this parameter will be demonstrated below.
 * 
 * Only the dependencies that are directly used by this script need to be included.
 */
[
 	'http://alexgorbatchev.com/pub/sh/current/scripts/shCore.js',
 	'http://alexgorbatchev.com/pub/sh/current/scripts/shAutoloader.js'
],
/*
 * 3rd parameter is a callback function to be executed as soon as all of the dependencies have loaded.
 */
function() {
	
	/*
	 * $.require may also be called within a callback. Here we are using it
	 * to load the $.css.js script using a single string as the 2nd parameter.
	 */
	$.require('/0x24/js/intro.js', $.path + '$.css.js', function() {
		/*
		 * As soon as the $.css.js script is loaded we use it
		 * to fetch the default stylesheet for our code boxes.
		 */
		$.css.require(shTheme);
	});
	/*
	 * This one would normally have been included in the main $.require but,
	 * is here to demonstrate the use of a single object as the 2nd parameter.
	 */
	$.require('/0x24/js/intro.js',
		{
			// The url of the script
			url			: $.path + '$.dom.js',
			// True to load asynchronously, if the browser supports it. Default is false.
			async		: true,
			// A callback to execute as soon as this script has loaded.
			callback	: attachThemeSwitchEvents
		}
		/*
		 * The 3rd parameter is excluded here because the work that needs to be done
		 * is being done in the callback function included in the callback property of
		 * source object of the dependency in the second parameter. Yeah, that was mouth
		 * full. Normally it would be here, but this way we get to see the flexibility of $. 
		 */
	);
	
	/***
	 * The rest is page specific and included because I'm lazy.
	 * I do like to be able to follow all of the code in demonstrations
	 * to be sure I'm not missing anything and figured there is the
	 * possibility that you are like me....Yeah, okay, I'm lazy. :)
	 ***/
	
	/*
	 * Holds the url of the currently selected SyntaxHighlighter theme.
	 */
	var shTheme = 'http://alexgorbatchev.com/pub/sh/current/styles/shThemeMidnight.css';

	/*
	 * Attaches events to the theme buttons
	 */
	function attachThemeSwitchEvents() {
		var buttons = document.querySelectorAll('button.shTheme');
		for (var i=0; i<buttons.length; i++) {
			$.dom.addEventListener(buttons[i], 'click', switchTheme);
		}
	}
	
	/*
	 * Changes the currently displayed demo
	 */
	function switchDemo(e) {
		var e = e || window.event,
			button = e.target || e.srcElement,
			demoId = button.value,
			header = demo.querySelector('h2');
		header.innerHTML = button.innerHTML;
		$.require('/0x24/js/intro.js',
		[
		 	$.path + '$.ajax.js'
		],
		function() {
			$.ajax.get({
				url : '/0x24/js/' + demoId + '.js',
				callback : loadDemo
			});
		});
	}
	
	/*
	 * Loads the selected demo
	 */
	function loadDemo(ajaxResponse) {
		var demo = document.querySelector('#demo'),
			codebox = demo.querySelector('div.code-box'),
			highlighter = document.createElement('pre'),
			lines = ajaxResponse.xhr.responseText.split('\n');
		demo.style.display = 'block';
		highlighter.className = 'brush: js;';
		while (lines.length) highlighter.innerHTML += lines.shift();
		codebox.innerHTML = '';
		codebox.appendChild(highlighter);
		applyTheme();
	}
	
	/*
	 * Changes the SyntaxHighlighter theme
	 */
	function switchTheme(e) {
		var e = e || window.event,
			button = e.target || e.srcElement,
			newTheme = button.value;
		$.css.replace(shTheme, newTheme);
		shTheme = newTheme;
	}
	
	/*
	 * Attaches events to the demo buttons
	 */
	$.require('/0x24/js/intro.js', $.path + '$.dom.js', function() {
		var buttons = document.querySelectorAll('button.demo');
		for (var i=0; i<buttons.length; i++)
			$.dom.addEventListener(buttons[i], 'click', switchDemo);
		document.querySelector('button.demo').click();
	});
	
	/*
	 * SyntaxHighlighter doing its thing
	 */
	SyntaxHighlighter.defaults['auto-links'] = false;
	function applyTheme() {
		SyntaxHighlighter.autoloader.apply(null,
		[
		 'js jscript javascript  http://alexgorbatchev.com/pub/sh/current/scripts/shBrushJScript.js',
		 'xml xhtml xslt html  http://alexgorbatchev.com/pub/sh/current/scripts/shBrushXml.js'
		]);
		SyntaxHighlighter.all();
	}
	
	applyTheme();
});