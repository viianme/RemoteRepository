
function ItemUtil() {
}


ItemUtil.prototype.item = {
	btn:{
		"新增": {type:"btn", bgcolor:"success", fa:"plus", textpattern:"新增"},
		"新作業": {type:"btn", bgcolor:"success", fa:"plus-square-o", textpattern:"新作業"},
		"送出": {type:"btn", bgcolor:"success", fa:"check", textpattern:"送出"},
		"全選": {type:"btn", bgcolor:"success", fa:"check-square-o", textpattern:"全選"},
		"全不選": {type:"btn", bgcolor:"success", fa:"square-o", textpattern:"全不選"},
		"確定": {type:"btn", bgcolor:"primary", fa:"check", textpattern:"確定"},
		"存檔": {type:"btn", bgcolor:"success", fa:"check", textpattern:"存檔"},
		"上傳": {type:"btn", bgcolor:"primary", fa:"upload", textpattern:"上傳"},
		"下載": {type:"btn", bgcolor:"primary", fa:"download", textpattern:"下載"},
		"儲存": {type:"btn", bgcolor:"primary", fa:"floppy-o", textpattern:"儲存"},
		"修改": {type:"btn", bgcolor:"warning", fa:"pencil", textpattern:"修改"},
		"開窗查詢": {type:"btn", bgcolor:"warning", fa:"external-link", textpattern:"開窗查詢"},
		"開窗": {type:"btn", bgcolor:"warning", fa:"external-link", textpattern:"開窗"},
		"刪除": {type:"btn", bgcolor:"danger", fa:"trash", textpattern:"刪除"},
		"查詢": {type:"btn", bgcolor:"info", fa:"search", textpattern:"查詢"},
		"列印": {type:"btn", bgcolor:"info", fa:"print", textpattern:"列印"}, 
		"取消": {type:"btn", bgcolor:"default", fa:"ban", textpattern:"取消"},
		"清除": {type:"btn", bgcolor:"default", fa:"times", textpattern:"清除"},
		"設定": {type:"btn", bgcolor:"primary", fa:"cog", textpattern:"設定"},
		"清單": {type:"btn", bgcolor:"info", fa:"list", textpattern:"清單"},
		"文件": {type:"btn", bgcolor:"info", fa:"file", textpattern:"文件"},
		"回前畫面": {type:"btn", bgcolor:"info", fa:"undo", textpattern:"回前畫面"},
		"EXCEL匯出": {type:"btn", bgcolor:"info", fa:"file-excel-o", textpattern:"EXCEL匯出"},
		"DEFAULT": {type:"btn", bgcolor:"success"}
	},   
	icon:{
		"新增": {type:"icon", bgcolor:"success", fa:"plus", textpattern:"新增"},
		"檢視": {type:"icon", bgcolor:"info", glyphicon:"search", textpattern:"檢視"},
		"引用": {type:"icon", bgcolor:"info", glyphicon:"share", textpattern:"引用"},
		"編輯": {type:"icon", bgcolor:"info", fa:"pencil", textpattern:"編輯"},
		"編檔": {type:"icon", bgcolor:"success", fa:"edit", textpattern:"編檔"},
		"審核": {type:"icon", bgcolor:"info", glyphicon:"list-alt", textpattern:"審核"},
		"轉換": {type:"icon", bgcolor:"warning", fa:"exchange", textpattern:"轉換"},		
		"刪除": {type:"icon", bgcolor:"danger", fa:"trash-o", textpattern:"刪除"},
		"儲存": {type:"icon", bgcolor:"info", fa:"save", textpattern:"儲存"} ,
		"對調": {type:"icon", bgcolor:"info", fa:"refresh", textpattern:"對調"},
		"傳值": {type:"icon", bgcolor:"success", fa:"share", textpattern:"傳值"},
		"列印": {type:"icon", bgcolor:"info", fa:"print", textpattern:"列印"},
		"附件": {type:"icon", bgcolor:"info", fa:"folder-open", textpattern:"附件"},
		"下載": {type:"icon", bgcolor:"primary", fa:"download", textpattern:"下載"},
		"播放": {type:"icon", bgcolor:"warning", fa:"caret-right", textpattern:"播放"},		 
		"退回": {type:"icon", bgcolor:"warning", fa:"undo", textpattern:"退回"},
		"重傳部分受文單位": {type:"icon", bgcolor:"info", glyphicon:"list-alt", textpattern:"重傳部分受文單位"},
		"後續動作": {type:"icon", bgcolor:"success", fa:"pencil-square-o", textpattern:"後續動作"},
		"利息Y": {type:"icon", bgcolor:"warning", fa:"usd", textpattern:"利息"},
		"利息N": {type:"icon", bgcolor:"success", fa:"usd", textpattern:"利息"},
		"併案": {type:"icon", bgcolor:"success", fa:"exchange", textpattern:"併案"}
	}
};

