$.require($.path+"$.ajax.js","http://goo.gl/kUvZi",function(){var a={headers:[],method:"GET",url:"",username:null,password:null,timeout:0,async:!0,data:null,callback:function(){}};$.ajax=$.ajax||function(b){$.defaults(b,a);if(!b.xhr){try{b.xhr=new XMLHttpRequest}catch(c){var d=["MSXML2.XMLHTTP.5.0","MSXML2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"];while(d.length){try{b.xhr=new ActiveXObject(d.shift())}catch(e){continue}break}}if(!b.xhr)throw new Error("No known XmlHttpRequest implementation supported.")}b.xhr.open(b.method,b.url,b.async,b.username,b.password),b.xhr.onreadystatechange=function(){b.xhr.readyState===4&&(clearTimeout(b.timerid),delete b.timerid,b.callback(b))},b.headers.length&&$.each(b.headers,function(a){$.each(a,function(a,c){b.xhr.setRequestHeader(c,a)})}),b.timeout&&b.timeout>0&&(b.timerid=setTimeout(function(){delete b.timerid,b.xhr.abort(),b.callback(b)},b.timeout)),b.xhr.send(b.data)}})