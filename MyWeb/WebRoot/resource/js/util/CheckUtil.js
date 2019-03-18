
/**
 * @description 所有關於form的操作皆使用此共用元件，包含了表單資料送出與表單資料繫結。
 * @class 表單工具
 * @author chkchk
 * @constructor
 */
function CheckUtil() {
}


CheckUtil.prototype.chkmsg = false;

CheckUtil.prototype.chkAlpha = function (obj) {
    for(i=0;i<obj.value.length;i++){
        var value=obj.value.charAt(i)
        if(value < "A" || value >"Z" && value < "a" || value > "z") {
            return false;
        }
    }
    return true;
};

CheckUtil.prototype.chkTime = function (obj) {
	var text = obj.value;	
	if( text=="" ) return true;
	if( text.length==4 )
		text = text + "00";
	text = text.substring(0,2)+":"+	text.substring(2,4)+":"+text.substring(4,6);
	text = text.replace(/[\:-]0?/g, ":");
	if (!text.match(/^\d{2}\:\d{1,2}\:\d{1,2}$/)) return false;
	var d = new Date("2011/01/01 " + text);
	return [d.getHours(), d.getMinutes(), d.getSeconds()].join(":") == text;
};

CheckUtil.prototype.chkDate = function (obj) {
	var text = obj.value;
	if( text=="" ) return true;
	if( text.length==5 )
		text = text + "01";
	if( text.length==7 )
		text = text*1+19110000+""; 
	text = text.substring(0,4)+"/"+	text.substring(4,6)+"/"+text.substring(6,8);
	text = text.replace(/[\/-]0?/g, "/");
	if (!text.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)) return false;
	var d = new Date(text);
	return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("/") == text;
};

CheckUtil.prototype.chkNum = function (obj) {
    if(isNaN(obj.value)){
        return false;
    }
    return true;
};

CheckUtil.prototype.chkEmail = function (obj) {
	if( obj.value!="" && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(obj.value))){
        return false;
	}
	else
		return true;
};

CheckUtil.prototype.chkId = function (obj) {
    //建立字母分數陣列(A~Z)  
	if( obj.value=="")
		return true;
    var city = new Array(  
         1,10,19,28,37,46,55,64,39,73,82, 2,11,  
        20,48,29,38,47,56,65,74,83,21, 3,12,30  
    )  
    var id = obj.value.toUpperCase();  
    // 使用「正規表達式」檢驗格式  
    if (id.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
        return false;  
    } else {  
        //將字串分割為陣列(IE必需這麼做才不會出錯)  
        id = id.split('');  
        //計算總分  
        var total = city[id[0].charCodeAt(0)-65];  
        for(var i=1; i<=8; i++){  
            total += eval(id[i]) * (9 - i);  
        }  
        //補上檢查碼(最後一碼)  
        total += eval(id[9]);  
        //檢查比對碼(餘數應為0);  
        return ((total%10 == 0 ));  
    }  
};

CheckUtil.prototype.checkType = function (chkType, obj) {
	var ret = true;
	var msg = "";
	switch(chkType){
		case "F":
			ret = checkUtil.chkNum(obj);
			checkUtil.msg = "抱歉！請輸入半形數字！";				
			break;
		case "Y":
			ret = checkUtil.chkNum(obj);
			checkUtil.msg = "抱歉！請輸入半形數字！";				
			break;
		case "T":
			ret = checkUtil.chkTime(obj);
			checkUtil.msg = "抱歉！請輸入正確的時間格式！";				
			break;
		case "H":
			ret = checkUtil.chkTime(obj);
			checkUtil.msg = "抱歉！請輸入正確的時間格式！";				
			break;
		case "D":
			ret = checkUtil.chkDate(obj);
			checkUtil.msg = "抱歉！請輸入正確的日期格式！";				
			break;
		case "M":
			ret = checkUtil.chkDate(obj);
			checkUtil.msg = "抱歉！請輸入正確的月份格式！";				
			break;
		case "A":
			ret = checkUtil.chkAlpha(obj);
			checkUtil.msg = "抱歉！請輸入英文字母！";			
			break;
		case "E":
			ret = checkUtil.chkEmail(obj);
			checkUtil.msg = "抱歉！無效的Email格式！";
			break;
		case "I":
			ret = checkUtil.chkId(obj);
			checkUtil.msg = "抱歉！無效的身分證字號！";
			break;	
		case "U":
			break;
	}
	if( !ret ) {
		$(obj).css("border-color", "red").css("border-style","solid").attr("title", msg);
	}
	return ret;
};

