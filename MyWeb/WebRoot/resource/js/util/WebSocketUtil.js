function WebSocketUtil()
{
}

WebSocketUtil.prototype.socket = null;
WebSocketUtil.prototype.stompClient = null;
WebSocketUtil.prototype.callback = {};
WebSocketUtil.prototype.retobj = {};
WebSocketUtil.prototype.connectcallback = null;
WebSocketUtil.prototype.connected = false;

WebSocketUtil.prototype.getWebRoot = function() {
	web = window.location.pathname;
	if( web.indexOf("/") != 0 ) 
		web = "/"+web;
	web = web.substring(0, web.indexOf("/", 1)+1);	
	return web;
};

WebSocketUtil.prototype.doConnect=function(callback)
{
	if( websocketUtil.socket==null ) {
		websocketUtil.socket = new SockJS(websocketUtil.getWebRoot() + 'stomp');  
		websocketUtil.stompClient = Stomp.over(websocketUtil.socket);     
	}
	websocketUtil.connectcallback = callback;
	websocketUtil.stompClient.connect({}, function(frame) {
		websocketUtil.connected = true;
        if( typeof(websocketUtil.connectcallback)=="function" ) {
        	websocketUtil.connectcallback(true);
        }
    }, function(frame){
    	websocketUtil.connected = false;
    });  
}  

WebSocketUtil.prototype.addListener=function(destination, callback)
{
	if( websocketUtil.connected ) {
		websocketUtil.callback[destination] = callback;
		
		if( typeof(websocketUtil.retobj[destination])=="object" ) {
			websocketUtil.retobj[destination].unsubscribe();
			delete websocketUtil.retobj[destination];
			delete websocketUtil.callback[destination];
		}
		websocketUtil.retobj[destination] = websocketUtil.stompClient.subscribe(destination, function(greeting){
			try{
				if( typeof(websocketUtil.callback[greeting.headers.destination])=="function" )
					websocketUtil.callback[greeting.headers.destination](greeting.body)
			}catch(e){
				if( typeof(e.description)=="string" && e.description.indexOf("無法執行已被釋放的")==0) {					
					websocketUtil.retobj[greeting.headers.destination].unsubscribe();
					delete websocketUtil.retobj[greeting.headers.destination];
					delete websocketUtil.callback[greeting.headers.destination];
				}				
			}
	    }); 
	}else{
		setTimeout(function(){ websocketUtil.addListener(destination, callback) }, 100);
	}		
}

WebSocketUtil.prototype.removeListener=function(destination)
{
	if( websocketUtil.connected ) {		
		if( typeof(websocketUtil.retobj[destination])=="object" ) {
			websocketUtil.retobj[destination].unsubscribe();
			delete websocketUtil.retobj[destination];
		}
	}		
}

WebSocketUtil.prototype.sendData=function(destination, json){
	if( typeof(json)=="string")
		websocketUtil.stompClient.send(destination, {}, json);
	else
		websocketUtil.stompClient.send(destination, {}, JSON.stringify(json));
}

//關閉連線
WebSocketUtil.prototype.closeConnection = function(){
	if ( websocketUtil.stompClient != null) {  
		websocketUtil.stompClient.disconnect();  
		websocketUtil.connected = false;
        console.log("websocket Disconnected");  
    }
}


var websocketUtil = new WebSocketUtil();
