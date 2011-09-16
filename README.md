# $ [Hex 24]

$ is a javascript loader with built-in dependency management designed for the development of modular javascript applications. It enables lazy loading of dependencies while preventing duplicate loads. Its API consists of a single property and a single method. It requires no dependencies of its own and weighs in at just over 800 bytes minified and gzipped. It also has the added bonus of being written in code that is easy to read and understand.

## API

### $.path

The $.path property is a string containing the url path of the directory where the $.js module resides. It is set when the module loads and is available for use in all other modules.

### $.require

The $.require method is used to define the dependencies of and load all other modules of your application.

## Definitions

In order to avoid confusion, here are a couple definitions of some terms as they are used here.

### module

A module is simply a javascript file. It normally contains either a single anonymous function, if it does not depend on any other modules, or a single anonymous function wrapped by $.require which is used to define and load the module's dependencies. However, a module may be constructed any way you desire. $ does its best to do its job and stay out of your way.

### dependency

A dependency is a module that must be loaded before another module that depends on it can be executed.

## Usage

### Step 1:

Add a script tag to your html. Anywhere inside the head or body will work. Set the src attribute to the url of the $.js module and add a main-src attribute set to the url of the main module of your application.

``` html
	<script type="text/javascript" src="/0x24/js/lib/dev/$.js" main-src="/0x24/js/intro.js"></script>
```

### Step 2:

Develop your application and let $ manage your application's dependencies for you.

## Syntax

``` js
	/*
	 * @param {string} modUrl     Required - The url of the dependent module
	 * @param {mixed} depUrls     Required - The source/s of the dependencies of the dependent module
	 * @param {function} callback Optional - A function containing code to execute after the dependencies
	 *                                       have finished loading, usually the actual code of the module
	 */
	$.require( modUrl, depUrls, [callback] )
```	

### $.require

#### modUrl

In order to map dependencies properly, $ needs to know the module it is managing dependencies for. The modUrl parameter will usually be a string containing the url of the current module. However, in the case of a lazy loading scenario, it may be the url for any module for which dependencies need to be made available prior to its execution.

It is very important that the url of a module is referenced consistently. $ considers 'js/$.ajax.js' and '/js/$.ajax.js' to be two distinct modules. Note the leading / in the latter. Referencing modules inconsistently in this manner will most likely cause your modules to be loaded and executed in the wrong order or not at all.

It is usually best to store all of your modules in the same directory as the $.js module and reference them using the $.path property. e.g. $.path + '$.ajax.js' The one exception to this is your main application module which should only be referenced once in the main-src attribute of the script tag. This, of course, is only a recommendation. You are welcome to design your application any way you see fit. $ will do its best stay out of your way until you need it.

#### depUrls

The depUrls parameter should contain one or an array of structures called sources. A source contains the information needed to load a module that the dependent module requires. Only modules which the dependent module directly uses should be included here. Dependencies of dependencies should be loaded from within their corrosponding modules. This permits a much more modular design. There is also no need to be concerned about loading the same module twice when two or more modules share dependencies. $ will only load a module once regardless of how many times that module is included in dependency lists.

Sources may be a string containing the url of the module or an object with the following structure.

``` js
	{
	    // Required - A string containing the url of the module
	    url : {string},
	     
	    // Optional - true to create an inline script. Only works for same origin scripts. - Default: false
	    inline : {bool},
	     
	    // Optional - true to include the async attribute of the <script> tag. - Default: false
	    async : {bool},
	     
	    // Optional - true to include the defer attribute of the <script> tag. - Default: false
	    defer : {bool},
	     
	    // Optional - A function to be executed as soon as this dependency module and its dependencies are loaded
	    callback : {function}
	}
```

The same rules apply to urls used in the depMods parameter as those used in the modUrl parameter. Reference urls consistently everywhere, always, without exception.

Setting the inline property to true causes $ to load the dependency module as an inline script rather than                            as an external resource. This has proven to speed up load times considerably under very unscientific circumstances and observation. However, this option only works for same origin modules and	imposes a dependendency on and lazy loads the $.ajax.js module which must reside in the same directory as the $.js module. If inline is true, the async and defer options are ignored.

The callback property is an optional parameterless function containing code to execute as soon as the dependency module and any dependencies required by it have loaded. It is placed on a stack so that in the event that multiple modules share the same dependency and each include a callback, each callback will execute in the order in which they are added to the stack of the dependency module.

#### callback

The callback parameter is a parameterless function containing code to execute after the dependencies defined in the depMods parameter have finished loading, usually the actual code of the module. All modules	referenced as dependencies in the depMods parameter as well as their dependencies and so on will be loaded and ready for use when this function executes. This function is pushed to the front of the dependent module's stack so that it will execute before any callbacks included in the depMods parameter of any previous calls to $.require by dependent modules.

## Examples

### Example 1: Require & Use $.css.js Module

``` js
	$.require('/0x24/js/intro.js', $.path + '$.css.js',
	function() {
	    $.css.style([
	           '/0x24/css/0x24.css',
	           '/0x24/css/menu.css'
	       ]);
	});
```

### Example 2: Configure & Load Google Web Fonts

``` js
	WebFontConfig = {
	    google: { families: [ 'Istok Web:400,700', 'Droid Sans Mono' ] }
	};
	 
	$.require('/0x24/js/intro.js', 'http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
```

### Example 3: Configure & Load SyntaxHighlighter

``` js
	$.require('/0x24/js/intro.js', $.path + '$.css.js',
	function() {
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
	            SyntaxHighlighter.autoloader.apply(null, [
	                'js jscript javascript  http://alexgorbatchev.com/pub/sh/current/scripts/shBrushJScript.js',
	                'xml xhtml xslt html    http://alexgorbatchev.com/pub/sh/current/scripts/shBrushXml.js'
	            ]);
	            SyntaxHighlighter.all();
	        });
	    });
	});
```