
function DownloadUtil() {
	
}


var __downloadFilesStr ='';
var  __downloadFilesStrSplit = '|;';


DownloadUtil.prototype.addFile = function(file){
	if (  __downloadFilesStr.length==0  ){
		__downloadFilesStr = file;
	} else{
		__downloadFilesStr += __downloadFilesStrSplit + file;
	}
}

DownloadUtil.prototype.getWebRoot = function() {
	web = window.location.pathname;
	if( web.indexOf("/") != 0 ) web = "/"+web;
	web = web.substring(0, web.indexOf("/", 1)+1);	
	return web;
};


DownloadUtil.prototype.clear = function(){
	__downloadFilesStr = '';
}

DownloadUtil.prototype.multiDownload=function(){
	var files = __downloadFilesStr.split("|;");
	$("a[name=__downloadFileList___]").remove();
	for(var i=0;i<files.length;i++){
	   var myhref = $("<a name='__downloadFileList___'></a>");
		myhref.attr("href","/megaamc/DownLoadFile?filepath=" +files[i] );
		$("body").append(myhref);
	}
	 $("a[name=__downloadFileList___]").multiDownload( { delay: 2000 } ); 
}

DownloadUtil.prototype.download = function(filepath) {
    method = "post"; // Set method to post by default if not specified.
    //alert(params);
    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var frame = $('<iframe style="display: none;" class="multi-download-frame"></iframe>');
    
	    var form = document.createElement("form");
	    form.setAttribute("method", method);
	    //alert(helpUtil.getWebRoot());
	    form.setAttribute("action", "/megaamc/DownLoadFile");
	    form.setAttribute("target", "_blank");
	   

	    var hiddenField = document.createElement("input");
	    hiddenField.setAttribute("type", "hidden");
	    hiddenField.setAttribute("name", "filepath");
	    hiddenField.setAttribute("value", filepath);
	
	   form.appendChild(hiddenField);
	 

	    document.body.appendChild(form);
	    form.submit();
	    
	    
	    
	    document.body.removeChild(form);
	    form = null;
};

var downloadUtil = new DownloadUtil();



//------------------------------- 抄自 jquery-multidownload.js begin -----------
;(function($, window, document, undefined) {
	  "use strict"

	  var download = function (options) {
	    var triggerDelay = (options && options.delay) || 100
	    var cleaningDelay = (options && options.cleaningDelay) || 1000

	    this.each(function (index, item) {
	      createIFrame(item, index * triggerDelay, cleaningDelay)
	    })
	    return this
	  }

	  var createIFrame = function (item, triggerDelay, cleaningDelay) {
	    setTimeout(function () {
	      var frame = $('<iframe style="display: none;" class="multi-download-frame"></iframe>')

	      frame.attr('src', $(item).attr('href') || $(item).attr('src'))
	      $(item).after(frame)

	      setTimeout(function () { frame.remove() }, cleaningDelay)
	    }, triggerDelay)
	  }

	  $.fn.multiDownload = function(options) {
	      return download.call(this, options)
	  }

	})(jQuery, window, document);
//------------------------------- 抄自 jquery-multidownload.js  end -----------