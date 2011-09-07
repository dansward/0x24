(function() {
	var $ = top.$;
	
	$.require($.path + '$.openid-ui.js',
	[
	 	$.path + '$.app.js',
		$.path + '$.css.js',
		$.path + '$.ajax.js',
		$.path + '$.dom.js',
		$.path + '$.template.js',
		$.path + '$.openid-conf.js'
	],
	function() {
		var $ = top.$,
			openidProviders = openidUI = openidForm = openidButtons = openidInput =
			openidLabel = openidProvider = openidUser = openidSubmit = frm = null,
			openid = {
				userId: '',
				userUrl: '',
				signinUrl: '',
				signoutUrl: ''
			};
		
		function setOpenId(value) { openid = value; }
		
		function init() {
			post(function(openid) {
				if (openid.userId === '') {
					$.app.subscribe('openid-conf-response', display);
					$.app.publish('openid-conf-request');
				}
				else { $.app.publish('openid-signin-response', openid); }
			});
		}
		
		function openidConf(providers) {
			$.app.unsubscribe('openid-conf-response', openidConf);
			openidProviders = providers;
		}
		
		function post(callback) {
			$.ajax.postJSON({
				url: '/api/openid',
				data: openid,
				callback: function(response) {
					var openid;
					try { openid = JSON.parse(response.xhr.responseText); }
					catch (e) {
						openid = {
							userId: '',
							userUrl: '',
							signinUrl: '',
							signoutUrl: ''
						};
					}
					if ($.isFunction(callback)) { callback(openid); }
				}
			});
		}
		
		function display(providers) {
			if (!openidUI) {
				$.app.unsubscribe('openid-conf-response', display);
				$.css.require('/css/openid.css');
				openidProviders = providers;
				openidUI = document.createElement('div');
				openidUI.id = 'openid-ui';
				openidUI.style.display = 'none';
				document.body.appendChild(openidUI);
				$.template.parse({
					src : '/templates/openid.xml',
					callback : build
				});
			} else { openidUI.style.display = openidForm.style.display = 'block'; }
		}
		
		function build(ui) {
			var btn = null, providerid = '', i = 0;
			openidUI.innerHTML = ui;
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
			$.dom.addEventListener({
				element: openidSubmit,
				event: "click",
				handler: submit
			});
			openidUI.style.display = 'block';
		}
		
		function getOpenIdButton(index, size, providerid) {
			var x = (size == 'small' ? -index * 24 : -index * 100) - 2,
				y = (size == 'small' ? -60 : 0) - 2,
				btn = document.createElement('button');
			btn.id = size + '-' + providerid;
			btn.title = 'Sign-In with ' + openidProviders[size][providerid]['name'];
			btn.className = 'openid-btn openid-' + size + '-btn';
			btn.style.backgroundPosition =  x + 'px ' + y + 'px';
			$.dom.addEventListener(btn, 'click', function () { signin(size, providerid); });
			return btn;
		}
		
		function signin(size, providerid) {
			highlight(size + '-' + providerid);
			openidProvider.value = openidProviders[size][providerid]['url'] || '';
			openidUser.value = '';
			if (openidProviders[size][providerid]['label']) {
				openidLabel.innerHTML = openidProviders[size][providerid]['label'];
				openidInput.style.display = 'block';
			} else {
				openidInput.style.display = 'none';
				submit();
			}
		}
		
		function signout() {
			$.ajax.get({
				url: openid.signoutUrl,
				callback: function() {
					openid = {
						userId: '',
						userUrl: '',
						signinUrl: '',
						signoutUrl: ''
					};
					$.app.publish('openid-signout-response', openid);
				}
			});
		}
		
		function submit() {
			var provider = openidProvider.value,
				user = openidUser.value,
				url = provider ? provider.replace('{userid}', user) : user;
			openid.userUrl = url;
			post(function(openid) {
				$.app.subscribe('openid-signin-response', function() { openidUI.removeChild(frm); });
				frm = document.createElement('iframe');
				frm.id = 'openid-frame';
				frm.scrolling = 'no';
				frm.frameBorder = 'yes';
				frm.onload = resizeIFrame;
				frm.src = openid.signinUrl;
				openidForm.style.display = 'none';
				openidUI.appendChild(frm);
			});
		}
		
		function resizeIFrame() {
			var body = frm.contentWindow.document.body;
			frm.height = body.scrollHeight; //body.scrollHeight + (body.offsetHeight - body.clientHeight);
			frm.width = body.scrollWidth; //body.scrollWidth + (body.offsetWidth - body.clientWidth);
		}		
		
		function highlight(providerid) {
			var highlight = document.getElementById('openid-highlight'),
				btn;
			// remove previous highlight.
			if (highlight) {
				btn = highlight.getElementsByTagName('button')[0];
				highlight.parentNode.replaceChild(btn, highlight);
			}
			// add new highlight.
			btn = document.getElementById(providerid);
			highlight = document.createElement('div');
			highlight.id = 'openid-highlight';
			btn.parentNode.replaceChild(highlight, btn);
			highlight.appendChild(btn);
		}
	
		$.app.subscribe('openid-signin-request', init);
		$.app.subscribe('openid-signout-request', signout);
		$.app.subscribe('openid-signin-response', setOpenId);
		$.app.subscribe('openid-signout-response', setOpenId);
		
			
	});
	
})();