CheckUtil.prototype.formChangeCheck = function (formObj) {
	checkUtil.changeCheck(formObj);
	return checkUtil.formCheck(formObj);
}

CheckUtil.prototype.formCheck = function (formObj) {
	
	checkUtil.msg = "";
	var ret = true;	
	
	$("input,textarea,select", formObj).attr("chkerr", "N");
	$(":text,:password,textarea,select[check=U00],:file[check=U00]", formObj).each(function(){	
		checkUtil.msg = "";	 
		if( !checkUtil.objectCheck(this) ) {
			$(this).attr("chkerr", "Y");
			ret = false;
		}
	});
	
	$(":file[need][chkerr=N]", formObj).each(function(){		 
		var need = ","+$(this).attr("need")+",";
		if( this.value!="" ) {
			ext = this.value.substring(this.value.lastIndexOf(".")+1).toLowerCase();
			if( need.indexOf(","+ext+",")==-1 ) {
				checkUtil.msg = "抱歉！此檔案上傳欄位只能上傳附檔名為「"+$(this).attr("need")+"」的檔案";
				checkUtil.addHint(this, checkUtil.msg);
				ret = false;
			}else{
				checkUtil.removeHint(this);
			}
		}
	});
	
	if( typeof(formObj.attr("compareValue"))=="string" ) {
		var valueAry = formObj.attr("compareValue").split(",");
		for(var i=0;i<valueAry.length;i++) {
			v = valueAry[i];
			l = $(":text[compareValue="+v+"]").length;
			if( l%2==0 ){
				for(var j=0; j<l; j+=2) {
					sobj = $(":text[compareValue="+v+"]")[j];
					eobj = $(":text[compareValue="+v+"]")[j+1];
					field = v;
					
					if( $(sobj).attr("chkerr")=="N" && $(eobj).attr("chkerr")=="N" ) {
//						if( sobj.value=="" && eobj.value!="" ){
//							checkUtil.msg = "輸入「"+field+"」迄值時，起值不可為空白 ";
//							checkUtil.addHint(sobj, checkUtil.msg);
//							ret = false;
//						}else if( sobj.value!="" && eobj.value=="" ){
//							checkUtil.msg = "輸入「"+field+"」起值時，迄值不可為空白 ";
//							checkUtil.addHint(eobj, checkUtil.msg);
//							ret = false;
//						}else 
						if( (sobj.value!="" && eobj.value!="") && !(sobj.value*1 <= eobj.value*1) ){
							checkUtil.msg = "輸入「"+field+"」的起訖資料錯誤 ";
							helpUtil.showInfoBar("INFO","輸入「"+field+"」的起訖資料錯誤 ");
							checkUtil.addHint(sobj, checkUtil.msg);
							checkUtil.addHint(eobj, checkUtil.msg);
							ret = false;			
						}else{
							checkUtil.removeHint(sobj);
							checkUtil.removeHint(eobj);
						}
					}
				}
			}
		}		
	}
	
	if( !ret )
		helpUtil.showInfoBar("INFO","資料檢核不通過，請檢查畫面上紅色的輸入物件 ");
	return ret;
	
};

