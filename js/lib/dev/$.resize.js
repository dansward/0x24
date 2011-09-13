$.require($.path + '$.resize.js', [$.path + '$.css.js', $.path + '$.underscore.js'],
function() {
	
	var defaults = {
			element : null,
			minWidth : 10,
			minHeight : 10,
			maxWidth : null,
			maxHeight : null,
			minX : null,
			minY : null,
			maxX : null,
			maxY : null
		},
		nwrx = /\$-resize-nw/, nrx = /\$-resize-n/, nerx = /\$-resize-ne/, erx = /\$-resize-e/,
		serx = /\$-resize-se/, srx = /\$-resize-s/, swrx = /\$-resize-sw/, wrx = /\$-resize-w/;
	
	$.resize = $['resize'] || function(conf) {
		var o = $.defaults(conf, defaults),
			nodes = o.element.getElementsByTagName('div'),
			node, i, c = 0;
		
		o.minWidth = o.minWidth >= 14 ? o.minWidth : 14;
		o.minHeight = o.minHeight >= 14 ? o.minHeight : 14;
		o.maxWidth = o.maxWidth >= o.minWidth ? o.maxWidth : null;
		o.maxHeight = o.maxHeight >= o.minHeight ? o.maxHeight : null;
		
		for (i=nodes.length; i--;) {
			switch (true) {
			case nwrx.test(nodes[i].className): o.nw = nodes[i]; c++; break;
			case nerx.test(nodes[i].className): o.ne = nodes[i]; c++; break;
			case nrx.test(nodes[i].className): o.n = nodes[i]; c++; break;
			case swrx.test(nodes[i].className): o.sw = nodes[i]; c++; break;
			case serx.test(nodes[i].className): o.se = nodes[i]; c++; break;
			case srx.test(nodes[i].className): o.s = nodes[i]; c++; break;
			case wrx.test(nodes[i].className): o.w = nodes[i]; c++; break;
			case erx.test(nodes[i].className): o.e = nodes[i]; c++; break;
			case c < 8: continue;
			default: break;
			}
			break;
		}
		
		if (c !== 8) {
			o.nw = document.createElement('div');
			o.nw.className = '$-resize-nw';
			o.element.appendChild(o.nw);
			o.n = document.createElement('div');
			o.n.className = '$-resize-n';
			o.element.appendChild(o.n);
			o.ne = document.createElement('div');
			o.ne.className = '$-resize-ne';
			o.element.appendChild(o.ne);
			o.e = document.createElement('div');
			o.e.className = '$-resize-e';
			o.element.appendChild(o.e);
			o.se = document.createElement('div');
			o.se.className = '$-resize-se';
			o.element.appendChild(o.se);
			o.s = document.createElement('div');
			o.s.className = '$-resize-s';
			o.element.appendChild(o.s);
			o.sw = document.createElement('div');
			o.sw.className = '$-resize-sw';
			o.element.appendChild(o.sw);
			o.w = document.createElement('div');
			o.w.className = '$-resize-w';
			o.element.appendChild(o.w);
		}
		
		o.nw.style.cssText = 'position:absolute;top:0px;left:0px;width:7px;height:7px;cursor:nw-resize;background-color:transparent;z-index:1000;';
		o.n.style.cssText = 'position:absolute;top:0px;right:7px;left:7px;height:7px;cursor:n-resize;background-color:transparent;z-index:1000;';
		o.ne.style.cssText = 'position:absolute;top:0px;right:0px;width:7px;height:7px;cursor:ne-resize;background-color:transparent;z-index:1000;';
		o.e.style.cssText = 'position:absolute;top:7px;right:0px;bottom:7px;width:7px;cursor:e-resize;background-color:transparent;z-index:1000;';
		o.se.style.cssText = 'position:absolute;right:0px;bottom:0px;width:7px;height:7px;cursor:se-resize;background-color:transparent;z-index:1000;';
		o.s.style.cssText = 'position:absolute;right:7px;bottom:0px;left:7px;height:7px;cursor:s-resize;background-color:transparent;z-index:1000;';
		o.sw.style.cssText = 'position:absolute;bottom:0px;left:0px;width:7px;height:7px;cursor:sw-resize;background-color:transparent;z-index:1000;';
		o.w.style.cssText = 'position:absolute;top:7px;bottom:7px;left:0px;width:7px;cursor:w-resize;background-color:transparent;z-index:1000;';
		
		o.nw.onmousedown = function(e) { start(o, o.nw, fixE(e)); };
		o.n.onmousedown = function(e) { start(o, o.n, fixE(e)); };
		o.ne.onmousedown = function(e) { start(o, o.ne, fixE(e)); };
		o.e.onmousedown = function(e) { start(o, o.e, fixE(e)); };
		o.se.onmousedown = function(e) { start(o, o.se, fixE(e)); };
		o.s.onmousedown = function(e) { start(o, o.s, fixE(e)); };
		o.sw.onmousedown = function(e) { start(o, o.sw, fixE(e)); };
		o.w.onmousedown = function(e) { start(o, o.w, fixE(e)); };
	};
	
	function start(o, g, e) {
		if (e.which === 1) {
			document.body.onmouseup = function(e) { end(o, g, fixE(e)); };
			document.body.onmousemove = function(e) { drag(o, g, fixE(e)); };
			document.body.style.cursor = g.style.cursor;
			disableSelection();
			o.lastX = e.clientX;
			o.lastY = e.clientY;
		}
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	}
	
	function drag(o, g, e) {
		var rect = o.element.getBoundingClientRect(),
			ex = e.clientX,
			ey = e.clientY,
			dx = ex - o.lastX,
			dy = ey - o.lastY,
			w = parseInt($.css.getStyle(o.element, 'width')),
			h = parseInt($.css.getStyle(o.element, 'height')),
			t = parseInt($.css.getStyle(o.element, 'top')),
			l = parseInt($.css.getStyle(o.element, 'left')),
			ew, eh, et, el, eb, er;
		if (nrx.test(g.className)) {
			eh = Math.max(Math.min(h - dy, o.maxHeight || (h - dy)), o.minHeight);
			et = $.isNumber(o.minY) ? Math.max(t + dy, o.minY) : t + dy;
			dy = Math.min(Math.abs(eh - h), Math.abs(et - t)) * (dy >= 0 ? 1 : -1);
			if (dy  >= 0 && ey >= rect.top || dy <= 0 && ey <= rect.top) {
				o.element.style.height = h - dy + 'px';
				o.element.style.top = t + dy + 'px';
			}
		}
		if (srx.test(g.className)) {
			eh = Math.max(Math.min(h - dy, o.maxHeight || (h - dy)), o.minHeight);
			eb = $.isNumber(o.maxY) ? Math.min(t + h + dy, o.maxY) : t + h + dy;
			dy = Math.min(Math.abs(eh - h), Math.abs(eb - (t + h))) * (dy >= 0 ? 1 : -1);
			if (dy >= 0 && ey >= rect.bottom || dy <= 0 && ey <= rect.bottom) {
				o.element.style.height = h + dy + 'px';
			}
		}
		if (wrx.test(g.className) || nwrx.test(g.className) || swrx.test(g.className)) {
			ew = Math.max(Math.min(w - dx, o.maxWidth || (w - dx)), o.minWidth);
			el = $.isNumber(o.minX) ? Math.max(l + dx, o.minX) : l + dx;
			dx = Math.min(Math.abs(ew - w), Math.abs(el - l)) * (dx >= 0 ? 1 : -1);
			if (dx >= 0 && ex >= rect.left || dx <= 0 && ex <= rect.left) {
				o.element.style.width = w - dx + 'px';
				o.element.style.left = l + dx + 'px';
			}
		}
		if (erx.test(g.className) || nerx.test(g.className) || serx.test(g.className)) {
			ew = Math.max(Math.min(w - dx, o.maxWidth || (w - dx)), o.minWidth);
			er = $.isNumber(o.maxX) ? Math.min(l + w + dx, o.maxX) : l + w + dx;
			dx = Math.min(Math.abs(ew - w), Math.abs(er - (l + w))) * (dx >= 0 ? 1 : -1);
			if (dx >= 0 && ex >= rect.right || dx <= 0 && ex <= rect.right) {
				o.element.style.width = w + dx + 'px';
			}
		}
		o.lastX = ex;
		o.lastY = ey;
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	}
	
	function end(o, g, e) {
		document.body.onmousemove = null;
		document.body.onmouseup = null;
		enableSelection();
		document.body.style.cursor = 'default';
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