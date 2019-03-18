
/**
 * @description 所有關於form的操作皆使用此共用元件，包含了表單資料送出與表單資料繫結。
 * @class 表單工具
 * @author chkchk
 * @constructor
 */
function FormUtil() {
}

/**
 * @default '__temp__'
 */
FormUtil.prototype.defaultTemplateFormName = '__temp__';

FormUtil.prototype.getWebRoot = function() {
	web = window.location.pathname;
	if( web.indexOf("/") != 0 ) 
		web = "/"+web;
	web = web.substring(0, web.indexOf("/", 1)+1);	
	return web;
};



/**
 * 文奇
 *傳送某個form至後端 (可上傳檔案)
 */
FormUtil.prototype.formSubmitTo = function(customerOption){
	var formOption = $.extend({}, formUtil.getFormOption(), customerOption);
	    var hiddenInput = $("<input type='hidden' name='__isAjaxFormSubmit___' value='yes'>");		//增加一個參數，讓後端知道這是使用 ajaxsubmit傳過去的，當 user session timeout 時，可以讓前端停止後續的事件處理
	    hiddenInput.appendTo(formOption.formObj);
	    
	    formOption.formObj.ajaxSubmit({
	    	forceSync:true,
			beforeSubmit: function(){
				if( formOption.async ) {
					try {helpUtil.showProcessBar();} catch(e) {}
				}
		  	},
		  	error: function(xhr  , textStatus, errorThrown) {
		  		
		  		try{helpUtil.closeProcessBar();}catch(e){};
		  		//dialogUtil.openExceptionDialog( formUtil.getResponseErrorStatus(xhr,textStatus) );
		  		hiddenInput.remove();
		    },
		    success: function(response,status, xhr) {
		    		try{
				    		var JsonData ;
				    		if (typeof(response)=="object")
				    			JsonData = response;
				    		else
				    			JsonData =$.parseJSON(response);
					    	
					    	if( JsonData.status=="SUCCESS" ) {
					    		
					    		if( typeof(formOption.onSuccess)=="function" )
					    			formOption.onSuccess(JsonData);
					    	} else if( JsonData.status=="ERROR" ) {
					    		if( typeof(JsonData.messageText)=="string")
					    			helpUtil.showInfoBar("INFO", JsonData.messageText, 8000);
					    		else if( typeof(JsonData.data)=="string")
					    			helpUtil.showInfoBar("INFO", JsonData.data, 8000);
					    		
					    		if(typeof(formOption.onError) == "function")
					    			formOption.onError(JsonData);
					    		
					    	} else if( JsonData.status=="NULL" ) {
					    		top.window.document.location.href = formUtil.getWebRoot() + 'INDEX.htm?message=%E7%99%BB%E9%8C%84%E9%81%8E%E6%9C%9F%EF%BC%8C%E8%AB%8B%E9%87%8D%E6%96%B0%E7%99%BB%E5%85%A5';
					    	} else {
					    		try {
						    		helpUtil.showInfoBar("INFO", JsonData.messageText, 8000);
					    		} catch(e) {
					    			helpUtil.showInfoBar("INFO", JsonData.messageText, 8000);
					    		}
					    		formOption.onError(JsonData);
					    	}	
					    	if(!formOption.nocloseProcessBar){
					    		try {helpUtil.closeProcessBar();} catch(e) {}
					    	}
		    			
			    	}catch(e){
			    		alert("err="+e);
			    	}
			    hiddenInput.remove();
		    }
		});

};


/**
 * @description 表單參數物件
 * */
FormUtil.prototype.getFormOption = function() { 
	var formOptions = {
		  dataObj : null   						//要傳送給後端的參數(json格式)
		, formMethod : 'POST'					//request的形態
		, formObj : null						//指定要將哪個form的內容轉成dataObj(層級大於dataObj)
		, url : null							//request的業面
		, sqlid: null
		, onSuccess : function (jsonResult) {}	//ajax成攻回來後要做的事情(jsonResult是後端傳送回來的資料)
		, onError: function (jsonResult) {}
		, async: false
		, autoClassProcess: true
		, expcolumn: null
	};
	
	return formOptions;
};