CheckUtil.prototype.objectCheck = function (obj) {
	var ret = true;
	if( ret && typeof($(obj).attr("check"))=="string" ) {
		var check = $(obj).attr("check");		
		var checkfun = $(obj).attr("checkfun");	
		var checkType = check.charAt(0);
		var allowNull = check.charAt(1);
		var addZero = check.charAt(2);
		var value = obj.value;
		var maxlength = typeof($(obj).attr("maxlength"))=="string" ? $(obj).attr("maxlength") : "989999999";
		var min = typeof($(obj).attr("min"))=="string" ? $(obj).attr("min") : "";		
		var max = typeof($(obj).attr("max"))=="string" ? $(obj).attr("max") : "";		
		
		if( addZero=="1" && obj.maxLength<100) {
			$(this).blur();
		}
		
		ret = checkUtil.checkType(checkType, obj);
		
		if( ret && allowNull=="0" && value=="" && $(obj).is(':visible')) {
			checkUtil.msg = "抱歉！這欄位不允許空白！";
			ret = false;
		}
		
		if( ret && value.length>maxlength && $(obj).is(':visible') ) {
			checkUtil.msg = "抱歉！此欄位輸入的資料超過"+maxlength+"個字元！";
			ret = false;
		}
		
		if( ret && checkType=="F" && min!="" && max!="" && $(obj).is(':visible') ) {
			if( value*1<min*1 || value*1>max*1) {
				checkUtil.msg = "抱歉！此數字欄位輸入範圍為: "+min+"~"+max+"！";
				ret = false;
			}
		}
	}
	
	if( ret ) {
		//審核通過
		checkUtil.removeHint(obj);
	}else{
		checkUtil.addHint(obj, checkUtil.msg);
	}
	return ret;
}

CheckUtil.prototype.addHint = function(obj, msg) {
	$(obj).css("border-color", "red")
	  	  .css("border-style","solid")
	  	  .addClass("tooltip-info").attr("data-rel", "tooltip").attr("data-placement", "top").tooltip()
	  	  .attr("title", msg);
}

CheckUtil.prototype.removeHint = function(obj) {
	$(obj).css("border-color", '').css("border-style", '').attr("title", "");
}

CheckUtil.prototype.setFormEnterKey = function (formObj, submitButton) {
	clickid = "I"+(Math.random()+"").substring(3);
	submitButton.attr("clickid", clickid);
	formObj.attr("clickid", clickid);	
	$(":text,:password", formObj).unbind('keypress');
	$(":text,:password", formObj).keypress(function(event){
		if( event.keyCode==13 ) {		
			formObj = formUtil.getParent($(this), "form");
			clickid = formObj.attr("clickid");
			$(this).blur();
			$("[clickid="+clickid+"]", formObj).click();
			event.keyCode = 0;
			$(this).focus();
		}
	});	
	
};

CheckUtil.prototype.iniObjectCondition = function ($object, $form) {		

	if( typeof($object.attr("check"))=="string" ) {
		var obj = $object[0];
		var check = $object.attr("check");
		
		if( typeof($object.attr("compareValue"))=="string" ) {
			if( typeof($form.attr("compareValue"))=="string" ) {
				if( $form.attr("compareValue").indexOf($object.attr("compareValue")) == -1 ) {
					if( $form.attr("compareValue") != "" )
						$form.attr("compareValue", $form.attr("compareValue")+",");
					$form.attr("compareValue", $form.attr("compareValue")+$object.attr("compareValue"));
				}
			}else
				$form.attr("compareValue", $object.attr("compareValue"));
		}
		
		if( check.indexOf("Y")==0 ) {
			var name = obj.name;	
			var id 	 = obj.id;
			$object.attr("size", "3");
			$object.attr("maxlength", "3");
			$object.keydown(checkUtil.onlyInt);	
			$object.blur(checkUtil.addZero);
			$object.focus(function(){
				if( this.value=="") this.value = new Date().getFullYear()-1911;
			})
			$object.spinner({
				step: 1, max: 999, min: 1,
				create: function( event, ui ) {
					$(this)
					.next().addClass('btn btn-grey').html('<i class="ace-icon fa fa-chevron-up "></i>')
					.next().addClass('btn btn-grey').html('<i class="ace-icon fa fa-chevron-down"></i>');					
					if('touchstart' in document.documentElement) 
						$(this).closest('.ui-spinner').addClass('ui-spinner-touch');
				},
				spin: function(event, ui) {
					$object.trigger("change");
				}
			});
		}else if( check.indexOf("D")==0 ) {
			calendarUtil.renderCalendar($object, "yyyMMdd");					
		}else if( check.indexOf("F")==0 ) {
			$object.keydown(checkUtil.onlyInt);
			if( check.length==3 && check[2]=="1" )
				$object.blur(checkUtil.addZero);				
		}else if( check.indexOf("M")==0 ) {
			$object.attr("size", "5");
			$object.attr("maxlength", "5");
			$object.keydown(checkUtil.onlyInt);
			if( check.length==3 && check[2]=="1" )
				$object.blur(checkUtil.addZero);
		}else if( check.indexOf("A")==0 ) {
			$object.keydown(checkUtil.onlyAz);
		}else if( check.indexOf("$")==0 ) {	
			$object.keydown(checkUtil.onlyFloat );
		}
	}
	
}

