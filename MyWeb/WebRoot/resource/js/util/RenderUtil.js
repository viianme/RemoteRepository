
/**
 * @description 屬於給予select checkbox radio內容的工具
 * @class 表單工具
 * @author sorge
 * @constructor
 */
function RenderUtil() {
}

RenderUtil.prototype.getRenderOption = function() { 
	var renderOptions = {		
		  targetObj: null		//哪一個物件(select checkbox radio)
		, valuepattern : ''		//value顯示的樣板
		, textpattern: ''		//text顯示的樣板
		, attrpattern: ''		//屬姓(如 align='center' )
		, blurpattern: ''
		, data : {}				//JSON格式的資料集
		, isClear: true			//是否先清除在重畫資料
		, haveall : false		//是否有 value=空白的項目
		, allText : "全部"		//(適用 targetObj=select時使用) value=空白那筆的顯示字串
		, defaultValue: null	//資料重畫好之後，預設值是什麼
		, numOfLine: 0			//美航幾個(0表是不設)
		, filter: null
		, datamapping: null
	};
		
	return renderOptions;
};

RenderUtil.prototype.renderObject = function(options) {	
	var renderOption = $.extend({}, renderUtil.getRenderOption(), options);
	
	if( renderOption.targetObj != null ) {
		
		if( typeof(renderOption.data)=="string" ) {
			renderOption.valuepattern = "@{TXT}";
			renderOption.textpattern = "@{TXT}";
			var ary = renderOption.data.split(",");			
			renderOption.data = [];
			for(var i=0;i<ary.length;i++) {
				renderOption.data.push({"TXT":ary[i]});
			} 
		}
		
		if( renderOption.targetObj[0].type=="checkbox" )
			renderUtil.renderCheckBoxHtml(renderOption);
		else if( renderOption.targetObj[0].type=="radio" )
			renderUtil.renderRadioHtml(renderOption);
		else if( renderOption.targetObj[0].type=="select-one" || renderOption.targetObj[0].type=="select-multi" || renderOption.targetObj[0].type=="select-multiple")
			renderUtil.renderOptionHtml(renderOption);
	}
}

RenderUtil.prototype.renderCheckBoxHtml = function(options) { 
	var renderOption = $.extend({}, renderUtil.getRenderOption(), options);

	if( renderOption.targetObj != null ) {
		
		var name = renderOption.targetObj[0].name;
		var id = renderOption.targetObj[0].id;
				
		if ( renderOption.targetObj.parent().get(0).tagName.toLowerCase()=="span" && renderOption.targetObj.parent().get(0).id=="render_"+name ) {
			$span = renderOption.targetObj.parent();
			$span.html("");
		}else if ( renderOption.targetObj.parent().parent().get(0).tagName.toLowerCase()=="span" && renderOption.targetObj.parent().parent().get(0).id=="render_"+name ) {
			$span = renderOption.targetObj.parent().parent();
			$span.html("");
		}else{
			$span = $("<span id='render_"+name+"'></span>").insertBefore($(renderOption.targetObj[0]));
			renderOption.targetObj.remove();
		}
		
		for(var i=0;i<renderOption.data.length;i++) {			
			if( renderOption.filter == null || strUtil.checkFilter(renderOption.data[i], renderOption.filter) ) {		
				var value = strUtil.tranPattern(renderOption.valuepattern, renderOption.data[i], renderOption.datamapping);
				var text = strUtil.tranPattern(renderOption.textpattern, renderOption.data[i], renderOption.datamapping);		
				var attr = strUtil.tranPattern(renderOption.attrpattern, renderOption.data[i], renderOption.datamapping);			
				
				$checkbox = $("<input type='checkbox' id='"+id+"' name='"+name+"' "+attr+">").attr("value", value).data("json", renderOption.data[i]);
				if( typeof(options.numOfLine)=="undefined" || options.numOfLine==0)
					$span.append($checkbox).append(text+" &nbsp;");
				else{
					var persent = Math.floor(98/options.numOfLine);
					$div = $("<div style='float:left;width:"+persent+"%'></div>").append($checkbox).append(text+" &nbsp;");
					$span.append($div);
				}
			}			
		}
		
		if( renderOption.defaultValue!=null )
			formUtil.bindObjectData($(":checkbox[name="+name+"]", $span), renderOption.defaultValue);
	}
}

