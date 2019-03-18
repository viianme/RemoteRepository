
/**
 * @description 所有關於form的操作皆使用此共用元件，包含了表單資料送出與表單資料繫結。
 * @class 表單工具
 * @author chkchk
 * @constructor
 */
function StrUtil() {
}

StrUtil.prototype.getFormatStr = function(text, dataFormat) {	
	var dataFormat = dataFormat.toLowerCase();
	if( dataFormat=="DT" || dataFormat=="dt" ) {
		text = strUtil.formatDate(text);
	}else if( dataFormat=="TM" || dataFormat=="tm" ) {
		text = strUtil.formatTime(text);
	}else if( dataFormat=="DTTM" || dataFormat=="dttm" ) {
		if( text.length==7 || text.length==8 ) {
			text = strUtil.formatDate(text);
		}else if( text.length==11 ) {
			text = strUtil.formatDate(text.substring(0, 7)) + " " + strUtil.formatTime(text.substring(7));
		}else if( text.length==12 ) {
			text = strUtil.formatDate(text.substring(0, 8)) + " " + strUtil.formatTime(text.substring(8));
		}else if( text.length==13 ) {
			text = strUtil.formatDate(text.substring(0, 7)) + " " + strUtil.formatTime(text.substring(7));
		}else if( text.length==14 ) {
			text = strUtil.formatDate(text.substring(0, 8)) + " " + strUtil.formatTime(text.substring(8));
		}
	}else if( dataFormat=="FILESIZE" || dataFormat=="filesize" ) {
		text = strUtil.formatFileSize(text);
	}else if( dataFormat=="MONEY" ||  dataFormat=="money" ) {
		text = strUtil.formatMoney(text);
	}else if( dataFormat=="NUM" ||  dataFormat=="num" ) {
		text = strUtil.formatNumber(text);
	}else if( dataFormat=="BR" ||  dataFormat=="br" ) {
		text = text.replace(new RegExp("\n", 'g'), "<br>");;
	}
	return text;
}

StrUtil.prototype.formatDate=function(date, keep)
{
	if(keep!=null && keep)
		return date;
	else
		return date.replace(/(\d)(?=(\d{2})+(?!\d))/g, "$1/").replace("/","");
}

StrUtil.prototype.formatTime=function(time)
{	
	return time.replace(/(\d)(?=(\d{2})+(?!\d))/g, "$1:");
}

StrUtil.prototype.formatFileSize=function(size)
{	
	try {		
		if( size != "" ) {
			unit = "B";
			size = size*1;
			if( size>1024 ) {
				unit = "KB";
				size = size/1024;
				if( size>1024 ) {
					unit = "MB";
					size = size/1024;
				}
			}
			size = Math.round(size*10)/10;
			size = size + unit;
		}
	} catch(e) {}
	return size;
}

StrUtil.prototype.formatMoney=function(money)
{	
	return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}



