/* ** WebFont Version 1.2.0 ** */
var webFontURL = 'http://demo.cmex.org.tw:8080/WebFont/';

if(typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

function webFont_addFontFace(name) {
	name = name.trim();
	var html = '<style type="text/css">\n@font-face {\n' +
	'\tfont-family: "cmex'+name+'";\n' + 
	'\tsrc: url("'+webFontURL+'temp/'+name+'.eot") format("eot") ;\n' + 
	'\tsrc: url("'+webFontURL+'temp/'+name+'.eot?#iefix") format("embedded-opentype") ,\n' + 
	'\t		url("'+webFontURL+'temp/'+name+'.woff") format("woff");\n' + 
	'}\n</style>';
	$('head').prepend(html);
}

function cmexCallback(json) {
	var name = json.name.trim();
	var cssClass = json.cssClass.trim();
	webFont_addFontFace(name);
	$('.'+cssClass).css('font-family', 'cmex'+name);
}

function subset(cssClass, fontType) {
	var target = $('.'+cssClass);
	var text = target.text().replace(/[\x00-\xff]/g,"").noRepeatStr();
	if(text.length > 0) {
		$.ajax({
			type: 'POST', // 設定dataType:'jsonp'時，type設定無效，瀏覽器一律用GET送出request
			url: webFontURL + 'sub/' + fontType,
			dataType: 'jsonp',
			crossDomain: true,
			data: {
				text: text,
				cssClass: cssClass,
			},
			success: cmexCallback,
			error: function(request, textStatus, errorThrown) {
				if(window.console){console.log('error: '+textStatus);}
				if(window.console){console.log('error: '+errorThrown);}
			}
		});
	}
}

if(!String.prototype.codePointAt) {
	(function() {
		'use strict';
		var codePointAt = function(position) {
			if(this == null) {
				throw TypeError();
			}
			var string = String(this);
			var size = string.length;
			var index = position ? Number(position) : 0;
			if(index != index) {
				index = 0;
			}
			if(index < 0 || index >= size) {
				return undefined;
			}
			var first = string.charCodeAt(index);
			var second;
			if(first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
				second = string.charCodeAt(index + 1);
				if(second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
					return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
				}
			}
			return first;
		};
		if(Object.defineProperty) {
			if(!-[ 1, ]) {
				String.prototype.codePointAt = codePointAt;
			} else {
				Object.defineProperty(String.prototype, 'codePointAt', {
					'value' : codePointAt,
					'configurable' : true,
					'writable' : true
				});
			}
		} else {
			String.prototype.codePointAt = codePointAt;
		}
	}());
}

String.prototype.noRepeatStr = function() {
	var tempArr = new Array();
	for(var i=0; i<this.length; i++) {
		if(this.codePointAt(i) >= 65536) {
			tempArr[tempArr.length] = this.charAt(i);
			tempArr[tempArr.length+1] = this.charAt(i+1);
			i++;
		} else {
			if(tempArr.join('').indexOf(this.charAt(i)) == -1) {
				tempArr[tempArr.length] = this.charAt(i);
			}
		}
	}
	return tempArr.join('');
};