RenderUtil.prototype.renderRadioHtml = function(options) { 
	
	var renderOption = $.extend({}, renderUtil.getRenderOption(), options);

	if( renderOption.targetObj != null ) {

		var name = renderOption.targetObj[0].name;
		var id = renderOption.targetObj[0].id;
				
		if ( renderOption.targetObj.parent().get(0).tagName.toLowerCase()=="span" && renderOption.targetObj.parent().get(0).id=="render_"+name ) {
			$span = renderOption.targetObj.parent();
			$span.html("");
		}else if ( renderOption.targetObj.parent().parent().get(0).tagName.toLowerCase()=="span" && renderOption.targetObj.parent().parent().get(0).id=="render_"+name ) {
			$span = renderOption.targetObj.parent().parent();
			$span.html("");
		}else{
			$span = $("<span id='render_"+name+"'></span>").insertBefore($(renderOption.targetObj[0]));
			renderOption.targetObj.remove();
		}

		if( renderOption.haveall )
			$span.append("<input type='radio' id='"+id+"' name='"+name+"' value=''>&nbsp;全部 &nbsp;");
		
		for(var i=0;i<renderOption.data.length;i++) {			
			if( renderOption.filter == null || strUtil.checkFilter(renderOption.data[i], renderOption.filter) ) {		
				var value = strUtil.tranPattern(renderOption.valuepattern, renderOption.data[i], renderOption.datamapping);
				var text = strUtil.tranPattern(renderOption.textpattern, renderOption.data[i], renderOption.datamapping);
				var attr = strUtil.tranPattern(renderOption.attrpattern, renderOption.data[i], renderOption.datamapping);
				
				$radio = $("<input type='radio' id='"+id+"' name='"+name+"' value='"+value+"' "+attr+">").data("json", renderOption.data[i]);		
				if( typeof(options.numOfLine)=="undefined" || options.numOfLine==0)
					$span.append($radio).append(text+" &nbsp;");
				else{
					var persent = Math.floor(98/options.numOfLine);
					$div = $("<div style='float:left;width:"+persent+"%'></div>").append($radio).append(text+" &nbsp;");
					$span.append($div);
				}
			}			
		}

		if( renderOption.defaultValue!=null )
			formUtil.bindObjectData($(":radio[name="+name+"]", $span), renderOption.defaultValue);
	}
}

RenderUtil.prototype.renderOptionHtml = function(options) { 
	var renderOption = $.extend({}, renderUtil.getRenderOption(), options);
	
	if( renderOption.targetObj != null ) {
		
		var obj = renderOption.targetObj;
		obj.hide();
		
		if(renderOption.isClear)
			obj.children().remove();

		if( obj.children().length==0 && renderOption.haveall )
			$("<option value=''>"+renderOption.allText+"</option>").appendTo(obj);

		for(var i=0;i<renderOption.data.length;i++) {			
			if( renderOption.filter == null || strUtil.checkFilter(renderOption.data[i], renderOption.filter) ) {			
				var value = strUtil.tranPattern(renderOption.valuepattern, renderOption.data[i], renderOption.datamapping);
				var text = strUtil.tranPattern(renderOption.textpattern, renderOption.data[i], renderOption.datamapping);
				var attr = strUtil.tranPattern(renderOption.attrpattern, renderOption.data[i], renderOption.datamapping);
				var blur = strUtil.tranPattern(renderOption.blurpattern, renderOption.data[i], renderOption.datamapping);
				var option = $("<option value='"+value+"' "+attr+">"+text+"</option>")
								.attr("json", JSON.stringify(renderOption.data[i]));
				if( renderOption.blurpattern!="" )
					option.attr("blurvalue", blur)
				obj.append(option);
			}			
		}
		
		if( renderOption.defaultValue!=null )
			formUtil.bindObjectData(renderOption.targetObj, renderOption.defaultValue);
		obj.show();
	}
}

//globe object
var renderUtil = new RenderUtil();