
function DynUtil() {
		
}

DynUtil.prototype.dynOption = null;

DynUtil.prototype.getWebRoot = function() {
	web = window.location.pathname;
	if( web.indexOf("/") != 0 ) web = "/"+web;
	web = web.substring(0, web.indexOf("/", 1)+1);	
	return web;
};

DynUtil.prototype.getData = function (dynOption, onSuccess) {

	var url = (dynOption.url==null ? "" : dynOption.url);
	if( url!="" && url.indexOf("/")!=0 ) {
		url = dynUtil.getWebRoot() + url;
	}
	if (dynOption.formObj != null) {
		dynOption.dataObj = formUtil.Form2Json(dynOption.formObj)
	}
	
	if( dynOption.data==null ) {
		formUtil.submitTo({
			url: url,
			formMethod: dynOption.formMethod,
			dataObj: dynOption.dataObj,
			async: dynOption.async,
			onError: function(jsonData) {
		    },
		    onSuccess: function(jsonData) {
		    	onSuccess(jsonData);
		    }
		});
	}else{
		var jsonData = {data: dynOption.data};
		onSuccess(jsonData);
	}
	
};

DynUtil.prototype.getDynOption = function() { 
	var dynOptions = {
		  dataObj : {}				//要傳給後端的參數	
		, formMethod : 'POST'		//資料傳遞方式
		, async: false				//同步非同步

		//屬於 setSelectOption 在用的參數
		, targetObj : null			//指定哪一個select物件
		, isClear: true				//是否清除原始的資料
		, haveall : false			//是否於為智0增加「全部」選項
		, allText : "全部"
		, valuepattern: '@{VALUE}'	//value顯示的樣板
		, textpattern: '@{TEXT}'	//text顯示的樣板
		, attrpattern: ""
		, defaultValue: null		//預設值是什麼
		
		//屬於開窗時所使用的參數
		, width: screen.availWidth	//開啟視窗的寬度(預設畫面寬度)
		, height: screen.availHeight//開啟視窗的高度(預設畫面高度)
		, openSelectDataTxt: null		//以逗號分格的開窗字串
		, splitStr: ','				//多選帶回時已甚麼福號區隔
			
		//比較簡單的開窗多選或單選所使用
		, texttarget: null			//開窗單選或多選text文字設定的存放位置
		, valuetarget: null			//開窗單選或多選value文字設定的存放位置
		, url: null					//由哪個url取得資料回來( 層級大於 sqlid )
		, data: null				//由前端指定的資料集( 層級大於 url )
		, filter: null
		
		, callback: null
		, datamapping: null
	};
	
	return dynOptions;
};

DynUtil.prototype.renderObject = function(options) { 

	var dynOption = $.extend({}, dynUtil.getDynOption(), options);
	 
	dynUtil.getData(dynOption, function(jsonData){
		dynOption.data = jsonData.data;
		renderUtil.renderObject(dynOption);
	});
}

DynUtil.prototype.viewFile = function(options) {
	
	//會使用 url dataObj
	var dynOption = $.extend({}, dynUtil.getDynOption(), options);
	formUtil.submitTo({
		url: dynOption.url,
		formMethod: dynOption.formMethod,
		dataObj: dynOption.dataObj,
		async: dynOption.async,
	    onSuccess: function(jsonData) {	    	
	    	dialogUtil.openDialog({
	    		url: dynUtil.getWebRoot()+'ViewFile.htm',
	    		width: options.width,
	    		height: options.height,
	    		title: options.title,
	    		viewfile: "Y"
	    	})
	    }
	});
}

DynUtil.prototype.getStrTodata = function(str) {
	var data = [];
	var ary = str.split(",");
	for( var i=0;i<ary.length;i++) {
		data[data.length] = {VALUE:ary[i]};
	}
	return data;
}

DynUtil.prototype.openSingleSelect = function(options) { 
	
	var dynOption = $.extend({}, dynUtil.getDynOption(), options);
	
	dynUtil.dynOption = dynOption;

	if( dynOption.width==screen.availWidth )
		dynOption.width = 250;
	if( dynOption.height==screen.availHeight )
		dynOption.height = 500;
	
	dialogUtil.openDialog({
		url : dynUtil.getWebRoot() + "resource/jsp/OPENSINGLE.jsp",
		title : "單選資料",
		width : dynOption.width,
		height : dynOption.height,
		callback: function(para) {
			if( typeof(dynOption.callback)=="function" )
				dynOption.callback(para);
		}
	})
};

DynUtil.prototype.openMultipleSelect = function(options) { 
	
	var dynOption = $.extend({}, dynUtil.getDynOption(), options);
	
	dynUtil.dynOption = dynOption;

	if( dynOption.width==screen.availWidth )
		dynOption.width = 250;
	if( dynOption.height==screen.availHeight )
		dynOption.height = 500;
	
	dialogUtil.openDialog({
		url : dynUtil.getWebRoot() + "resource/jsp/OPENMULTIPLE.jsp",
		title : "多選資料",
		width : dynOption.width,
		height : dynOption.height,
		callback: function(para) {
			if( typeof(dynOption.callback)=="function" )
				dynOption.callback(para);
		}
	})
};

//globe object
var dynUtil = new DynUtil(); 
