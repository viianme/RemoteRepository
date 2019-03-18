function TabControlUtil() {
}

TabControlUtil.prototype.pageIndex = 0;

TabControlUtil.prototype.addOnePage = function(divObj, page) {	
	var num_tabs = $("div:last", divObj).length==0 ? "1" : $("div:last", divObj).attr("id")*1+1;
    $("ul", divObj).append(
        "<li><a href='#"+num_tabs+"'>"+page.title+"</a></li>"
    );
    divObj.append(
        "<div id='"+num_tabs+"' style='padding:0px;width:100%;height:100%'></div>"
    );
    $("#"+num_tabs, divObj).append(page.content)
    divObj.tabs("refresh");
}

TabControlUtil.prototype.autoset = function($div, $body, win) {

	tabControlUtil.setHeight($body);
	
	$div.each(function(){
		$(this).css("margin", "0px")
		var tabPages = [];
		$tab = $("span[tab]", $(this));
		$tab.each(function(){			
			click = typeof($(this).attr("click"))=="string" ? $(this).attr("click") : "";
			if( click!="" ) {
				if( typeof(eval("win."+click))=="function" )
					click = eval("win."+click);
				else
					click = null
			}
			tabPages.push({
					title: $(this).attr("title"), 
					content:$(this).children(), 
					click: click
				});
		})		
		
		tabPages = {
			 title : $(this).attr("title"),
			 pages: tabPages
		};
		
		tabControlUtil.iniDiv($(this));
		tabControlUtil.setAllPage({
			targetObj : $(this),
			pages: tabPages
		}); 
		
		$("span[tab]", $(this)).remove();
	})
	
}

TabControlUtil.prototype.setHeight = function($body) {
		
	$("div[tab]", $body).each(function(){	
		var height = $body.css("height").replace("px", "")*1;
		
		heighttxt = $(this).attr("height");
		if( typeof(heighttxt)!="undefined" ) {
			if( !isNaN(heighttxt) ) {
				$(this).css("height", heighttxt);
			}else if( heighttxt=="auto") {
				$(this).css("height", height - tabControlUtil.findPosY(this) - 45);
			}
		}
	})
	
}

TabControlUtil.prototype.getNowTitle = function($div) {	
	return $("li.active a", $div).text();
}

TabControlUtil.prototype.removeAll = function($div) {	
	$("#nav_tabs>li", $div).remove();
	$("#tab_content>div", $div).remove();
}

TabControlUtil.prototype.remove = function($div, i) {	
	if( !isNaN(i) ) {
		$("#nav_tabs>li:eq("+i+")", $div).remove();
		$("#tab_content>div:eq("+i+")", $div).remove();
	}else{
		$("#nav_tabs>li[title='"+i+"']", $div).remove();
		$("#tab_content>div[title='"+i+"']", $div).remove();
	}
}

TabControlUtil.prototype.findPosY = function(obj) {		
	var curtop = 0;  
   if(obj.offsetParent)  
       while(1)  
       {  
         curtop += obj.offsetTop;  
         if(!obj.offsetParent)  
           break;  
         obj = obj.offsetParent;  
       }  
   else if(obj.y)  
       curtop += obj.y;  
   return curtop;  	
}

TabControlUtil.prototype.iniDiv = function(divObj) {	
	
	if( $("div[id=widget_header]",  divObj).length==0 ) {
		var widget_header 	= $('<div id="widget_header" class="widget-header"><h4 class="widget-title lighter smaller">' + divObj.attr("title") + '</h4></div>');
		var widget_toolbar 	= $('<div id="widget_toolbar" class="widget-toolbar no-border"></div>').appendTo(widget_header);
		var widget_body 	= $('<div id="widget_body" class="widget-body" style="height:100%;width:100%"></div>');
		var widget_main 	= $('<div id="widget_main" class="widget-main padding-2" style="height:100%;width:100%"></div>').appendTo(widget_body);
		var tab_content 	= $('<div id="tab_content" class="tab-content padding-2" style="height:100%;width:100%"></div>').appendTo(widget_main);
		var nav_tabs 		= $('<ul id="nav_tabs" class="nav nav-tabs" id="recent-tab"></ul>').appendTo(widget_toolbar);
		divObj.append(widget_header);
		divObj.append(widget_body);
	}
	
}

