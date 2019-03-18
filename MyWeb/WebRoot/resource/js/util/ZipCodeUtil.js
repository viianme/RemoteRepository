
		
	
		
	function ZipCodeUtil() {
		
		
		
	}	
	

	

	/**
	 * 取得 zipcode
	 * @param address  地址
	 * @param callBack callback 函式
	 */
	ZipCodeUtil.prototype.getZipCode = function(address,callBack) {
		if (address.trim()!=''){
			var repl = ["住","居","設"];	//拿掉第一個字
			for(var i in repl){
				if(address.indexOf(repl[i])==0){ address = address.substring(1,address.length); }
			}
			
		
		    
			var find = false;
			var datas =  $.parseJSON(localStorage['cityarea']) ;
			for(var i in datas ){

				//console.log( JSON.stringify(datas[i]) );
				if (address.indexOf(datas[i].cityarea) != -1 && datas[i].zipcode != '') { 	
		        	callBack(datas[i].zipcode);
		        	find = true;
		        	break;
				}
		        	
		        	
			}
			if (find==false){
				callBack('');
			}

		}
		
		
	}


	//globe object
	var zipCodeUtil = new ZipCodeUtil();
	
	