StrUtil.prototype.formatNumber = function(number) {
	
	if(isNaN(number)) {
		number =   "0";
	}
	var fixnum = new Number(parseFloat(number)).toFixed(2);
	return  fixnum.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

StrUtil.prototype.getMappingData = function(datamapping, map, key) {
	var text = ""; 
	if( typeof(map)=="string" && datamapping!=null && typeof(datamapping[map])=="object" ) {
		if( typeof(datamapping[map][key])=="string" )
			text = datamapping[map][key];
		else if( typeof(datamapping[map]["_other"])=="string" )
			text = datamapping[map]["_other"];
	}
	return text; 
}

StrUtil.prototype.tranPattern = function(pattern, para, datamapping) {
	if( typeof(pattern)=="string" ) {
		return strUtil.tranPatternStr(pattern, para, datamapping);
	}else if( typeof(pattern)=="function" ) {
		return strUtil.tranPatternStr(pattern(para), para, datamapping);
	}
}

StrUtil.prototype.tranPatternStr = function(pattern, para, datamapping) {
	
	while( getForEachStr(pattern) != "" ) {
		var Foreach = getForEachStr(pattern);
		var condition = getMark(Foreach, "item=\"", "\"");
		var InTxt = Foreach.substr(Foreach.indexOf(">")+1, Foreach.length-11-Foreach.indexOf(">"))
		var obj = getMark(condition, "@{", "}");
		if( typeof(para[obj])=="object" && InTxt!="" ) {			
			replacetxt = "";
			for(var i=0;i<para[obj].length;i++) {
				replacetxt += strUtil.tranPatternStr(InTxt, para[obj][i], datamapping);
			}
			pattern = pattern.replace(Foreach, replacetxt);
		}else{
			pattern = pattern.replace(Foreach, "");
		}
	}
	
	while( getIfStr(pattern)!="" ) {
		var If = getIfStr(pattern);
		var condition = getMark(If, "condition=\"", "\"");
		var InTxt = If.substr(If.indexOf(condition)+condition.length+2, If.length-6-(If.indexOf(condition)+condition.length+1));
		if( condition!="" ) {
			condition = strUtil.tranPatternStr(condition, para, datamapping);
			if(  eval(condition) ) {
				pattern = pattern.replace(If, InTxt);
			}else{
				pattern = pattern.replace(If, "");
			}			
		}else{
			pattern = pattern.replace(If, "");
		}		
	}
	
	while( getMark(pattern, "@{", "}") != "" ){
		var Key = getMark(pattern, "@{", "}");
		if( Key.indexOf(":")==-1 && Key.indexOf("-")==-1 )
			pattern = pattern.replace("@{"+Key+"}", para[Key]);
		else if( Key.indexOf(":")>-1 ){
			format = Key.split(":")[1];
			Key = Key.split(":")[0]; 
			if( typeof(para[Key])=="string" || typeof(para[Key])=="number" ) {
				pattern = pattern.replace("@{"+Key+":"+format+"}", strUtil.getFormatStr(para[Key], format));
			}else{
				pattern = pattern.replace("@{"+Key+":"+format+"}", "");
			}
		}else if( Key.indexOf("-")>-1 ){
			if( typeof(datamapping)!="object") {
				map = Key.split("-")[1];
				Key = Key.split("-")[0];
				pattern = pattern.replace("@{"+Key+"-"+map+"}", para[Key]);
			}else{
				map = Key.split("-")[1];
				Key = Key.split("-")[0];
				pattern = pattern.replace("@{"+Key+"-"+map+"}", strUtil.getMappingData(datamapping, map, para[Key]));
			}
		}
	}
	
	function getIfStr(pattern) {
		var If = "";
		If = "<if " + getMark(pattern, "<if ", "</if>") + "</if>";		
		return If=="<if </if>" ? "" : If;
	}
	
	function getForEachStr(pattern) {
		var foreach = "";
		foreach = "<foreach " + getMark(pattern, "<foreach ", "</foreach>") + "</foreach>";
		return foreach=="<foreach </foreach>" ? "" : foreach;
	} 
	
	function getMark(pattern, s, e) {
		var k = "";
		if( pattern.indexOf(s) > -1 ) {
			k = pattern;
			k = k.substr(k.indexOf(s)+s.length);
			if( k.indexOf(e) > -1)
				k = k.substr(0, k.indexOf(e));
			else 
				k = "";
		}
		return k;		
	}
		
	function getInTxt(mark, condition, e){
		mark = mark.substr(mark.indexOf(condition)+condition.length);
		mark = mark.substr(mark.indexOf(">")+1);
		mark = mark.substr(0, mark.indexOf("</"+e+">"));
		return mark;
	}
		
	function getCondition(mark){
		var k = "";
		if( mark.indexOf("[") > -1 ) {
			k = mark;
			k = k.substr(k.indexOf("[")+1);
			if( k.indexOf("]") > -1)
				k = k.substr(0, k.indexOf("]"))
			else 
				k = "";
		}
		return k;
	}
	
	return pattern;	
}

StrUtil.prototype.checkFilter = function(data, filter) {
	var ret = true;
	if( filter != null ) {
		if( typeof(filter)=="object" ) {
			for (var key in filter) {
				if( typeof(data[key])!="string" || data[key] != filter[key] ) {
					ret = false;
					break;
				}
			}
		}else if( typeof(filter)=="string" ) {
			ret = eval( strUtil.tranPattern(filter,data) );
		}
	}else
		ret = false;
	return ret;
}

//前置補零
StrUtil.prototype.addNum = function(obj,limit) {
	var s = obj.val();
	var temp = '';
	if(isNaN(s) && s!='' ) {
		helpUtil.showInfoBar("INFO","請輸入數字型態值");
		obj.val('001');
	} else {
		if (s != ''){
			for (i=0;i<(limit-parseInt(s.length));i++){
				temp = temp + '0';
			}
		}							
		obj.val(temp + s);
	}
}

StrUtil.prototype.addZero = function(str,limit) {
	str = str+"";
	while( str.length<limit ) {
		str = "0" + str; 
	}
	return str;
}


StrUtil.prototype.change_pattern = function(json,key,value,searchStr,keyinput,valueinput) {	
	var retVal = false;
	if ( isNaN(searchStr)==false){
		searchStr = parseInt(searchStr);
	}	
	for(var a in json){

			 var val1 = json[a][key];
			 var val2 = json[a][value];
			 
			 if ( isNaN(val1)==false ){
				 val1 = parseInt(val1);
			 }

			 if (( searchStr== val1) || (searchStr==val2) ){
				 
				 if (keyinput!=null &&  typeof(keyinput)=='object'){
					 keyinput.val(val1);
				 }
					 
				 if ( valueinput!=null && typeof(valueinput)=='object')
				 	valueinput.val(val2);
				 
				 retVal = true;
				 break;
			 }
	}

	return retVal;
	

}

//globe object
var strUtil = new StrUtil();