TabControlUtil.prototype.setAllPage = function(options) {
	
	var pages = options.pages.pages;
	var divObj = options.targetObj;	
	tabControlUtil.iniDiv(divObj)	
	$("div>h4", divObj).text(options.pages.title);
	
	for(var i=0;i<pages.length;i++) {
		tabControlUtil.addPage(divObj, pages[i]);
	}
	
	if( pages.length>0 ) {
		$("div[title]:eq(0)", divObj).addClass("active")
		$("li[title]:eq(0)", divObj).click().addClass("active")
	}
};

TabControlUtil.prototype.showPage = function(divObj, i) {
	
	$("div[title]", divObj).removeClass("active")
	$("li[title]", divObj).removeClass("active")
	
	if( typeof(i)=="string" ) {
		$("div[title='"+i+"']", divObj).addClass("active")
		$("li[title='"+i+"']", divObj).click().addClass("active")
	}else{
		$("div[title]:eq("+i+")", divObj).addClass("active")
		$("li[title]:eq("+i+")", divObj).click().addClass("active")
	}
};

TabControlUtil.prototype.addPage = function(divObj, page) {

	var tab_content 	= $("#tab_content", divObj)
	var nav_tabs 		= $("#nav_tabs", divObj)
	
	var tabid = "__tab"+(tabControlUtil.pageIndex++);
	var newtab = $('<li clickfunc="'+page.click+'" title="'+page.title+'"><a data-toggle="tab" href="#' + tabid + '">' + page.title + '</a></li>');
	nav_tabs.append(newtab);
	var context = $('<div tag id="' + tabid + '" class="tab-pane" title="'+page.title+'" style="height:100%;width:100%"></div>');
	context.append( page.content );
	
	if( page.content[0].tagName.toLowerCase()=="iframe" )
		tabControlUtil.setIframe(page.content);
	if( page.content[0].tagName.toLowerCase()=="div" )
		tabControlUtil.setDiv(page.content);
	
	newtab.click(function(){ 
		title = $(this).attr("title");
		$par = $(this).parent().parent().parent().parent();
		$div = $("div[tag][title='"+title+"']", $par);
		if( $("iframe", $div).length==1 ) {
			$iframe = $("iframe", $div);
			if( typeof($iframe.attr("src"))=="undefined" && typeof($iframe.attr("tmpsrc"))=="string" ) {
				$iframe.attr("src", $iframe.attr("tmpsrc"));
			} 
		}
	})
	
	if( typeof(page.click)=="function" ) {			
		newtab.data("clk", page.click).css("cursor", "pointer");
		newtab.click(function(){
			divObj = $(this).parent().parent().parent();
			if( tabControlUtil.getNowTitle(divObj) != $(this).attr("title") )
				$(this).data("clk")();
			$("div[title='"+$(this).attr("title")+"']", divObj).addClass("active")
		})
	}
	tab_content.append(context);
}

//將 iframe 加入一些參數
TabControlUtil.prototype.setIframe = function(iframe){
	iframe.attr("width","100%");
	iframe.attr("height","100%");
	iframe.attr("marginwidth","0");
	iframe.attr("marginheight","0");
	iframe.attr("align","top");
	iframe.attr("scrolling","autotop");
	iframe.attr("frameborder","0");
	iframe.css("overflow:scroll;height:100%;width:100%;position: relative;");
}

//將 iframe 加入一些參數
TabControlUtil.prototype.setDiv = function(div){
	div.css("width","100%");
	div.css("height","100%");
}

var tabControlUtil = new TabControlUtil();