FormUtil.prototype.setItemDataFromTag = function($item){
	var owner = typeof($item.attr("owner"))=="string" ? $item.attr("owner") : ( typeof(gowner)=="string" ? gowner : "W");
	var url = typeof($item.attr("url"))=="string" ? $item.attr("url") : "";
	var tab = typeof($item.attr("tab"))=="string" ? $item.attr("tab") : "";
	var key = typeof($item.attr("key"))=="string" ? $item.attr("key") : "";
	var changeby = typeof($item.attr("changeby"))=="string" ? $item.attr("changeby") : "";
		
	if( tab != "" ) {
		dataObj = "";
		if( changeby != "" ) {
			dataObj = "owner:"+owner+"tab:"+tab+",key:"+key;
		}		
	}else{
		dataObj = {};
		if( changeby != "" ) {
			$form = formUtil.getParent($item, "form");
			names = changeby.split(",");
			for(var i=0;i<names.length;i++) {
				dataObj[names[i]] = $("[name="+names[i]+"]", $form).val();
			}
		}	
	}	
	if( $item.attr("dataObj")==null || $item.attr("dataObj")!=JSON.stringify(dataObj) ) {
		var data = [];
		if( tab!= "" ) {
			data = tabledbUtil.getList(owner, tab, key);
		}else{
			data = formUtil.getAjAxData({url: url, dataObj: dataObj})
		}		
		$item.data("data", data).attr("dataObj", JSON.stringify(dataObj));
	}
}

FormUtil.prototype.submitTo = function (customerOption){

	var formOption = $.extend({}, formUtil.getFormOption(), customerOption);
	if( formOption.url != null && formOption.url!="" && formOption.url.indexOf("/")!=0 ) {
		formOption.url = formUtil.getWebRoot() + formOption.url;
	}	
	
	if( formOption.formObj != null ) {	
		$(":text,:password", formOption.formObj).blur();
		$("div[targetname]", formOption.formObj).each(function(){			
			var name=$(this).attr("targetname");
			$("textarea[name="+name+"]").html($(this).html())
		});
	}
	
	if( formOption.expcolumn != null && formOption.formObj != null ) {
		
		if( formOption.url != null) {			
			formOption.formObj.attr("action", formOption.url);
		}
		if( $("[name=expcolumn]", formObj).length==0 ) {
			$("<input type='hidden' name='expcolumn'>").appendTo(formObj);
		}
		$("[name=expcolumn]", formObj).val( JSON.stringify(formOption.expcolumn) )
		if( $("iframe[name=hiddeniframe]").length==0 ) {
			$iframe = $("<iframe name='hiddeniframe' style='display:none;'></iframe>").appendTo($("body"))
		}
		formOption.formObj[0].target = "hiddeniframe";
		formOption.formObj[0].submit();		
		
	}else if (formOption.formObj != null && typeof(formOption.formObj.attr("enctype"))=="string" && formOption.formObj.attr("enctype").toUpperCase()=="MULTIPART/FORM-DATA") {
	
		if( formOption.url != null) {			
			formOption.formObj.attr("action", formOption.url);
		}
		
		if( $("iframe[name=hiddeniframe]").length==0 ) {
			$iframe = $("<iframe name='hiddeniframe' style='display:none;'></iframe>").appendTo($("body"))
		}		

		if( formOption.async ) {
			try {helpUtil.showProcessBar();} catch(e) {}
		}
		
		$iframe = $("iframe[name=hiddeniframe]");
		$iframe.unbind("load");
		$iframe.load(function(){
			$iframe.unbind("load");
			response = $(this).contents().find("body").html();
			var JsonData = typeof(response)=="object" ? response : $.parseJSON(response);
	    	if( JsonData.status=="SUCCESS" ) {
	    		if( typeof(formOption.onSuccess)=="function" )
	    			formOption.onSuccess(JsonData);
	    	} else if( JsonData.status=="ERROR") {
	    		if( typeof(JsonData.messageText)=="string")
	    			helpUtil.showInfoBar("INFO", JsonData.messageText, 5000);
	    		else if( typeof(JsonData.data)=="string")
	    			helpUtil.showInfoBar("INFO", JsonData.data, 5000);
	    		
	    		if(typeof(formOption.onError) == "function")
	    			formOption.onError(JsonData);
	    	} else if( JsonData.status=="NULL" ) {
	    		top.window.document.location.href = formUtil.getWebRoot() + 'INDEX.jsp';
	    	} else {
	    		try {
		    		helpUtil.showInfoBar("INFO", JsonData.messageText, 8000);
	    		} catch(e) {
	    			alert(JsonData.messageText);
	    		}
	    		formOption.onError(JsonData);
	    	}	
	    	if( formOption.async && formOption.autoClassProcess ) {
	    		try {helpUtil.closeProcessBar();} catch(e) {}
	    	}		    
		})
		
		formOption.formObj[0].target = "hiddeniframe";
		formOption.formObj[0].submit();		
	}else{	
		if (formOption.formObj != null) {
			formOption.dataObj = formUtil.Form2Json(formOption.formObj)
		}
		
		if (formOption.sqlid != null) {
			formOption.dataObj["sqlid"] = formOption.sqlid;
		}
		
		if( formOption.async ) {
			try {helpUtil.showProcessBar();} catch(e) {}
		}
		$.ajax({
			url: formOption.url,
			type: formOption.formMethod,
		    data: formOption.dataObj,
		    async: formOption.async,
		    contenttype : "application/x-www-form-urlencoded; charset=utf-8",
		    error: function(xhr) {
		    	dialogUtil.openDialog({
		    		title: "發生錯誤",
		    		html: xhr.responseText
		    	})		    	
		    	if( formOption.async && formOption.autoClassProcess ) {
		    		try {helpUtil.closeProcessBar();} catch(e) {}
		    	}	
		    },
		    success: function(response) {
		    	var JsonData = typeof(response)=="object" ? response : $.parseJSON(response);
		    	if( JsonData.status=="SUCCESS" ) {
		    		if( JsonData.messageText!="" ) {
		    			try {helpUtil.showInfoBar("INFO", JsonData.messageText);} catch(e) {}
		    		}
		    		if( typeof(formOption.onSuccess)=="function" )
		    			formOption.onSuccess(JsonData);
		    	} else if( JsonData.status=="ERROR" ) {
		    		
		    		if( typeof(JsonData.messageText)=="string")
		    			helpUtil.showInfoBar("INFO", JsonData.messageText, 8000);
		    		else if( typeof(JsonData.data)=="string")
		    			helpUtil.showInfoBar("INFO", JsonData.data, 8000);
		    		
		    		if(typeof(formOption.onError) == "function")
		    			formOption.onError(JsonData);
		    		
		    	} else if( JsonData.status=="NULL" ) {
		    		top.window.document.location.href = formUtil.getWebRoot() + 'INDEX.jsp';
		    	} else {
		    		try {
			    		helpUtil.showInfoBar("INFO", JsonData.messageText, 8000);
		    		} catch(e) {
		    			alert(JsonData.messageText);
		    		}
		    		formOption.onError(JsonData);
		    	}	
		    	if( formOption.async && formOption.autoClassProcess ) {
		    		try {helpUtil.closeProcessBar();} catch(e) {}
		    	}		    		
		    }
		});
	}
};

