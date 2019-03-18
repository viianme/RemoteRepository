	
    /**
     * 操作審判小工具
     * @returns
     */
	function LocalUtil() {

	}	
	

	/**
	 * 單筆複製檔案
	 * @param from
	 * @param to
	 * @param callbackFunc
	 *  @param customize  自行定義的資料，可在 callback 時取回來
	 */
	LocalUtil.prototype.copyFile = function(from,to,callbackFunc,customize){
        	var data = {};
			 data.exec = 'copy';
			 var copyData = []; 
			 var acopy = {"from":from,"to":to};
			 copyData.push(acopy);
			// copyData.push(acopy2);
			 data.data =  copyData;  
			 data.customize = localUtil.customizeFunc(customize);
			
			 localUtil.connectAndSend(callbackFunc,data);
      }
    
	LocalUtil.prototype.customizeFunc = function(customize){
		if (customize!=null  && typeof(customize)!='undefined' )
			 return customize;
		else
			return '';	
	}
	
	/**
	 * 選擇目錄
	 * @param callbackFunc
	 * @param customize  自行定義的資料，可在 callback 時取回來
	 */
	LocalUtil.prototype.selectDir = function(callbackFunc,customize){
        	var data = {};
			 data.exec = 'selectdir';
			 var copyData = []; 
			 data.data =  copyData;
			 data.customize = localUtil.customizeFunc(customize);

			 localUtil.connectAndSend(callbackFunc,data);
      }
	
	
	/**
	 * 本機端檔案是否存在
	 * @param file
	 */
	LocalUtil.prototype.fileExists = function(file,callbackFunc,customize){
    	var data = {};
		 data.exec = 'fileexists';
		 var copyData = []; 
		 var acopy = {"localfile":file};
		 copyData.push(acopy);
		// copyData.push(acopy2);
		 data.data =  copyData;  
		 data.customize = localUtil.customizeFunc(customize);
		 
		 localUtil.connectAndSend(callbackFunc,data);
	}
	
	/**
	 * 刪除除本機檔案
	 * @param file
	 */
	LocalUtil.prototype.fileDelete = function(file,callbackFunc,customize){
    	var data = {};
		 data.exec = 'filedelete';
		 var copyData = []; 
		 var acopy = {"localfile":file};
		 copyData.push(acopy);
		 data.data =  copyData;  
		 data.customize = localUtil.customizeFunc(customize);
		 
		 localUtil.connectAndSend(callbackFunc,data);
	}
	
	/**
	 * 使用 browser 開啟 pdf
	 * @@param url pdf url
	 * @param param {width:960,height:600,title:"pdf預覽"}
	 */
	LocalUtil.prototype.openpdfWithBrowser = function(url,param){
		var width = 960;
		var height =600;
		var title = "PDF預覽";
		if (param!=null){
			try{width = param.width;}catch(e){}
			try{height = param.height;}catch(e){}
			try{title = param.title;}catch(e){}
		}
		
		
		dialogUtil.openDialog({
			title : title,
			dataObj : {"pdfurl":url},
			width: width,
			height:height, 
			url: "util/OPENPDF_WITHBROWSER.htm",
			callback: function(retVal){
				
			}
		});
	}
	
	/*
	 * 預覽例稿檔(html型態)
	 * @param htmlpath 檔案路徑
	 */
	LocalUtil.prototype.openhtmlWithBrowser = function(htmlpath){
		//var menuid = $("#menuid",$("#topForm")).val();
		
		dialogUtil.openDialog({
			title : "例稿預覽",
			dataObj : {"htmlpath":htmlpath},
			width: 960,
			url: "util/OPENHTML_WITHBROWSER.htm",
			callback: function(retVal){
				
			}
		});
	}
	
	
	LocalUtil.prototype.opentxtWithBrowser = function(url){
		//var menuid = $("#menuid",$("#topForm")).val();
		
		dialogUtil.openDialog({
			title : "文字檔預覽",
			dataObj : {"txtpath":url},
			width: 960,
			url: "util/OPENTXT_WITHBROWSER.htm",
			callback: function(retVal){
				
			}
		});
	}
	
	
	//目前有問題
	LocalUtil.prototype.openwordWithBrowser = function(url){
		dialogUtil.openDialog({
			title : "WORD預覽",
			dataObj : {"wordurl":url},
			width: 960,
			url: "util/OPENWORD_WITHBROWSER.htm",
			callback: function(retVal){
				if (retVal.retVal=="1"){
					//do something
				}	
			}
		});
	}
	
	
	/**
	 * 多筆複製
	 * @param copydata [{"from":"c:\\test\\WinCon64.SFX","to":"c:\\test\\WinCon642.SFX"},{"from":"c:\\test\\法官文采快捷鍵.pdf","to":"c:\\test\\法官文采快捷鍵1.pdf"}]
	 */
	LocalUtil.prototype.copyFiles = function( copydata ,callbackFunc,customize){
    	var data = {};
		 data.exec = 'copy';

		 data.data =  copyData;  
		 data.customize = localUtil.customizeFunc(customize);
		 
		 localUtil.connectAndSend(callbackFunc,data);
	}
      
	/**
	 * 檢查本機端是否有安裝 Word 
	 */
	LocalUtil.prototype.wordInstall = function(callbackFunc,customize){
    	var data = {};
		 data.exec = 'wordinstall';
		 var noparam = []; 
		 data.data =  noparam;  
		 data.customize = localUtil.customizeFunc(customize);
		 
		 localUtil.connectAndSend(callbackFunc,data);
	}
	
	
	/**
	 * 單筆執行
	 * @param show 是否顯示執行檔
	 */
    LocalUtil.prototype.runCmd = function (exe,param,show,callbackFunc,customize){
      	 var data = {};
			 data.exec = 'runcmd';
			 var runcmdData = [];
			 var runcmd1 = {"exe":exe,"param":param,"show":show};
			// var runcmd2 = {"exe":encodeURIComponent("c:\法官文采快捷鍵.pdf"),"param":encodeURIComponent("c:\\法官文采快捷鍵1.pdf")};
			
			 runcmdData.push(runcmd1);
			 //runcmdData.push(runcmd2);
			 data.data =  runcmdData;  
			 data.customize = localUtil.customizeFunc(customize);
			 
			 localUtil.connectAndSend(callbackFunc,data);
      }
    
	/**
	 * 下載檔案
	 * @param url 網址
	 * @param savefile 本機端檔案
	 */
    LocalUtil.prototype.download = function(url,savefile,callbackFunc,customize){
      	 var data = {};
			 data.exec = 'download';
			 var runcmdData = [];
			 var runcmd1 = {"url":url,"savefile":savefile};
			 runcmdData.push(runcmd1);
			 data.data =  runcmdData; 
			 data.customize = localUtil.customizeFunc(customize);
			 
			 localUtil.connectAndSend(callbackFunc,data);
			 //localUtil.sleepFor(1000);//等個一秒	 
      }
    
	/**
	 * 多下載檔案
	 * [{"url":url,"savefile":savefile},{"url":url,"savefile":savefile}]
	 */
    LocalUtil.prototype.downloads = function(param,callbackFunc,customize){
      	 var data = {};
			 data.exec = 'download';
			 var runcmdData = param;	
			 data.data =  runcmdData; 
			 data.customize = localUtil.customizeFunc(customize);
			 
			 localUtil.connectAndSend(callbackFunc,data);
			 //localUtil.sleepFor(1000);//等個一秒	 
      }
    
    
     LocalUtil.prototype.sleepFor = function(sleepDuration ){
        var now = new Date().getTime();
        while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
    }
    
    
	/**
	 * 下載檔案並使用word開啟
	 * @param url 網址
	 * @param savefile 本機端檔案
	 * @param wait 是否等待程式結束
	 */
    LocalUtil.prototype.downloadAndOpenWord = function(url,callbackFunc,wait,customize){
      	 var data = {};
			 data.exec = 'downloadandopenword';
			 var runcmdData = [];
			 var runcmd1 = {"url":url};
			 if (wait==null || typeof(wait)=='undefined'){
				 runcmd1.wait = true;
			 }else{
				 runcmd1.wait = wait;
			 }
			 //alert(JSON.stringify(runcmd1));
			 runcmdData.push(runcmd1);
			 data.data =  runcmdData; 
			 data.customize = localUtil.customizeFunc(customize);
			 
			 localUtil.connectAndSend(callbackFunc,data);
      }
    
    /**
	 * 下載檔案並使用司法文書編輯器(ws2)開啟
	 * @param url 網址
	 * @param callbackFunc 本機端檔案
	 * @param wait 是否等待程式結束
	 */
    LocalUtil.prototype.downloadAndOpenWs2 = function(url,callbackFunc,wait,customize){
      	 var data = {};
			 data.exec = 'downloadandopenws2';
			 var runcmdData = [];
			 var runcmd1 = {"url":url};
			 if (wait==null || typeof(wait)=='undefined'){
				 runcmd1.wait = true;
			 }else{
				 runcmd1.wait = wait;
			 }
			 //alert(JSON.stringify(runcmd1));
			 runcmdData.push(runcmd1);
			 data.data =  runcmdData; 
			 data.customize = localUtil.customizeFunc(customize);
			 
			 localUtil.connectAndSend(callbackFunc,data);
      }
    
    
	/**
	 * 下載檔案並使用 pdf 開啟
	 * @param url 網址(zip檔 或 pdf檔,列印多檔時，請以zip打包)
	 * @param printdirectly 直接列印(true)
	 */
    LocalUtil.prototype.downloadAndPrintPdf = function(url,printdirectly,callbackFunc,customize){
      	 var data = {};
			 data.exec = 'downloadprintpdf';
			 var runcmdData = [];
			 var runcmd1 = {"url":url,"printdirectly":printdirectly};
			 runcmdData.push(runcmd1);
			 data.data =  runcmdData; 
			 data.customize = localUtil.customizeFunc(customize);
			 
			 localUtil.connectAndSend(callbackFunc,data);
     }
    

    
    /**
     * 多筆執行本機端程式
     * @param runcmdData [ {"exe":"c:\\windows\\system32\\notepad.exe","param":"c:\\1.txt","show":false}, {"exe":"c:\\windows\\system32\\notepad.exe","param":"c:\\1.txt","show":false}]
     */
    LocalUtil.prototype.runCmds = function (runcmdData,callbackFunc,customize){
     	 var data = {};
			 data.exec = 'runcmd';
			 data.data =  runcmdData; 
			 data.customize = localUtil.customizeFunc(customize);
			 
			 
			 localUtil.connectAndSend(callbackFunc,data);
     }
    
    /**
     * 存檔
     * @param file
     * @param context
     * @param callbackFunc
     */
    LocalUtil.prototype.saveFile = function(file,context,callbackFunc,customize){
      		var data = {};
			 data.exec = 'savefile';
			 var runcmdData = [];
			
			 var runcmd1 = {"file":file,"context":context};
			 runcmdData.push(runcmd1);
			 data.data =  runcmdData;  
			 data.customize = localUtil.customizeFunc(customize);
			 localUtil.connectAndSend(callbackFunc,data);
      }
      
 
   /**
    * 
    * @param file
    * @param section
    * @param ident
    * @param value
    * @param callbackFunc
    */
    LocalUtil.prototype.writeIni = function(file,section, ident, value,callbackFunc,customize){
      		var data = {};
			 data.exec = 'writeini';
			 var runcmdData = [];
			
			 var runcmd1 = {"inifile":file,"section":section,"ident":ident,"value":value};
			 runcmdData.push(runcmd1);
			 data.data =  runcmdData;  
			 data.customize = localUtil.customizeFunc(customize);
			 
			 localUtil.connectAndSend(callbackFunc,data);
      }
    
    /**
     * 
     * @param file
     * @param section
     * @param ident
     * @param value
     * @param callbackFunc
     */
     LocalUtil.prototype.readIni = function(file,section, ident,callbackFunc,customize){
       		var data = {};
 			 data.exec = 'readini';
 			 var runcmdData = [];
 			
 			 var runcmd1 = {"inifile":file,"section":section,"ident":ident};
 			 runcmdData.push(runcmd1);
 			 data.data =  runcmdData;  
 			 data.customize = localUtil.customizeFunc(customize);
			 
 			 localUtil.connectAndSend(callbackFunc,data);
       }
     
     /**
      * 關閉 delphi 所開啟的 form
      * @param retVal frm_web要回傳true或false()
      * @param callbackFunc
      */
      LocalUtil.prototype.closewindow = function(retVal,callbackFunc,customize){
        	var data = {};
  			 data.exec = 'closewindow';
  			 var runcmdData = [];
  			
  			 var runcmd1 = {"classname":"Tfrm_web","retVal":retVal};
  			 runcmdData.push(runcmd1);
  			 data.data =  runcmdData;  
  			data.customize = localUtil.customizeFunc(customize);
			 
			 
  			 localUtil.connectAndSend(callbackFunc,data);
       }
     
      
      /**
       * 將字串存到記憶體
       * @param str
       * @param callbackFunc
       * 
       * example:
       * localUtil.saveToMemo('字串',saveCallbackFunc);
       * 
       * function saveCallbackFunc(ret){
       * 	if (ret.success){
       *       localUtil.getFromMemo(getCallBack);
       *    }
       * }
       * function getCallBack(ret){
       * 	if (ret.success){
       *       alert(ret.data);
       *    }
       * }
       * 
       */
       LocalUtil.prototype.saveToMemo = function(str,callbackFunc,customize){
         	var data = {};
   			 data.exec = 'savetomemo';
   			 var runcmdData = [];
   			
   			 var runcmd1 = {"data":str};
   			 runcmdData.push(runcmd1);
   			 data.data =  runcmdData;  
   			data.customize = localUtil.customizeFunc(customize);
			 
   			 localUtil.connectAndSend(callbackFunc,data);
        }
       
       
       LocalUtil.prototype.saveToClip = function(str,callbackFunc,customize){
        	var data = {};
  			 data.exec = 'savetoclip';
  			 var runcmdData = [];
  			
  			 var runcmd1 = {"data":str};
  			 runcmdData.push(runcmd1);
  			 data.data =  runcmdData;  
  			data.customize = localUtil.customizeFunc(customize);
			 
  			 localUtil.connectAndSend(callbackFunc,data);
       }
      
       LocalUtil.prototype.getFromClip = function(callbackFunc,customize){
         	var data = {};
   			 data.exec = 'getfromclip';
   			 var runcmdData = [];
   			
   			 var runcmd1 = {"data":""};
   			 runcmdData.push(runcmd1);
   			 data.data =  runcmdData;  
   			data.customize = localUtil.customizeFunc(customize);
			 
   			 localUtil.connectAndSend(callbackFunc,data);
        }
       
       
       /**
        * 將 localUtil.saveToMemo 的 字串取回來
        * @param str
        * @param callbackFunc 回呼函式 
        * 
        * example:
        *   localUtil.getFromMemo(callbackFunc);
        *   
        *   function callbackFunc(ret){
        *   	if (ret.success){
        *            alert(ret.data);  //取回資料
        *       }
        *   }
        * 
        */
        LocalUtil.prototype.getFromMemo = function(callbackFunc,customize){
          	var data = {};
    			 data.exec = 'getfrommemo';
    			 var runcmdData = [];
    			
    			 var runcmd1 = {"data":""};
    			 runcmdData.push(runcmd1);
    			 data.data =  runcmdData;  
    			 data.customize = localUtil.customizeFunc(customize);
    			 
    			 localUtil.connectAndSend(callbackFunc,data);
         }
       
      
    //WebSocket連線後送出資料
	LocalUtil.prototype.connectAndSend = function(mycallback, obj) {
 	   var wsUri = "ws://127.0.0.1:777";
 	 
        if (document.location.protocol.indexOf("https") != -1)
     	   wsUri = "wss://127.0.0.1:777";
        
        
	       	var _webSocket = new WebSocket(wsUri);
	       	_webSocket.onopen = function(evt) { 
	       		_webSocket.send( JSON.stringify( obj) ); 
	       };
	       
	       _webSocket.onclose = function(evt) {
	         // writeToScreen("DISCONNECTED"); 
	      };
	      
	      _webSocket.onmessage = function(evt) {
	    	  _webSocket.close();
	          var  retVal = $.parseJSON(evt.data);
	          if (mycallback!=null){
	        	  mycallback(retVal);
	          }
	          	

	      };
	      
	      _webSocket.onerror = function(evt) {
	    	  if (JSON.stringify(evt)=="{}"){
	    		  evt.success = false;
	    		  evt.message = 'undifined';
	    		  if (mycallback!=null){
	    			  mycallback(evt); 
	    		  }
	    		  	
	    	  }else{
	    		  evt.data.success = false;
		    	  evt.data.message = evt.data;
		    	  if (mycallback!=null){
		    		  mycallback(evt.data); 
		    	  }
		    	  
	    	  }
	    	  
	    	
	      };
   }
    
	
	
    
	//globe object
	var localUtil = new LocalUtil(); 
	
