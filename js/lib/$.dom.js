(function() {
	
	$.dom = $['dom'] || {};
	
	$.dom.html2dom = $.dom['html2dom'] || function(html) {
		var i, div = document.createElement("div"),
			fragment = document.createDocumentFragment();
		div.innerHTML = html;
		for (i=0; i<div.childNodes.length; i++) {
			fragment.appendChild(div.childNodes[i].cloneNode(true));
		}
		return fragment;
	};

	$.dom.addEventListener = $.dom['addEventListener'] || function(element, event, handler, capture) {
		if (element.addEventListener) { element.addEventListener(event, handler, !!capture); }
		else if (element.attachEvent) { element.attachEvent("on" + event, handler); }
	};
	
	$.dom.removeEventListener = $.dom['removeEventListener'] || function(element, event, handler, capture) {
		if (element.removeEventListener) { element.removeEventListener(event, handler, capture); }
		else if (element.detachEvent) { element.detachEvent("on" + event, handler); }
	};
	
})();