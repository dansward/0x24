$.require($.path + '$.drag.js', $.path + '$.underscore.js',
function() {
		
	var defaults = {
			element : null,
			handle : null,
			minX : null,
			minY : null,
			maxX : null,
			maxY : null
		};

	$.drag = $['drag'] || function(conf) {
		var i, o = $.defaults(conf, defaults);
		if (!o.handle) o.handle = o.element;
		o.handle.onmousedown = function(e) { start(fixE(e), o); };
		o.minX = o.minX || 0;
		o.minY = o.minY || 0;
		o.maxX = o.maxX || null;
		o.maxY = o.maxY || null;
	};

	function start(e, o) {
		var x, y;
		if (e.which === 1) {
			document.body.onmousemove = function(e) { drag(fixE(e), o); };
			document.body.onmouseup = function(e) { end(o); };
			disableSelection();
			y = parseInt($.css.getStyle(o.element, 'top'));
			x = parseInt($.css.getStyle(o.element, 'left'));
			o.lastX = e.clientX;
			o.lastY = e.clientY;
		}
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	}

	function drag(e, o) {
		var ex = e.clientX,
			ey = e.clientY,
			dx = ex - o.lastX,
			dy = ey - o.lastY,
			t = parseInt($.css.getStyle(o.element, 'top')),
			l = parseInt($.css.getStyle(o.element, 'left')),
			w = parseInt($.css.getStyle(o.element, 'width')),
			h = parseInt($.css.getStyle(o.element, 'height')),
			et = Math.max(t + dy, o.minY),
			el = Math.max(l + dx, o.minX),
			er = $.isNumber(o.maxX) ? Math.min(l + w + dx, o.maxX) : l + w + dx,
			eb = $.isNumber(o.maxY) ? Math.min(t + h + dy, o.maxY) : t + h + dy,
			dt = et - t,
			dl = el - l,
			dr = er - (l + w),
			db = eb - (t + h);
		dy = Math.min(Math.abs(dt), Math.abs(db)) * (dy >= 0 ? 1 : -1);
		dx = Math.min(Math.abs(dl), Math.abs(dr)) * (dx >= 0 ? 1 : -1);
		if (ey >= t + dy && ey <= t + h + dy && ex >= l + dy && ex <= l + w + dx) {
			o.element.style.top = t + dy + 'px';
			o.element.style.left = l + dx + 'px';
			o.element.style.width = w + 'px';
			o.element.style.height = h + 'px';
			o.lastX = ex;
			o.lastY = ey;
		}
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	}

	function end(o) {
		enableSelection();
		document.body.onmousemove = null;
		document.body.onmouseup = null;
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
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