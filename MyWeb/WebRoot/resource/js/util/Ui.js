function Ui() {
}


Ui.prototype.iniRenderObject = function($body) {
	$("select[valuepattern][textpattern],:radio[valuepattern][textpattern],:checkbox[valuepattern][textpattern]", $body).each(function(){
		if( typeof($(this).attr("changeby"))=="string" && $(this).attr("changeby")!="" ) {
			ui.iniObjectItemSetChangeBy($(this));
		}else{
			ui.iniRenderObjectItem($(this));
		}
	}) 
	 
	$(":text[valuepattern][textpattern],textarea[valuepattern][textpattern]", $body).each(function(){
		if( typeof($(this).attr("changeby"))=="string" && $(this).attr("changeby")!="" )
			ui.iniObjectItemSetChangeBy($(this))
		ui.iniOpenObjectItem($(this));
	}) 
	
	$("textarea[editor]", $body).each(function(){
		$(this).hide();
		$div = $("<div targetname='"+this.name+"'></div>").insertBefore($(this));
		
		$div.addClass("wysiwyg-editor");
		$div.ace_wysiwyg({
			toolbar:
			[
				'font',
				null,
				'fontSize',
				null,
				{name:'bold', className:'btn-info'},
				{name:'italic', className:'btn-info'},
				{name:'strikethrough', className:'btn-info'},
				{name:'underline', className:'btn-info'},
				null,
				{name:'insertunorderedlist', className:'btn-success'},
				{name:'insertorderedlist', className:'btn-success'},
				{name:'outdent', className:'btn-purple'},
				{name:'indent', className:'btn-purple'},
				null,
				{name:'justifyleft', className:'btn-primary'},
				{name:'justifycenter', className:'btn-primary'},
				{name:'justifyright', className:'btn-primary'},
				{name:'justifyfull', className:'btn-inverse'},
				null,
				{name:'createLink', className:'btn-pink'},
				{name:'unlink', className:'btn-pink'},
				null,
				'foreColor',
				null,
				{name:'undo', className:'btn-grey'},
				{name:'redo', className:'btn-grey'}
			]
		}).prev().addClass("wysiwyg-style2");
		
	})
	
}
Ui.prototype.initImgColorBox = function($obj) {
	$("img", $obj).each(function(){
		var image = $(this).attr("src");
		var ahtml = "";
		if(image.indexOf('base64')!=-1) {
			ahtml="<a ahref='<img src="+image+">', data-rel='colorboxBase64'></a>";
		}else{
			ahtml="<a ahref='"+image+"', data-rel='colorboxUrl'></a>";
		}
		$(this).wrap(ahtml);	
	})	
	$('a[data-rel="colorboxUrl"],a[data-rel="colorboxBase64"]', $obj).click(function(){
		top.$.colorbox({ 
			rel: 'colorbox',
			reposition:false,
			scalePhotos:false,
			maxWidth:'100%',
			maxHeight:'100%',
			href: $(this).attr("ahref"),
			onComplete:function(){
				top.$.colorbox.resize();
			}
		});
	})
}

Ui.prototype.iniObjectItemSetChangeBy = function($item) {
	$item.each(function(){				
		if( typeof($(this).attr("changeby"))=="string" && $(this).attr("changeby")!="" ) {
			$form = formUtil.getParent($(this), ui.getParentTab($(this)));
			names = $(this).attr("changeby").split(",");
			for(var i=0;i<names.length;i++) {
				ui.setChangeBy($("[name="+names[i]+"]", $form), $(this).attr("name"), i);
			}  ui.getParentTab($(this))
		}
	}) 
}

Ui.prototype.getChangeByJson = function($item) {
	var ret = {};
	$item.each(function(){				
		if( typeof($(this).attr("changeby"))=="string" && $(this).attr("changeby")!="" ) {
			$form = formUtil.getParent($(this), ui.getParentTab($(this)));
			names = $(this).attr("changeby").split(",");
			ret = formUtil.Form2Json($form);
		}
	}) 
	return ret;
}

Ui.prototype.iniOpenObjectItem = function($item) {
	$item.each(function(){
		btntxt = typeof($(this).attr("btntxt"))=="string" ? $(this).attr("btntxt"): "開窗";
		$span = itemUtil.genObject({btn:"開窗", textpattern:btntxt }).insertAfter($(this));
		$("button[title="+btntxt+"]", $span).click(function(){
			$text = $(this).parent().prev();
			ui.textbtnopen($text);			
		})
		if( $(this).attr("blur")=="" )
			ui.textblur($(this));
	}) 
}