ItemUtil.prototype.iniButton = function($button) {
	
	$button.each(function(){
		var text = $(this).attr("text");
		var title = $(this).attr("title");
		if( typeof(title)=="undefined" ) {
			title=text
		}
		if( typeof(itemUtil.item.btn[text])=="object" ) {
			btnItem = itemUtil.item.btn[text];
			$i = btnItem.fa!=null ? $("<i class='ace-icon fa fa-"+btnItem.fa+"'></i>") : $("<i class='ace-icon glyphicon glyphicon-"+btnItem.glyphicon+"'></i>");
			$(this).attr("type", "button").attr("return", false).attr("title", title)
		       .css("margin-left", "3px")
		       .addClass("btn").addClass("btn-xs").addClass("btn-round").addClass("btn-"+btnItem.bgcolor)
		       .append($i)
		       .append("<span class='bigger-110'>"+text+"<span>")
		}else{
			$(this).attr("type", "button").attr("return", false).attr("title", title)
			       .css("margin-left", "3px")
			       .addClass("btn").addClass("btn-xs").addClass("btn-round").addClass("btn-"+itemUtil.item.btn["DEFAULT"].bgcolor)
			       .append("<span class='bigger-110'>"+text+"<span>")			       
		}
	})
}

ItemUtil.prototype.getItemOption = function(option) { 
	var itemOptions = {
		  type: "btn"			//類型
		, btn: null				//直接為BUTTON，但BUTTO
		, icon: null			//直接為ICON
		, bgcolor : "success"	//顏色
		, attr: ""				//屬性
		, fa : null				//取 fa 屬性的圖示
		, glyphicon: null		//取 glyphicon 屬性的圖示
		, textpattern : ""		//顯示的文字
		, click: null			//click 時觸發的 event
		, data: {}				//資料
		, datamapping: null		//datamapping
		, title : null
	};
	
	if( option==null)
		itemOptions = $.extend({}, itemOptions, {type:"txt"});
	else if( typeof(option)=="string")
		itemOptions = $.extend({}, itemOptions, {type:"txt", textpattern:option});
	else
		itemOptions = $.extend({}, itemOptions, option);
	
	return itemOptions;
};

ItemUtil.prototype.genObject = function(itemoption, data, datamapping, click) {
	
	if( !Array.isArray(itemoption) ) { 
		itemoption = [itemoption];
	}	
	var option=[];
	for(var i=0;i<itemoption.length;i++) {
		option.push(itemoption[i]);
	}
	
	for(var i=0;i<option.length;i++) {
		option[i] = itemUtil.getItemOption(option[i]);
		textpattern = option[i].textpattern;
		if( option[i].btn!=null ) {
			if( typeof( itemUtil.item.btn[option[i].btn])=="object" ) {
				option[i] = $.extend({}, option[i], itemUtil.item.btn[option[i].btn]);
			} else {
				option[i] = $.extend({}, option[i], itemUtil.item.btn["DEFAULT"]);
				option[i].textpattern = option[i].btn;
			}
		}else if( option[i].icon!=null ) {
			if( typeof( itemUtil.item.icon[option[i].icon])=="object" ) {
				option[i] = $.extend({}, option[i], itemUtil.item.icon[option[i].icon]);
			}
		}
		if( typeof(textpattern)=="string" && textpattern != "")
			option[i].textpattern = textpattern;
	}
	
	$ret = $("<span></span>");
	for(var i=0;i<option.length;i++) {
		if(typeof(data)=="object") {
			option[i].data = $.extend({}, data, option[i].data);
		}
		if(typeof(datamapping)=="object") {
			option[i].datamapping = $.extend({}, datamapping, option[i].datamapping);
		}
		if(typeof(click)=="function" && option[i].click==null) {
			option[i].click = click;
		}
		$ret.append(genObj(option[i]));
	}	
	return $ret;	 
	
	function genObj(option) {
		$btn = "";
		tryclick = "";
		textpattern = strUtil.tranPattern(option.textpattern, option.data, option.datamapping);
		title = option.title==null ? textpattern : option.title;
		if( option.type=="btn" || option.type=="icon") {
			$btn = $("<button type='button' style='margin-left:3px' class='btn btn-xs btn-"+option.bgcolor+"' "+option.attr+" return=false></button>")
				.attr("title", title);
			if( option.type=="btn")
				$btn.addClass("btn-round")
			else if( option.type=="icon") 
				$btn.addClass("btn-bold")
			if( option.fa!=null) {
				$("<i class='ace-icon fa fa-"+option.fa+"'></i>").appendTo($btn);
			}else if( option.glyphicon!=null) {
				$("<i class='ace-icon glyphicon glyphicon-"+option.glyphicon+"'></i>").appendTo($btn);
			} 
			if( option.type=="btn" )			
				$btn.append("<span class='bigger-110'>"+textpattern+"<span>");			
		}else if(option.type=="txt") {
			if( typeof(option.click)=="function" ) {
				$btn = $("<a></a>").css("cursor", "pointer") 
				$btn.html(strUtil.tranPattern(option.textpattern, option.data, option.datamapping));
			}else{
				$btn = $("<span style='margin-left:3px' "+option.attr+"></span>")
				$btn.html(strUtil.tranPattern(option.textpattern, option.data, option.datamapping));				
			}
		}
		$btn.data("json", option.data);
		$btn.data("clk", option.click); 			
		if( typeof(option.click)=="function" ) {
			$btn.click(function(event){
				data =  $(this).data("json");
				clk =  $(this).data("clk");
				clk(data, $(this))
				event.stopPropagation();
			})
		}
		
		if( typeof(top.getFontSize)=="function" ) {
			if( top.getFontSize()!="" ) {
				var btnmap = {"x-small":"btn-minier ", "small":"btn-xs", "medium":"btn-sm", "large":"btn-info"};
				$btn.removeClass("btn-xs").addClass(btnmap[top.getFontSize()])
			}
		}
		return $btn;
	}	
}

//globe object
var itemUtil = new ItemUtil();