CheckUtil.prototype.iniFormEnterKey = function () {
	$("form").each(function(){		
		if( $("button:contains(查詢)", $(this)).length>0 )
			checkUtil.setFormEnterKey($(this), $("button:contains(查詢):eq(0)", $(this)));
		else if( $("button:contains(確定)", $(this)).length>0 )
			checkUtil.setFormEnterKey($(this), $("button:contains(確定):eq(0)", $(this)));
		else if( $("button:contains(儲存)", $(this)).length>0 )
			checkUtil.setFormEnterKey($(this), $("button:contains(儲存):eq(0)", $(this)));
		else if( $("button:contains(存檔)", $(this)).length>0 )
			checkUtil.setFormEnterKey($(this), $("button:contains(存檔):eq(0)", $(this)));
	})
}

CheckUtil.prototype.iniTextCondition = function () {
		
	$("form").each(function(){
		
		if( typeof($(this).attr("enterbtn"))=="string" ) {
			checkUtil.setFormEnterKey( $(this), $("button[title="+$(this).attr("enterbtn")+"]", $(this)) );
		}
		
		$form = $(this);
		$(":text[check],:text[check=U00]", $form).each(function(i){					
			checkUtil.iniObjectCondition($(this), $form);
		});
		
		$("[radioGroup][type!=radio]", $form).each(function(i){
			$(this).attr("formname", $form.attr("name"));
			$(this).focus(function(){
				var formname = $(this).attr("formname");
				$(":radio[radioGroup="+$(this).attr("radioGroup")+"]", $("form[name="+formname+"]")).click();
			});
		});
		
		$("[checkboxGroup][type!=checkbox]", $form).each(function(i){
			$(this).attr("formname", $form.attr("name"));
			$(this).focus(function(){
				var formname = $(this).attr("formname");
				if( $(":checkbox[checkboxGroup="+$(this).attr("checkboxGroup")+"]", $("form[name="+formname+"]"))[0].checked == false )
					$(":checkbox[checkboxGroup="+$(this).attr("checkboxGroup")+"]", $("form[name="+formname+"]")).click();
			});
		});
		
		$(":radio[radioGroup]", $form).each(function(i){
			$(this).attr("formname", $form.attr("name"));
			$(this).click(function(){
				$this = $(this);
				var formname = $(this).attr("formname");					
				var name=$(this).attr("name");
				var radioGroup = (typeof($(this).attr("radioGroup")) == "string" ? $(this).attr("radioGroup") : "");
				var isclearitem = (typeof($(this).attr("isclearitem")) == "string" ? $(this).attr("isclearitem") : "");
				
				$(":radio[name="+name+"]", $("form[name="+formname+"]")).each(function(){					
					var checknull = (typeof($(this).attr("checknull"))=="string" ? $(this).attr("checknull") : "");
					var formname = $(this).attr("formname");					
					var radioGroup2 = (typeof($(this).attr("radioGroup")) == "string" ? $(this).attr("radioGroup") : "");
					//自己這個RADIO
					if( radioGroup == radioGroup2 ) {						
						$("[radioGroup="+radioGroup2+"][type!=radio]", $("form[name="+formname+"]")).each(function(){
							if( (typeof($(this).attr("check"))=="string") && (typeof($(this).attr("orgcheck"))=="undefined") )
								$(this).attr("orgcheck", $(this).attr("check"));
							if( checknull=="Y" ) {
								var check = (typeof($(this).attr("check")) == "string" ? $(this).attr("check") : "");
								if( check.length>1 ) {
									check = check.substring(0,1) + "0" + check.substring(2);
									$(this).attr("check", check);
								}
							}							
						})
					}else{
						$("[radioGroup="+radioGroup2+"][type!=radio]", $("form[name="+formname+"]")).each(function(){
							if( (typeof($(this).attr("orgcheck"))=="string") ) {
								$(this).attr("check", $(this).attr("orgcheck"));
								$(this).remove("orgcheck");
							}
							if( isclearitem="Y") {
								if( $(this).attr("type")=="text" || $(this).attr("type")=="password" )
									$(this).val("");
								else
									$(this).removeAttr("checked");
							}
						})
					}
				}); 
			});			
		});		
		
		$(":checkbox[checkboxGroup]", $form).each(function(i){
			$(this).attr("formname", $form.attr("name"));
			$(this).click(function(){
				$this = $(this);
				var formname = $(this).attr("formname");					
				var name=$(this).attr("name");
				var checkboxGroup = (typeof($(this).attr("checkboxGroup")) == "string" ? $(this).attr("checkboxGroup") : "");				
				if( !this.checked ) {
					$(":text[checkboxGroup="+checkboxGroup+"]", $("form[name="+formname+"]")).val("");
					$(":password[checkboxGroup="+checkboxGroup+"]", $("form[name="+formname+"]")).val("");
					$(":radio[checkboxGroup="+checkboxGroup+"]", $("form[name="+formname+"]")).removeAttr("checked");
				}
			});			
		});	
		
		$(":radio[radioGroup]:checked",  $form).click();
	});
}

