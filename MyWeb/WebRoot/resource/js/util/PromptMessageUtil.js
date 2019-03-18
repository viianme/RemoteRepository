PromptMessageUtil.prototype.options = {};

/**
 * @description 表單參數物件
 * */
PromptMessageUtil.prototype.getPromptMsgOption = function() { 
	var Options = {
		  printMax : 9		  
		, MessageID : 'MESSAGE_TAG'
		, MSG_LIST : []
		, TIME_OUT : null
		, IFRAME_ID: null
		, REMOVE_TIME : 0.5
		, LOCAL_STORAGE: "LOCAL_PROMPT_MSG_LIST"
		, SAVE_LOCAL: true
		, crtid : ""
		, sys : ""
		, id : ""
		, dptcd : ""
		, usrid : ""
	};	
	if(Options.SAVE_LOCAL) {
		var json = window.localStorage[Options.LOCAL_STORAGE];
		if(json != "undefined"&&json!=null) {
			var object = $.parseJSON(json);
			Options.MSG_LIST = object;
		}			
		$(window).unload(function(){
			var json = JSON.stringify(promptMessageUtil.options.MSG_LIST);
			window.localStorage[promptMessageUtil.options.LOCAL_STORAGE] = json;
		});
	}
	return Options;
};
PromptMessageUtil.prototype.getMessageOption = function() { 
	var Options = {
		  MSG_LIST : []
		, CRTID : ""
		, SYS : ""
		, ID : ""
		, DPTCD : ""
		, USRID : ""
	};	
};