FormUtil.prototype.getData = function (dataObj, url, onSuccess) {
	var formOptions = formUtil.getFormOption();
	formOptions.url = url;
	formOptions.dataObj = dataObj;	
	if (onSuccess != null) {
		formOptions.onSuccess = onSuccess;
	}
	formUtil.submitTo(formOptions);
};


FormUtil.prototype.getAjAxData = function(options) {
	var retdata = null;
	options.onSuccess = function(jsonResult){
		retdata = jsonResult.data;
	} 
	formUtil.submitTo(options)
	return retdata;
}

/**
 * @description 將formObj物件裡的欄位，變成Json的格式
 * @ignore
 * @private
 * */
FormUtil.prototype.Form2Json = function (formObj) {
	
	var json = {}; 
	
	$("input[name]", formObj).each(function(){			
		var type = $(this).attr("type").toLowerCase();
		var name = $(this).attr("name");
		var value= $(this).val();
		
		if( type=="hidden" || type=="text" || type=="password" ) {
			setKeyValue(name, value);
		}else if( type=="checkbox") {
			if( $(this)[0].checked )
				setKeyValue(name, value);
		}else if( type=="radio") {			
			if( $(this)[0].checked ) {
				setKeyValue(name, value);
			}
		}
	});
	
	$("textarea[name]", formObj).each(function(){
		var name=$(this).attr("name");
		var value= $(this).val();		
		setKeyValue(name, value);
	});
	
	$("select[name]", formObj).each(function(){	
		var name=$(this).attr("name");
		if( $(this)[0].type=="select-one" ) {
			setKeyValue(name, $(this).val());
		} else { 
			$("option:selected", $(this)).each(function(){
				setKeyValue(name, $(this).val());
			});
		}
	});
	
	function setKeyValue(k, v) {
		if( k!="" ) {
			var type = (typeof json[k]);
			if( type=="undefined")
				json[k]=(v);
			else if(type=="string") {
				var org = json[k];
				json[k] = new Array();
				json[k][0] = org;
				json[k][1] = (v);
			} else if(type=="object") {
				json[k][json[k].length] = (v);
			}
		}		
	}
	
	return json;
}