Ui.prototype.textblur = function($item) {
	$item.blur(function(){
		valuepattern = $(this).attr("valuepattern");
		textpattern = $(this).attr("textpattern");
		callback = $(this).attr("callback");
		
		if( typeof($(this).attr("blurpattern"))=="string" && $(this).attr("blurpattern")!="")
			textpattern = $(this).attr("blurpattern");
		
		formUtil.setItemDataFromTag($(this));
		var data = $(this).data("data");
		value = this.value;
		if( !isNaN($(this).attr("valuelength")) ) {
			while( value.length<$(this).attr("valuelength") )
				value = "0"+value;
		}
		find = false;
		for(var i=0;i<data.length;i++) {
			if( value==strUtil.tranPattern(valuepattern, data[i]) || this.value==strUtil.tranPattern(textpattern, data[i]) ) {
				this.value = strUtil.tranPattern(textpattern, data[i]);
				if( typeof($(this).attr("valuetarget"))=="string" && $(this).attr("valuetarget")!="" ) {
					$form = formUtil.getParent($(this), ui.getParentTab($(this)));
					$("[name="+$(this).attr("valuetarget")+"]", $form).val(strUtil.tranPattern(valuepattern, data[i]));
					
					if( typeof(callback)=="string" && typeof(eval(callback))=="function" ) {
						eval(callback)(data[i]);
					}
				}
				find = true;
				break;
			}
		}
		if( !find && typeof($(this).attr("nofindmsg"))=="string" ) {
			if( typeof($(this).attr("valuetarget"))=="string" && $(this).attr("valuetarget")!="" ) {
				$form = formUtil.getParent($(this), ui.getParentTab($(this)));
				$("[name="+$(this).attr("valuetarget")+"]", $form).val("");
			}
			if( this.value!="") {
				this.value = "";
				helpUtil.showInfoBar("INFO", $(this).attr("nofindmsg"));
			}
		}
	});
}

Ui.prototype.textbtnopen = function($item) {
	$item.each(function(){				
		callback = $(this).attr("callback");
		if( typeof(callback)=="string" && typeof(eval(callback))=="function" ) {
			callback = eval(callback);
		}else{
			callback = null;
		}
			
		formUtil.setItemDataFromTag($(this));
		options = {
				data: $(this).data("data"),
				valuetarget: $(this),
				valuepattern: $(this).attr("valuepattern"),
				textpattern: $(this).attr("textpattern"),
				filter: typeof($(this).attr("filter"))=="string" ? $(this).attr("filter") : null,
				defaultValue: this.value,
				callback: callback
			}
		if( typeof($(this).attr("width"))=="string" )
			options.width = $(this).attr("width");
		if( typeof($(this).attr("height"))=="string" )
			options.height = $(this).attr("height");
		
		if( typeof($(this).attr("valuetarget"))=="string" && $(this).attr("valuetarget")!="" ) {
			$form = formUtil.getParent($(this), ui.getParentTab($(this)));
			options.valuetarget = $("[name="+$(this).attr("valuetarget")+"]", $form);
			options.texttarget = $(this);
		}
		if( typeof($(this).attr("blurpattern"))=="string" && $(this).attr("blurpattern")!="" ) {
			options.blurpattern = $(this).attr("blurpattern")
		}
		if( $item.attr("openSingleSelect")=="" ) {
			dynUtil.openSingleSelect(options)
		}else if( $item.attr("openMultipleSelect")=="" ) {
			dynUtil.openMultipleSelect(options)
		}
	});
}

Ui.prototype.iniRenderObjectItem = function($item) {
	$item.each(function(){		
		formUtil.setItemDataFromTag($(this));
		renderUtil.renderObject({
			data: $(this).data("data"),
			targetObj: $(this),
			valuepattern: $(this).attr("valuepattern"),
			textpattern: $(this).attr("textpattern"),
			allText: typeof($(this).attr("allText"))=="string" ? $(this).attr("allText") : "全部",
			haveall: typeof($(this).attr("allText"))=="string",
			filter: typeof($(this).attr("filter"))=="string" ? $(this).attr("filter") : null,
			numOfLine: typeof($(this).attr("numOfLine"))=="string" ? $(this).attr("numOfLine") : null,
			defaultValue: typeof($(this).attr("defaultValue"))=="string" ? $(this).attr("defaultValue") : null,
			isClear: $(this).attr("notClear")!="",
			datamapping: datamapping
		})
		$(this).change();
	}) 
}

Ui.prototype.getParentTab = function($item) {
	if( typeof($item.attr("parent"))=="string" && $item.attr("parent")!="" ) {
		return $item.attr("parent");
	}else{
		return "form";
	}
}

Ui.prototype.setChangeBy = function($changeby, myname, i) {
	var first = false;
	if( $changeby.attr("changetarget")==null ) {
		$changeby.attr("changetarget", myname);
		first = true;
	}else{
		$changeby.attr("changetarget", $changeby.attr("changetarget")+","+myname);
	}
	if( first ) {
		$changeby.change(function(){
			$form = formUtil.getParent($(this), ui.getParentTab($(this)));
			changetarget = $(this).attr("changetarget").split(",");
			for(var i=0;i<changetarget.length;i++) {
				$target = $("[name="+changetarget[i]+"]", $form);
				if( typeof($target.attr("keypattern"))=="string" && $target.attr("keypattern")!="" ) {
					if( $target.attr("keypattern").indexOf("@{key}")>-1 )
						$target.attr("key", strUtil.tranPattern($target.attr("keypattern"), {key:$(this).val()}));
					else{
						$target.attr("key", strUtil.tranPattern($target.attr("keypattern"), ui.getChangeByJson($target)));
					}
				}else
					$target.attr("key", $(this).val());				
				if( $target.get(0).tagName.toUpperCase()!="INPUT" )
					ui.iniRenderObjectItem($target);
			}
		});
	}	
	if(i==0)
		$changeby.change();
}

//globe object
var ui = new Ui();