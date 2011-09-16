(function() {
	
	var $ = top.$;
	
	$.require($.path + '$.openid.js', [$.path + '$.ajax.js', $.path + '$.events.js'],
	function() {
		
		function newOpenId() { return {userId:'',userUrl:'',signinUrl:'',signoutUrl: ''}; }
		
		function update(openid) {	
			$.ajax({
				method : 'POST',
				url : '/api/openid',
				headers : [{'content-type' : 'application/json'}],
				data : JSON.stringify(openid ? openid : newOpenId()),
				callback : function(resp) {
					var result;
					try { result = JSON.parse(resp.xhr.responseText); }
					catch (e) { result = newOpenId(); }
					$.events.publish('openid-update-response', result);
				}
			});
		}

		$ = top.$;
		$.events.subscribe('openid-update-request', update);
		if (self !== top) update();
	
	});
	
})();