function PromptMessageUtil(){
	
	PromptMessageUtil.prototype.start = function (Object){
		promptMessageUtil.options = $.extend({}, promptMessageUtil.getPromptMsgOption(), Object);
		setAllMsg();
		$.ajax({
		      url: 'DASHBOARD/GetDashboardLoginMessage.htm',
		      data: {
		    	  crtid: promptMessageUtil.options.crtid,
		    	  sys: promptMessageUtil.options.sys,
		    	  id: promptMessageUtil.options.id,
		    	  dptcd: promptMessageUtil.options.dptcd,
		    	  usrid: promptMessageUtil.options.usrid
		      	},
		      type: 'GET' 
		    });			
	}
	
	PromptMessageUtil.prototype.appendMessage = function(message){
		var object = typeof(message)=="string" ? $.parseJSON(message) : message;
		object = $.extend({}, promptMessageUtil.getMessageOption(), object);		
		if( (object.CRTID=="" || object.CRTID==promptMessageUtil.options.crtid) && 
			(object.SYS=="" || object.SYS==promptMessageUtil.options.sys) && 
			(object.ID=="" || object.ID==promptMessageUtil.options.id) && 
			(object.DPTCD=="" || promptMessageUtil.options.dptcd.indexOf(object.DPTCD)>-1) && 
			(object.USRID=="" || object.USRID==promptMessageUtil.options.usrid)	
				) {			
			promptMessageUtil.options.MSG_LIST =  promptMessageUtil.options.MSG_LIST.concat(object.MSG_LIST);
			for(var i=0;i<promptMessageUtil.options.MSG_LIST.length;i++){
				if( typeof(promptMessageUtil.options.MSG_LIST[i].USRID)=="undefined" )
					promptMessageUtil.options.MSG_LIST[i].USRID=promptMessageUtil.options.usrid;
			}
			setAllMsg();
		}
	}

	PromptMessageUtil.prototype.setMsg = function (){
		var ID = promptMessageUtil.options.MessageID;
		var LIST = promptMessageUtil.options.MSG_LIST;
		checkRepeat(LIST);
		if( LIST!=null ) {			
			var NOW_DAY = dateUtil.getNowDate();			
			var NOW_TIME = dateUtil.getNowTime();
			var arr = checkTimeMessage(NOW_DAY,NOW_TIME);
			if(arr.length<LIST.length){
				var second = 60-(NOW_TIME.substring(4, 6));
				TIME_OUT = setTimeout("promptMessageUtil.oneMincheck()",second*1000)
			}			
		}else {			
			writeHtml([]);
		}				
	}

	PromptMessageUtil.prototype.callFun = function (Index){

		var Object = promptMessageUtil.options.MSG_LIST[Index];		
		var ID = promptMessageUtil.options.MessageID;
		var URL = Object.URL ;
		var FUN = Object.FUN ;
		if(FUN!=null&&FUN!="") {
			eval(FUN);
		}
		if(URL!=null&&URL!=""&&URL!="#") {
			$("#"+promptMessageUtil.options.IFRAME_ID).attr('src',URL);
		}
				
		if( Object.TAB=="S0N" ) {
			$.ajax({
			      url: 'DASHBOARD/DashboardMessageRead.htm',
			      data: {
			    	  pid: Object.PID,
			    	  crtid: promptMessageUtil.options.crtid,
			    	  usrid: promptMessageUtil.options.usrid
			      	},
			      type: 'GET' 
			    });			
		}
		
		setTimeout(
				function(){
					promptMessageUtil.delMessage(Index)
				},
				promptMessageUtil.options.REMOVE_TIME*1000
			);
	}
	
	PromptMessageUtil.prototype.displayMsg =  function (){
		var ID = promptMessageUtil.options.MessageID;
		$("[id=item]:gt("+promptMessageUtil.options.printMax+")").toggle();
		$("#PromptMessageClick_"+ID).click();
	}
	
	PromptMessageUtil.prototype.readAll =  function (){
		for(var i=promptMessageUtil.options.MSG_LIST.length-1;i>=0;i--) {
			promptMessageUtil.callFun(i);
		}
	}
	
	PromptMessageUtil.prototype.delMessage =  function (Index) {
		promptMessageUtil.options.MSG_LIST.splice(Index,1);
		promptMessageUtil.setMsg();
	}
	
	PromptMessageUtil.prototype.oneMincheck = function (){
		var NOW_DAY = dateUtil.getNowDate();
		var NOW_TIME = dateUtil.getNowTime();
		var arr = checkTimeMessage(NOW_DAY,NOW_TIME);
		if(TIME_OUT!=null) {
			clearTimeout(TIME_OUT);
			var MSG_LIST = promptMessageUtil.options.MSG_LIST;			
			if(arr.length<MSG_LIST.length){
				var second = 60-(NOW_TIME.substring(4, 6));
				TIME_OUT = setTimeout("promptMessageUtil.oneMincheck()",second*1000)
			}
		}		
	}
	
	PromptMessageUtil.prototype.clearLocal = function (){		
		promptMessageUtil.options.MSG_LIST = [];
		window.localStorage[promptMessageUtil.options.LOCAL_STORAGE] = promptMessageUtil.options.MSG_LIST;
		setAllMsg();
	}

	function writeHtml(LIST) {
		
		var ID = promptMessageUtil.options.MessageID;
		var MESSAGE_TXT ="";
		if( LIST==null )
			LIST = [];
		$.each(LIST,function( i, value ) {
			MESSAGE_TXT+="<li id='item'>"+
				"<a href='javascript:promptMessageUtil.callFun(\""+i+"\")' id='gritter-regular'>"+
			    "<div class='clearfix'>"+
				"<span class='pull-left'>"+
				value.MSG+
				"</span></div></a></li>";
		});			
		MSG_NUM = LIST.length;
		
		var MSG_NUM_TXT;
		if(MSG_NUM=="0") {
			MSG_NUM_TXT = "無新通知";
		}else {
			MSG_NUM_TXT = MSG_NUM+"則新通知";
		}
		$messageid = $("#"+ID);
		$messageid.empty();
        $messageid.append(
        		"<a id='PromptMessageClick_"+ID+"' data-toggle='dropdown' class='dropdown-toggle' href='#' aria-expanded='true'>"+
      		  	"	<i id='bell' class='ace-icon fa fa-bell "+(MSG_NUM=="0"?"":"icon-animated-bell")+"'></i>"+
      		  	"	<span class='badge badge-important'>"+MSG_NUM+"</span>"+
      		  	"</a>"+
      		  	"<ul class='dropdown-menu-right dropdown-navbar navbar-red dropdown-menu dropdown-caret dropdown-close'>"+
      		  	"	<li class='dropdown-header'>"+
      		  	"	<i class='ace-icon fa fa-exclamation-triangle'></i>"+
      		  		MSG_NUM_TXT +
      		  	"	</li> "+
      		  	"	<li class='dropdown-content ace-scroll' style='position: relative;'>"+
      		  	"		<div class='scroll-track' style='display: none;'><div class='scroll-bar'></div></div>"+
      		  	"		<div class='scroll-content'>"+
      		  	"			<ul class='dropdown-menu dropdown-navbar navbar-pink'>"+
      		  				MESSAGE_TXT+
      		  	"		</div>"+
      		  	"	</li>"+
      		  	"	<li class='dropdown-footer' style='display:none'><a href='javascript:promptMessageUtil.displayMsg()'>"+
			  	"		展開全部/顯示部分" +
			  	"		<i class='ace-icon fa fa-arrow-right'></i>" +
			  	"	</a></li>" +
      		  	"	<li class='dropdown-footer' style='display:none'><a href='javascript:promptMessageUtil.readAll()'>"+
			  	"		設定全部已讀" +
			  	"	</a></li>" +
      		  	"</ul>"
		  	);
        
        if( LIST.length>promptMessageUtil.options.printMax ) {
        	$("li.dropdown-footer:eq(0)", $messageid).show();
        }
        if( LIST.length>0 ) {
        	$("li.dropdown-footer:eq(1)", $messageid).show();
        }
        $("[id=item]:gt("+promptMessageUtil.options.printMax+")").toggle();
	} 

	function setAllMsg(){
		promptMessageUtil.setMsg();
	}

	function checkTimeMessage(NOW_DAY,NOW_TIME){

		var MSG_LIST = promptMessageUtil.options.MSG_LIST;		
		var arr = new Array();
		
		$.each(promptMessageUtil.options.MSG_LIST,function( i, value ) {
			var time = value.TIME;
			var usrid = typeof(value.USRID)=="undefined" ? "" : value.USRID;
			
			if(!isNaN(time)&&time.length==12) {
				var time_DAY = time.substring(0, 8);
				if(time_DAY<NOW_DAY) {
					if( usrid=="" || usrid==promptMessageUtil.options.usrid)
						arr.push(value);
				}else if(time_DAY == NOW_DAY){
					var time_TIME = time.substring(8, 12);
					if(time_TIME<=NOW_TIME.substring(0, 4)) {
						if( usrid=="" || usrid==promptMessageUtil.options.usrid)
							arr.push(value);
					}
				}
			}else{
				if( usrid=="" || usrid==promptMessageUtil.options.usrid)
					arr.push(value);
			}
			
		});
		writeHtml(arr);
		return arr;
	}

}

function checkRepeat(LIST){
	var keys = new Map();
	var s =  new Array();
	if(LIST==null) {
		return ;
	}
	$.each(LIST,function( i, value ) {		
		if(value.MSG!=null) {
			if(value.MSG!="") {
				var id = value.MSG;
				var Delete = value.DELETE;				
				if(keys.has(id)) {
					s.push(keys.get(id));
					if(Delete) {
						keys.delete(id);
					}					
				}				
				if(Delete) {
					s.push(i);
				}else {
					keys.set(id,i);
				}
			}
		}
	});
	
	s.sort(function (a, b) {
		  return b - a //從大排到小
		});
	$.each(s,function( i, value ) {
		LIST.splice(value,1);
	});
}

var promptMessageUtil = new PromptMessageUtil();