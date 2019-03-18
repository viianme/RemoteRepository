/**
 * @description
 * @class Dialog
 * @author wengchi
 * @constructor
 */
function DialogUtil() { 
	
}

DialogUtil.prototype.index = -1;
DialogUtil.prototype.returnValue = {};
DialogUtil.prototype.DefaultValue = [];

DialogUtil.prototype.getWebRoot = function() {
	web = window.location.pathname;
	if( web.indexOf("/") != 0 ) web = "/"+web;
	web = web.substring(0, web.indexOf("/", 1)+1);	
	return web;
};

DialogUtil.prototype.getOpenDialogOption = function() { 
	var dialogoptions = {
		dataObj : null,   						
		url : '',		//網址
		width : 700,						
		height : 600,
		title :'Dialog',
		before:null,
		callback: null,
		html: null,
		closeBtn: true,
		helpUtil: null,
		viewfile: 'N'
	};
	return dialogoptions;
};

/**
 * 字串清掉空白
 * @param a 
*/
DialogUtil.prototype.trim =function trim(a){  
    return a.replace(/(^\s*)|(\s*$)/g, "");  
};

DialogUtil.prototype.openDialog = function(jsonParam){
	var tempOption =  $.extend({}, dialogUtil.getOpenDialogOption(), jsonParam);
	if( tempOption.url!="" && tempOption.url.indexOf("/")!=0 && tempOption.url.indexOf("http")==-1 ) {
		tempOption.url = dialogUtil.getWebRoot() + tempOption.url;
	}
	
	if( dialogUtil.index>-1 ) {			
		dialogUtil.maskAll("IDX_"+(dialogUtil.index));		
	} 
	
	var id = "IDX_" + (++dialogUtil.index);
	if( $("div[aria-describedby=IDX_"+(dialogUtil.index)+"]").length>0 )
		$("div[aria-describedby=IDX_"+(dialogUtil.index)+"]").remove();
	if( $("div[id=IDX_"+(dialogUtil.index)+"]").length>0 )
		$("div[id=IDX_"+(dialogUtil.index)+"]").remove();
	dialogUtil.setDefaultReturnValue({})	
	
	var $div;
	if( tempOption.html!=null ) {
		$div = $("<div id='"+id+"' style='margin:0;padding:0;'>" +
				(typeof(tempOption.html)=="string" ? tempOption.html : tempOption.html.html()) +
				"</div>")
				.appendTo("body");
		if( tempOption.helpUtil!=null ) {
			tempOption.helpUtil.closeInfoBar();
			tempOption.helpUtil.closeProcessBar();
			tempOption.helpUtil.divobj.appendTo($div);
		}
	}else{
		$div = $("<div id='"+id+"' style='margin:0;padding:0;overflow: hidden'>" +
				"<iframe border='1' name='"+id+"' width='100%' height='99%' frameborder='0' "+ (tempOption.viewfile=="N" ? "scrolling='no'" : "") +"></iframe>" +
				"</div>")
				.appendTo("body");
	}
	
	if( typeof(tempOption.before)=="function" ) {
		tempOption.before($div);
	}	
	
	if( tempOption.height > $("body")[0].offsetHeight )
		tempOption.height = $("body")[0].offsetHeight - 24;
	if( tempOption.width > $("body")[0].offsetWidth )
		tempOption.width = $("body")[0].offsetWidth - 24;
	
	$div.dialog({
		open: function(event, ui) {
			if(!tempOption.closeBtn)
				$(".ui-dialog-titlebar-close", ui.dialog | ui).last().hide();
	    },
		title: tempOption.title,
		width: tempOption.width,
		height: tempOption.height,
		modal: true,
		close: function(){			
			if( typeof(tempOption.callback)=="function" ) {
				if( !Array.isArray(dialogUtil.returnValue) )
					dialogUtil.returnValue =  $.extend({}, dialogUtil.DefaultValue[dialogUtil.index], dialogUtil.returnValue);
				dialogUtil.index--;
				if( JSON.stringify(dialogUtil.returnValue)!="{}" ) {
					tempOption.callback(dialogUtil.returnValue);
				}
			}else{
				dialogUtil.index--;
			}
			dialogUtil.returnValue = {};

			if( dialogUtil.index>-1 ) {		
				dialogUtil.unmaskAll("IDX_"+(dialogUtil.index));	
			}
			if( tempOption.helpUtil!=null ) {
				tempOption.helpUtil.genMsgHtml();
			}
		}
	});

	if( tempOption.html==null ) {
		dialogUtil.post(tempOption.url, id , tempOption.dataObj);
	}
	
	$div.scrollTop(0); 
};

DialogUtil.prototype.maskAll = function(id){
	$div = $("div[aria-describedby="+id+"]");	
	$("*", $div).attr("disabled", "disabled");
	try{frames[id].maskAll();}catch(err) {}
}

DialogUtil.prototype.unmaskAll = function(id){
	$div = $("div[aria-describedby="+id+"]");
	$("*", $div).removeAttr("disabled");
	try{frames[id].unmaskAll();}catch(err) {}
}

DialogUtil.prototype.closeDialog = function(){
	if( dialogUtil.index==-1 ) {
		window.opener=null;   
		window.open("","_self");   
		window.close(); 
		top.close;
	}else{
		id = "IDX_" + dialogUtil.index;	
		$("div[id="+id+"]").dialog("close");
	}
};

DialogUtil.prototype.setDefaultReturnValue = function(param){
	dialogUtil.DefaultValue[dialogUtil.index] = param;
};

DialogUtil.prototype.setReturnValue = function(param){
	dialogUtil.returnValue = param;
};

DialogUtil.prototype.post = function(path, target, params) {
    var method = "post"; // Set method to post by default if not specified.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("target", target);
    if (typeof(params)=="object"){
    	for(var key in params) {
	        if(params.hasOwnProperty(key)) {
	            var hiddenField = document.createElement("input");
	            hiddenField.setAttribute("type", "hidden");
	            hiddenField.setAttribute("name", key);
	            hiddenField.setAttribute("value", params[key]);
	            form.appendChild(hiddenField);
	         }
	    }
    }else if (typeof(params)=="string"){
    	var list = params.split("&");
    	for(var i=0;i<list.length;i++){
    		var akeyValue = list[i];
    		var keyValue = akeyValue.split("=");
    		if (keyValue.length==2){
    			var hiddenField = document.createElement("input");
 	            hiddenField.setAttribute("type", "hidden");
 	            hiddenField.setAttribute("name", keyValue[0]);
 	            hiddenField.setAttribute("value", keyValue[1]);
 	            form.appendChild(hiddenField);
    		}
    	}    	
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    form = null;
};

var dialogUtil = new DialogUtil();