CheckUtil.prototype.changeCheck = function($form) {
	var radioNames = [];
	$('input[type=radio][radioGroup]', $form).each(function(){
		if(radioNames.indexOf($(this).attr('name'))>=0) return;
		radioNames.push($(this).attr('name'));
	});
	for(var i in radioNames){
		var name = radioNames[i];
		var checkGroup = $('input[type=radio][checknull][name='+name+']:checked', $form).attr('radioGroup');
		$('input[type=radio][checknull][name='+name+']', $form).each(function(){
			$(this).attr('checknull', $(this).attr('radioGroup') == checkGroup ? 'Y':'N');
		});
	}
	if(radioNames.length) checkUtil.iniTextCondition();
}

CheckUtil.prototype.onlyInt = function (e) {
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
        (e.keyCode == 65 && e.ctrlKey === true) ||
        (e.keyCode == 67 && e.ctrlKey === true) ||
        (e.keyCode == 88 && e.ctrlKey === true) ||
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             return;
    }
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
}

CheckUtil.prototype.onlyFloat = function (e) {
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
        (e.keyCode == 65 && e.ctrlKey === true) ||
        (e.keyCode == 67 && e.ctrlKey === true) ||
        (e.keyCode == 88 && e.ctrlKey === true) ||
        (e.keyCode == 110 && this.value!="" && this.value.indexOf(".")==-1) ||
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             return;
    }
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
}

CheckUtil.prototype.onlyAz = function (e) {
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
        (e.keyCode == 65 && e.ctrlKey === true) ||
        (e.keyCode == 67 && e.ctrlKey === true) ||
        (e.keyCode == 88 && e.ctrlKey === true) ||
        (e.keyCode >= 65 && e.keyCode <= 90)) {
             return;
    }
    
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();        
    }else{
    } 
}

CheckUtil.prototype.addZero = function () {	
	var check = $(this).attr("check");
	if( check.charAt(2)=="1" && this.value!="" ) {
		while( this.value.length<this.maxLength )
			this.value = "0" + this.value;
	}	
}

String.prototype.Blength = function() {
    var arr = this.match(/[^\x00-\xff]/ig);
    return  arr == null ? this.length : this.length + arr.length;
}

//globe object
var checkUtil = new CheckUtil();