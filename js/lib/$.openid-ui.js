$.require($.path + '$.openid-ui.js',
[
 	$.path + '$.events.js',
	$.path + '$.css.js',
	$.path + '$.ajax.js',
	$.path + '$.dom.js',
	$.path + '$.resize.js',
	$.path + '$.drag.js'
],
function() {
	var cssPath,
		openidProviders, openidUI, openidClose, openidForm, openidButtons,
		openidInput, openidLabel, openidProvider, openidUser, openidSubmit,
		frm, openid;
	
	function newOpenId() { return {userId:'',userUrl:'',signinUrl:'',signoutUrl: ''}; }
		
	function update(args) {
		if (!args) {
			if (openid && !openid.userId) {
					openid.userId = '1';
					args = openid;
			} else {
				args = newOpenId();
				args.signinUrl = 'signin.html';
				args.signoutUrl = 'signout.html';
			}
		}
		$.events.publish('openid-update-response', args);
//		$.ajax({
//			method : 'POST',
//			url : '/api/openid',
//			headers : [{'content-type' : 'application/json'}],
//			data : JSON.stringify(openid ? openid : newOpenId()),
//			callback : function(resp) {
//				var result;
//				try { result = JSON.parse(resp.xhr.responseText); }
//				catch (e) { result = newOpenId(); }
//				$.events.publish('openid-update-response', result);
//			}
//		});
	}
	
	function init() {
		if (!openidUI) {
			$.events.subscribe('openid-conf-response', initUI);
			$.events.publish('openid-conf-request');
			$.ajax({
				url : $.path + '$.openid-conf.js',
				callback : function(resp) {
					initUI(eval('(function(){' + resp.xhr.responseText + 'return config;})();'));
				}
			});
		} else {
			openidUI.style.display = openidForm.style.display = 'block';
		}
	}

	function initUI(config) {
		cssPath = config.cssPath;
		$.css.style(config.cssPath + 'openid.css?21');
		openidProviders = config.providers;
		openidUI = document.createElement('div');
		openidUI.id = 'openid-ui';
		openidUI.style.display = 'none';
		document.body.appendChild(openidUI);
		$.ajax({
			url : config.templatePath + 'openid.xml',
			callback : build
		});
	}
	
	function build(resp) {
		var btn, providerid, i = 0;
		openidUI.innerHTML = resp.xhr.responseText;
		openidClose = document.getElementById('openid-ui-close');
		openidForm = document.getElementById('openid-form');
		openidButtons = document.getElementById('openid-btns');
		openidInput = document.getElementById('openid-input');
		openidLabel = document.getElementById('openid-label');
		openidProvider = document.getElementById('openid-provider');
		openidUser = document.getElementById('openid-user');
		openidSubmit = document.getElementById('openid-submit');
		if (openidProviders.large) {
			for (providerid in openidProviders.large) {
				btn = getOpenIdButton(i++, 'large', providerid);
				openidButtons.appendChild(btn);
			}
		}
		if (openidProviders.large && openidProviders.small) { 
			openidButtons.appendChild(document.createElement('br'));
		}
		if (openidProviders.small) {
			for (providerid in openidProviders.small) {
				btn = getOpenIdButton(i++, 'small', providerid);
				openidButtons.appendChild(btn);
			}
		}
		$.dom.addEventListener(openidClose, "click", close);
		$.dom.addEventListener(openidSubmit, "click", getUrls);
		openidUI.style.display = openidForm.style.display = 'block';
		$.drag({element : openidUI});
		$.resize({element : openidUI});
	}
	
	function getOpenIdButton(index, size, providerid) {
		var x = (size == 'small' ? -index * 24 : -index * 100) - 2,
			y = (size == 'small' ? -60 : 0) - 2,
			btn = document.createElement('button');
		btn.id = size + '-' + providerid;
		btn.title = 'Sign-In with ' + openidProviders[size][providerid]['name'];
		btn.className = 'openid-btn openid-' + size + '-btn';
		btn.style.backgroundPosition =  x + 'px ' + y + 'px';
		$.dom.addEventListener(btn, 'click', function () { selectProvider(size, providerid); });
		return btn;
	}
	
	function selectProvider(size, providerid) {
		highlight(size + '-' + providerid);
		openidProvider.value = openidProviders[size][providerid]['url'] || '';
		openidUser.value = '';
		if (openidProviders[size][providerid]['label']) {
			openidLabel.innerHTML = openidProviders[size][providerid]['label'];
			openidInput.style.display = 'block';
		} else {
			openidInput.style.display = 'none';
			getUrls();
		}
	}		
	
	function highlight(providerid) {
		var highlight = document.getElementById('openid-highlight'),
			btn;
		if (highlight) {
			btn = highlight.getElementsByTagName('button')[0];
			highlight.parentNode.replaceChild(btn, highlight);
		}
		btn = document.getElementById(providerid);
		highlight = document.createElement('div');
		highlight.id = 'openid-highlight';
		btn.parentNode.replaceChild(highlight, btn);
		highlight.appendChild(btn);
	}
	
	function getUrls() {
		var provider = openidProvider.value,
			user = openidUser.value,
			url = provider ? provider.replace('{userid}', user) : user;
		openid.userUrl = url;
		$.events.subscribe('openid-update-response', signin);
		update(openid);
	}
	
	function signin() {
		$.events.unsubscribe('openid-update-response', signin);
		if (!openid.userId.length) {
			frm = document.createElement('iframe');
			frm.id = 'openid-frame';
			frm.width = "100%";
			frm.height = "150px";
			frm.scrolling = 'no';
			frm.frameBorder = 'yes';
			frm.src = openid.signinUrl;
			openidForm.style.display = 'none';
			openidUI.appendChild(frm);
			$.events.subscribe('openid-update-response', close);
		} else { close(); }
	}
	
	function close(resp) {
		if (frm) {
			$.events.unsubscribe('openid-update-response', close);
			openidUI.removeChild(frm);
			frm = null;
		}
		openidUI.style.display = 'none';
	}
	
	function signout(openid) {
		openid = void 0;
		update();
//		$.ajax({
//			url: openid.signoutUrl,
//			callback: update
//		});
	}
	
	function setOpenId(value) {
		openid = value;
	}


	$.events.subscribe('openid-update-request', update);
	$.events.subscribe('openid-update-response', setOpenId);
	$.events.subscribe('openid-signin-request', init);
	$.events.subscribe('openid-signout-request', signout);
	
		
});