/**
 * @description 將formObj物件裡的欄位，變成GET參數內容
 * @ignore
 * @private
 * */
FormUtil.prototype.Form2QueryString = function (formObj) {
	
	var json = "";	
	
	$("input", formObj).each(function(){			
		var type = $(this).attr("type").toLowerCase();
		var name=$(this).attr("name");
		var value=$(this).val();		
		
		if( type=="hidden" || type=="text" || type=="password" ) {
			setKeyValue(name, value);
		}else if( type=="checkbox") {
			if( $(this)[0].checked )
				setKeyValue(name, value);
		}else if( type=="radio") {			
			if( $(this)[0].checked ) {
				setKeyValue(name, value);
			}
		}
	});
	
	$("textarea", formObj).each(function(){
		var name=$(this).attr("name");
		var value=$(this).val();	
		setKeyValue(name, value);
	});
	
	$("select", formObj).each(function(){	
		var name=$(this).attr("name");
		if( $(this)[0].type=="select-one" ) {
			setKeyValue(name, $(this).val());
		} else {
			$("option[selected]", $(this)).each(function(){
				setKeyValue(name, $(this).val());
			});
		}
	});
	
	function setKeyValue(k, v) {
		if( json!="")
			json += "&";
		json += k + "=" + (v);	
	}
	
	return json;
}

/**
 * @description form表單資料自動對應
 * @ignore
 * @private
 * */
FormUtil.prototype.bindObjectData = function(obj, value, datamapping) {
	try {		
		if (obj.get(0).tagName.toLowerCase() == 'input') {
			if (obj.attr('type').toLowerCase() == 'radio') {
				formUtil.radioDataBind(obj, value);
			} else if (obj.attr('type').toLowerCase() == 'checkbox') {
				formUtil.checkBoxDataBind(obj, value);
			} else {
				formUtil.textDataBind(obj, value);
			}
		} else if (obj.get(0).tagName.toLowerCase() == 'select') {
			formUtil.selectDataBind(obj, value);
		} else if (obj.get(0).tagName.toLowerCase() == 'textarea') {
			formUtil.textareaDataBind(obj, value);
		} else if (obj.get(0).tagName.toLowerCase() == 'span') {
			formUtil.spanDataBind(obj, value, datamapping);
		}
	} catch(e) {}
}

/**
 * @description form表單資料自動對應
 * @ignore
 * @private
 * */
FormUtil.prototype.bindFormData  = function (formObj, jsonData, datamapping) {
	for (var attrName in jsonData) {
		try {
			var obj = $("[id="+attrName+"]", formObj);			
			if( obj.length==0 )
				obj = $("[name="+attrName+"]", formObj);
			
			for(var i=0;i<obj.length;i++) {
				formUtil.bindObjectData($(obj.get(i)), jsonData[attrName], datamapping);
			} 
		} catch(e) {alert(Exception )}
	}
};

/**
 * @description 表單資料自動對應
 * @ignore
 * @private
 * */
FormUtil.prototype.bindData  = function (jsonData, datamapping) {
	for (var attrName in jsonData) {
		try {
			var obj = $("[id="+attrName+"]");
			if( obj.length==0 )
				obj = $("[name="+attrName+"]");
			
			if( obj.length>0 ) {
				formUtil.bindObjectData(obj, jsonData[attrName], datamapping);
			}
		} catch(e) {}
	}
};

/**
 * @ignore 
 * @private
 * */
FormUtil.prototype.textDataBind = function (obj, val) {
	try {
		if (typeof(val) == 'object') {
			val = val.val();
		}
		
		obj.val(val);
	} catch(e) {}
};

/**
 * @ignore 
 * @private
 * */
FormUtil.prototype.radioDataBind = function (obj, val) {
	try {
		if (typeof(val) == 'object') {
			val = val.val();
		}		
		obj.removeAttr("checked");		
		obj.each(function(i, e){
			if(this.value==val){
				this.checked = true;  
			}
		});
	} catch(e) {}
};

