/**
 * @description 所有關於頁框的操作皆使用此共用元件，包含了表單資料送出與表單資料繫結。
 * @class 頁框工具
 * @author chkchk
 * @constructor
 */
function UiFrameset(framesetObj) {
	this._framesetObj = framesetObj;
	this._pname = "";
	this._nname = "";
	this._options = [];
}

/**
 * @ignore 增加頁框
 * */
UiFrameset.prototype.addFrame = function(options) {
	var _frameSetObj = this._framesetObj;
	this._options = options;
	try {
		var defWidth = "100%";
		var defHeight = "100%";
		$.each(options, function(index, element){
			var _newFrame = $("<iframe id='"+element.frameName+"' "+( $("form").length==0 ? "src='"+element.frameSrc+"'" : "" )+ " name='"+element.frameName+"'></iframe>").appendTo(_frameSetObj);
			_newFrame.attr('marginwidth', 0);
			_newFrame.attr('frameborder', 0); 
			_newFrame.attr('scrolling', 'auto'); 
			_newFrame.attr('width', defWidth);
			_newFrame.attr('height', defHeight);
			_newFrame.css('border-bottom', '1px solid');

			if( $("form").length==0 ) {
				//frames[element.frameName].location.href = element.frameSrc;
			}else{
				$("form")[0].target = element.frameName;
				$("form")[0].action = element.frameSrc;
				$("form")[0].submit();
			}
		});
	} catch(e) {
		alert(e);
	}
}; 

UiFrameset.prototype.reloadFrame = function(options) {
	var _frameSetObj = this._framesetObj;
	try {
		if( $("form").length==0 )
			$("<form></form>").appendTo($("body"));
		$("form")[0].target = options.frameName;
		$("form")[0].action = options.frameSrc;
		$("form").empty();
		for (var attrName in options.dataObj) {
			$hidden = $("<input type='hidden' name='"+attrName+"'>").appendTo($("form"))
				.val(options.dataObj[attrName]);			
		}
		$("form")[0].submit();
	} catch(e) {
		alert(e);
	}
};

/**
 * @description 移除頁框
 * @param {string} name 欲移除的頁框名稱
 * @example 
 * 	uiFrameset.removeFrame('v2');
 * */
UiFrameset.prototype.removeFrame = function(name) {
	var _frameSetObj = this._framesetObj;
	$('iframe[name=' + name + ']', _frameSetObj).remove();
};

/**
 * @description 切換頁框
 * @param {string} name 欲切換的頁框名稱
 * @example 
 * 	uiFrameset.switchFrame('v2');
 * */
UiFrameset.prototype.switchFrame = function(name) {
	var _frameSetObj = this._framesetObj;
	$('iframe[name=' + name + ']', _frameSetObj).show().focus();
	$('iframe[name!=' + name + ']', _frameSetObj).hide();
};

/**
 * @description 切換頁框
 * @param {string} obj 欲顯示的頁框名稱與高度
 * @example 
 * 	uiFrameset.switchFrames({'v1':'30%', 'v2':'70%'});
 * */
UiFrameset.prototype.switchFrames = function(obj) {
	var _frameSetObj = this._framesetObj;

	var _myFrameSetJson = $.parseJSON(document.getElementById('__page.frameSet').value);	
	$('iframe[name]', _frameSetObj).hide();
	for (var name in obj) {
		for(var i=0;i<_myFrameSetJson.length;i++) {
			if( _myFrameSetJson[i].frameName==name )
				_myFrameSetJson[i].height=obj[name];
		}
		$('iframe[name=' + name + ']', _frameSetObj).show().attr('height', obj[name]);
	}
	document.getElementById('__page.frameSet').value = JSON.stringify(_myFrameSetJson);
	$(window).resize();
};

/**
 * @description 切換頁框後執行某函式
 * @param {string} name 欲切換的頁框名稱
 * @param {string} action 切換頁框後所要執行的函式
 * @param {map} [param=null] 函式的參數
 * @example 
 *  要切換至v2後執行processEdit則在v2必須定義processEdit函式
 * 	uiFrameset.switchFrameWithExecute('v2', 'processEdit', jsonResult); 
 * */ 
UiFrameset.prototype.switchFrameWithExecute = function(name, action, param) {
	if (action != null) {
		try {
			if (param == null) {
				eval("frames['"+name+"']." + action + "()");
			} else {
				eval("frames['"+name+"']." + action + "(param)");
			}
		} catch(ignore) {
			alert(ignore);
		}
	}
	
	this.switchFrame(name);
};

/**
 * @description 執行某頁框的某函式
 * @param {string} name 欲切換的頁框名稱
 * @param {string} action 切換頁框後所要執行的函式
 * @param {map} [param=null] 函式的參數
 * @example 
 *  要切換至v2後執行processEdit則在v2必須定義processEdit函式
 * 	uiFrameset.FrameWithExecute('v2', 'processEdit', jsonResult); 
 * */ 
UiFrameset.prototype.executeFrameFunction = function(name, action, param) {
	if (action != null) {
		try {
			if (param == null) {
				eval("frames['"+name+"']." + action + "()");
			} else {
				eval("frames['"+name+"']." + action + "(param)");
			}
		} catch(ignore) {
			alert(ignore);
		}
	}
};

UiFrameset.prototype.showMultiFrame = function(options) {

	var _frameSetObj = this._framesetObj;
	$('iframe[name]', _frameSetObj).hide();
	
	if( Array.isArray(options) ) {
		for(var i=0;i<options.length;i++ ) {
			if( typeof(options[i].height)=="string" )
				$('iframe[name=' + options[i].frameName + ']', _frameSetObj).show().attr('height', options[i].height);
		}
	}
};

var _uiFrameset = new UiFrameset();