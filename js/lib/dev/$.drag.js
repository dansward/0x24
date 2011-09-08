/*
	Based on Aaron Boodman's dom-drag.js
	http://www.youngpup.net/projects/dom-drag/
*/
(function() {
	var $ = top.$;
	
	$.require($.path + '$.drag.js', $.path + '$.underscore.js',
	function() {
		
		var $ = top.$,
			defaults = {
				element : null,
				handle : null,
				minX : null,
				minY : null,
				maxX : null,
				maxY : null,
				hmode : true,
				vmode : true,
				xMapper : null,
				yMapper : null,
				onDragStart : function(x, y) {},
				onDrag : function(x, y) {},
				onDragEnd : function(x, y) {}
			};
	
		$.drag = function(conf) {
			var o = $.defaults(conf, defaults);
			if (!o.handle) {
				o.handle = document.createElement('div');
				o.handle.style.cssText = 'position:absolute;top:0px;right:0px;bottom:0px;left:0px;background-color:transparent;';
				o.element.appendChild(o.handle);
			}
			o.handle.onmousedown = function(e) { start(fixE(e), o); };
			if (o.hmode && isNaN(parseInt(o.element.style.left))) { o.element.style.left = "0px"; }
			if (o.vmode && isNaN(parseInt(o.element.style.top))) { o.element.style.top = "0px"; }
			if (!o.hmode && isNaN(parseInt(o.element.style.right))) { o.element.style.right = "0px"; }
			if (!o.vmode && isNaN(parseInt(o.element.style.bottom))) { o.element.style.bottom = "0px"; }
		};
	
		function start(e, o) {
			var x, y;
			if (e.which === 1) {
				document.body.onmousemove = function(e) { drag(fixE(e), o); };
				document.body.onmouseup = function(e) { end(fixE(e), o); };
				disableSelection();
				y = parseInt(o.vmode ? o.element.style.top : o.element.style.bottom);
				x = parseInt(o.hmode ? o.element.style.left : o.element.style.right);
				o.onDragStart(x, y);
				o.lastMouseX = e.clientX;
				o.lastMouseY = e.clientY;
				if (o.hmode) {
					if (o.minX !== null) { o.minMouseX = e.clientX - x + o.minX; }
					if (o.maxX !== null) { o.maxMouseX = o.minMouseX + o.maxX - o.minX; }
				} else {
					if (o.minX !== null) { o.maxMouseX = -o.minX + e.clientX + x; }
					if (o.maxX !== null) { o.minMouseX = -o.maxX + e.clientX + x; }
				}
				if (o.vmode) {
					if (o.minY !== null) { o.minMouseY = e.clientY - y + o.minY; }
					if (o.maxY !== null) { o.maxMouseY = o.minMouseY + o.maxY - o.minY; }
				} else {
					if (o.minY !== null) { o.maxMouseY = -o.minY + e.clientY + y; }
					if (o.maxY !== null) { o.minMouseY = -o.maxY + e.clientY + y; }
				}
			}
			return false;
		}
	
		function drag(e, o) {
			var ey = e.clientY,
				ex = e.clientX,
				y = parseInt(o.vmode ? o.element.style.top : o.element.style.bottom),
				x = parseInt(o.hmode ? o.element.style.left : o.element.style.right),
				nx, ny;
			if (o.minX !== null) { ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX); }
			if (o.maxX !== null) { ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX); }
			if (o.minY !== null) { ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY); }
			if (o.maxY !== null) { ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY); }
			nx = x + (ex - o.lastMouseX) * (o.hmode ? 1 : -1);
			ny = y + (ey - o.lastMouseY) * (o.vmode ? 1 : -1);
			if (o.xMapper) { nx = o.xMapper(y); }
			if (o.yMapper) { ny = o.yMapper(x); }
			o.element.style[o.hmode ? "left" : "right"] = nx + "px";
			o.element.style[o.vmode ? "top" : "bottom"] = ny + "px";
			o.lastMouseX = ex;
			o.lastMouseY = ey;
			o.onDrag(nx, ny);
			return false;
		}
	
		function end(e, o) {
			enableSelection();
			document.body.onmousemove = null;
			document.body.onmouseup = null;
			o.onDragEnd(
				parseInt(o.element.style[o.hmode ? "left" : "right"]),
				parseInt(o.element.style[o.vmode ? "top" : "bottom"])
			);
		}
		
		function fixE(e) {
			e = e || window.event;
		    e.target = e.target ? e.target : e.srcElement;
		    e.which = e.which ? e.which :
			            e.button === 1 ? 1 :
			            e.button === 2 ? 3 : 
			            e.button === 4 ? 2 : 1;
		    return e;
		}
		
		function disableSelection() {
			document.onselectstart = function() { return false; };
			document.body.unselectable = 'on';
			document.body.style.MozUserSelect = 'none';
			document.body.style.webkitUserSelect = 'none';
		}
		
		function enableSelection() {
			document.onselectstart = void 0;
			document.body.unselectable = 'off';
			document.body.style.MozUserSelect = 'text';
			document.body.style.webkitUserSelect = 'text';
		}
	
	});
	
})();