(function() {
	var $ = top.$;
	
	$.require($.path + '$.openid.js', [$.path + '$.ajax.js', $.path + '$.app.js'],
	function() {
		
		var $ = top.$,
			openid = {
				userId: '',
				userUrl: '',
				signinUrl: '',
				signoutUrl: ''
			};
			
		$.ajax.postJSON({
			url : '/api/openid',
			data : openid,
			callback : function(response) {
				try { openid = JSON.parse(response.xhr.responseText); } catch (e) {}
				$.app.publish('openid-signin-response', openid);
			}
		});
	
	});
	
})();