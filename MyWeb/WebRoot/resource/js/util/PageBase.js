var havecalendarutil = typeof(calendarUtil)=="object";

if( typeof(top.dialogUtil)=="undefined") {
	var js = [
			"DialogUtil", "DateUtil", "StrUtil", "DynUtil", "RenderUtil", "TabControlUtil", "ItemUtil", 
			"CalendarUtil", "json2", "TableDbUtil", "sockjs-0.3.4", "stomp", "WebSocketUtil","ZipCodeUtil","LocalUtil", "PromptMessageUtil"
		];
	for(var i=0;i<js.length;i++) {
		if( js[i]!="CalendarUtil" || !havecalendarutil) {
			jsUtil.addScript(js[i]);
		}
	} 
}

var dialogUtil 		= top.dialogUtil;
var dateUtil 		= top.dateUtil;
var dynUtil			= top.dynUtil;
var strUtil			= top.strUtil;
var renderUtil		= top.renderUtil;
var itemUtil		= top.itemUtil;
var tabControlUtil	= top.tabControlUtil;
var calendarUtil	= havecalendarutil ? calendarUtil : top.calendarUtil;
var tabledbUtil		= top.tabledbUtil;
var uiFrameset		= parent.uiFrameset;
var zipCodeUtil		= top.zipCodeUtil;
var localUtil 	    = top.localUtil;
if( typeof(uiFrameset)=="undefined" ) {
	$(window).resize(function(){setLocation();})
	jsUtil.addScript("HelpUtil");
}else
	helpUtil		= parent.helpUtil;
var JSON			= top.JSON;
var SockJS 			= top.SockJS;
var Stomp 			= top.Stomp;
var websocketUtil 	= top.websocketUtil;
var divOption	    = {};
var promptMessageUtil = top.promptMessageUtil;

$(document).ready(function(){
	
	if( $("div[tab]").has("span[tab]").length>0 ) {
		tabControlUtil.autoset($("div[tab]").has("span[tab]"), $("body"), window);
	}
	ui.iniRenderObject($("body"));
	$("<div id='mask' class='ui-widget-overlay ui-front' style='z-index: 1049;'></div>").appendTo( $("body") ).hide();
	
	iniOption();
	if( typeof(top.getFontSize)=="function" ) {
		setFontSize(top.getFontSize())
	}

	if( $("button[text]").length>0 ) {
		itemUtil.iniButton($("button[text]"));
	}
	if( $("form").length>0 ) {
		checkUtil.iniFormEnterKey();
		checkUtil.iniTextCondition();		
	}

	$.widget( "custom.catcomplete", $.ui.autocomplete, {
		_renderItem: function( ul, item ) {
			return $( "<li>" )
				.append( $( "<a>" ).text( strUtil.tranPattern(this.options.labelpattern, item)) )
				.appendTo( ul );
		}
	});
});

function maskAll() {
	$("div[id=mask]").show();
}

function unmaskAll() {
	$("div[id=mask]").hide();
}

function setLocation(template) {

	bodyheight = getBodyHeight();
	template = __template__;
	if( template=="0" ) {		
		
		divOption.all.css("height", bodyheight);
		divOption.all.css("overflow", "auto");
		
	}else if( template=="1" ) {
		
		if( divOption.auto=="" ) {
			$("body").prop("scroll", "no").css("height", "100%");
			divOption.top.css("height", divOption.height[0]+"%").css("overflow","auto");	
			divOption.down.css("height", divOption.height[1]+"%").css("overflow","auto");		
		}else if( divOption.auto=="body" ) {
			$("body").prop("scroll", "auto")
			divOption.top.css("height", "").css("overflow",""); 	
			divOption.down.css("height", "").css("overflow",""); 	
		}else if( divOption.auto=="top" ) {
			$("body").prop("scroll", "no")
			topHeight = $("div[id=top]")[0].offsetHeight;
			divOption.top.css("height", "").css("overflow",""); 	
			divOption.down.css("height", bodyheight-topHeight).css("overflow","auto");
		}else if( divOption.auto=="down" ) {
			$("body").prop("scroll", "no") 
			downHeight = $("div[id=down]")[0].offsetHeight;
			divOption.top.css("height", bodyheight-downHeight).css("overflow","auto");
			divOption.down.css("height", "").css("overflow",""); 
		}
		
	}else if( template=="2" ) {
		
		divOption.left.removeClass("col-sm-"+divOption.lsm);
		divOption.right.removeClass("col-sm-"+divOption.rsm);	
		divOption.left.css("height", bodyheight).css("overflow", "auto").addClass("col-sm-"+divOption.width[0]);
		divOption.right.css("height", bodyheight).css("overflow", "auto").addClass("col-sm-"+divOption.width[1]);	
		divOption.lsm = divOption.width[0];
		divOption.rsm = divOption.width[1]; 
		
	}else if( template=="3" ) {

		divOption.left.removeClass("col-sm-"+divOption.lsm);
		divOption.right.removeClass("col-sm-"+divOption.rsm);	
		if( divOption.auto=="" ) {
			divOption.top.css("height", divOption.height[0]+"%").css("overflow","auto");		
			divOption.left.css("height", divOption.height[1]+"%").css("overflow", "auto").addClass("col-sm-"+divOption.width[0]);
			divOption.right.css("height", divOption.height[1]+"%").css("overflow", "auto").addClass("col-sm-"+divOption.width[1]);
		}else if( divOption.auto=="top" ) {
			topHeight = $("div[id=top]")[0].offsetHeight;
			divOption.top.css("height", topHeight).css("overflow",""); 	
			divOption.left.css("height", bodyheight-topHeight).css("overflow","auto").addClass("col-sm-"+divOption.width[0]);
			divOption.right.css("height", bodyheight-topHeight).css("overflow","auto").addClass("col-sm-"+divOption.width[1]);
		}
		divOption.lsm = divOption.width[0];
		divOption.rsm = divOption.width[1]; 
		
	}else if( template=="4" ) {

		divOption.top.css("height", divOption.height[0]+"%").css("overflow","auto");
		divOption.center.css("height", divOption.height[1]+"%").css("overflow","auto");
		divOption.down.css("height", divOption.height[2]+"%").css("overflow","auto");
		
	}
	
	if( $("div[tab][height=auto]").length>0 ) {
		tabControlUtil.setHeight($("body"));
	}
} 