/**
 * @description 設定核取方塊(多選)之核取選項
 * @param {jQuery} obj 核取方塊
 * @param {string/jQuery} val 核取方塊選取之值
 * @example
 * 	formUtil.checkBoxDataBind($('#editForm [name=INTEREST]'),$('#editForm [name=INTEREST_CODE]'));
 * */
FormUtil.prototype.checkBoxDataBind = function (obj, val) {
	try {
		if (typeof(val) == 'object') {
			val = val.val();
		}
		def_value = val.split(',');
		
		obj.removeAttr("checked");		
		for (var j = 0 ; j < def_value.length ; j++) {
			obj.each(function(i, e){
				if( this.value == def_value[j]){
					this.checked = true;
				}
			});
		}
		
	} catch(e) {
		try {
			obj.each(function(i, e){
				if( this.value == val){
					this.checked = true;
				}
			});
		} catch(e) {}
	}
};


FormUtil.prototype.getValues = function (obj) {
	ret = "";
	obj.each(function(){
		if( ret!="" )
			ret += ",";
		ret += this.value;
	})
	return ret;
};

/**
 * @ignore 
 * @private
 * */
FormUtil.prototype.selectDataBind = function (obj, val) {
	try {
		if (typeof(val) == 'object') {
			val = val.val();
		}
		
		$("option", obj).removeAttr("selected");
		
		if( obj[0].type=="select-one" ) {
			obj.val(val);
		}else{
			var valary = val.split(",");
			for(var i=0;i<valary.length;i++) {
				if( valary[i]!="" && $("option[value='"+valary[i]+"']", obj).length>0 )
					$("option[value='"+valary[i]+"']", obj)[0].selected=true;
			}
		}
	} catch(e) {
	}
};

/**
 * @ignore 
 * @private
 * */
FormUtil.prototype.textareaDataBind = function (obj, val) {
	try {
		if (typeof(val) == 'object') {
			val = val.val();
		}
		
		if( obj.prev() && obj.attr('editor')!=null && obj.prev().attr('targetname')== obj.attr('name')){
			obj.prev().html(val);
		}else{
			obj.val(val);
	    }
	} catch(e) {}
};

/**
 * @ignore
 * @private 
 * */
FormUtil.prototype.spanDataBind = function (obj, val, datamapping) {
	try {
		if (typeof(val) == 'object') {
			val = val.val();
		}
		if( typeof(obj.attr("datamapping"))=="string" && typeof(datamapping)=="object" ) {
			if( typeof(obj.attr("multi"))=="undefined" || obj.attr("multi")!="Y" ) {
				val = [val]
			}else{
				val = val.split(",")
			}
			fval = "";
			for(var i=0;i<val.length;i++) {
				if(fval!="")
					fval+=",";
				fval += strUtil.getMappingData(datamapping, obj.attr("datamapping"), val[i]);
			}
			val = fval;
		}else if( typeof(obj.attr("format"))=="string" ) {
			val = strUtil.getFormatStr(val, obj.attr("format"));
		}
		obj.html(val);
	} catch(e) {}
}; 

FormUtil.prototype.getParent = function(obj, tagname){	
	$ret = obj;
	do{
		$ret = $ret.parent();
	}while( $ret.get(0).tagName.toLowerCase()!=tagname );
	return $ret;
}

/**
 * @description 清除表單資料
 * */
FormUtil.prototype.clearFormData = function (formObj) {
	var _fromObj = formObj;

	$('select', _fromObj).val('');
	$('input:text', _fromObj).val('');
	$('input:password', _fromObj).val('');
	$('input:radio', _fromObj).removeAttr('checked');
	$('input:checkbox', _fromObj).removeAttr('checked');
	$('textarea', _fromObj).val('');
	$('div[targetname]', _fromObj).html('');
};

FormUtil.prototype.changeToSpan = function($obj) {
	if( $obj.get(0).tagName.toLowerCase() != "span" ) {
		$span = $("<span></span>").insertAfter($obj); 
		$span.attr("name", $obj.attr("name"));
		if( typeof($obj.attr("key"))=="string" )
			$span.attr("datamapping", $obj.attr("key").toLowerCase());
		if( typeof($obj.attr("datamapping"))=="string" )
			$span.attr("datamapping", $obj.attr("datamapping").toLowerCase());
		if( typeof($obj.attr("format"))=="string" )
			$span.attr("format", $obj.attr("format"));
		$obj.remove();
	}
}

//globe object
var formUtil = new FormUtil();