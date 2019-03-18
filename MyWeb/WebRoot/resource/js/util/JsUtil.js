function JsUtil()
{
}

JsUtil.prototype.getWebRoot = function() {
	web = window.location.pathname;
	if( web.indexOf("/") != 0 ) 
		web = "/"+web;
	web = web.substring(0, web.indexOf("/", 1)+1);	
	return web;
};

JsUtil.prototype.addScript=function(jsfile)
{
	$.ajax({
		url: jsUtil.getWebRoot() + "DYN_JS.htm",
		type: 'POST',
	    data: {js: jsfile},
	    async: false,
	    contenttype : "application/x-www-form-urlencoded; charset=utf-8",
	    success: function(response) {		    	
	    	var JsonData = typeof(response)=="object" ? response : $.parseJSON(response);
	    	window.eval(JsonData.data, "JavaScript");
	    }
	});
}

var jsUtil = new JsUtil();