function iniOption() {	
	
	template = __template__;
	if( template=="0" ) {
		
		document.body.style.overflowX = 'hidden';
		document.body.style.overflowY = "hidden";
		divOption = {
				all: $("div[id=all]")
			}
		
	}else if( template=="1" ) {
		
		divOption = {
				top: $("div[id=top]"),
				down: $("div[id=down]"),
				auto: "top", 
				height:[50,50],
				showTopAndDown: function(x1, x2) {
					divOption.auto = "";
					divOption.height = [x1, x2];
					setLocation();
				},
				setAutoBodyHeight: function() {
					divOption.auto = "body";
					setLocation();
				},
				setAutoTopHeight: function() {
					divOption.auto = "top";
					setLocation();
				},
				setAutoDownHeight: function() {
					divOption.auto = "down";
					setLocation();
				}
			}
		
	}else if( template=="2" ) {
		
		divOption = {
				left: $("div[id=left]"),
				right: $("div[id=right]"),
				width:["6","6"],
				showLeftAndRight: function(x1, x2) {
					divOption.width = [x1, x2];
					setLocation();
				},
				lsm: "6",
				rsm: "6"
			}
		
	}else if( template=="3" ) {
		
		divOption = {
				top: $("div[id=top]"),
				left: $("div[id=left]"),
				right: $("div[id=right]"),
				auto: "top",
				height:[50,50],
				width:["6","6"],
				showTopAndDown: function(x1, x2) {
					divOption.auto = "";
					divOption.height = [x1, x2];
					setLocation();
				},
				showLeftAndRight: function(x1, x2) {
					divOption.width = [x1, x2];
					setLocation();
				},
				showTop: function() {
					divOption.auto = "";
					divOption.height = [100, 0];
					setLocation();
				},
				showDown: function() {
					divOption.auto = "";
					divOption.height = [0, 100];
					setLocation();
				},
				setAutoTopHeight: function() {
					divOption.auto = "top";
					setLocation();
				},
				lsm: "6",
				rsm: "6"
			}
		
	}else if( template=="4" ) {
		
		divOption = {
				top: $("div[id=top]"),
				center: $("div[id=center]"),
				down: $("div[id=down]"),
				height:[33,33,33],
				showHeight: function(x1, x2, x3) {
					divOption.auto = "";
					divOption.height = [x1, x2, x3];
					setLocation();
				},
				showTop: function() {
					divOption.auto = "";
					divOption.height = [100, 0, 0];
					setLocation();
				},
				showCenter: function() {
					divOption.auto = "";
					divOption.height = [0, 100, 0];
					setLocation();
				},
				showDown: function() {
					divOption.auto = "";
					divOption.height = [0, 0, 100];
					setLocation();
				}
			}
		
	}

	setLocation();
}

function setFontSize(fontsize) {
	if( fontsize!="" ) {
		$("body>div").css("font-size", fontsize);
		var btnmap = {"x-small":"btn-minier ", "small":"btn-xs", "medium":"btn-sm", "large":"btn-info"};
		$(".btn").removeClass("btn-minier").removeClass("btn-xs").removeClass("btn-sm").removeClass("btn-info").addClass(btnmap[fontsize])
		
		var headermap = {"x-small":"medium", "small":"large", "medium":"x-large", "large":"xx-large"};
		$("h4.header span:eq(0)").css("font-size", headermap[fontsize])
		setLocation();
	}
	$("iframe").each(function(){
		if( this.name!="" && typeof(frames[this.name].setFontSize)=="function" ) { 
			frames[this.name].setFontSize(fontsize);
		} 
	})
}

function getBodyHeight() {
	var height = 0;	
	if( parent.location.href!=location.href && typeof(parent.getBodyHeight)=="function" )
		height = parent.getBodyHeight(location.href);
	else {
		height = $("body")[0].offsetHeight-5;
	}
	return height;
}

