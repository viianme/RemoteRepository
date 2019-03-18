
function TableDbUtil() {
}

TableDbUtil.prototype.tabObj = {
		checkVersion: function(owner, tab) {
			var idx = owner+"_"+tab;
			if( typeof(tabledbUtil.tabObj[idx])=="undefined" ) {
				tabledbUtil.tabObj[idx] = {
						version:"",	ls:[], map:{}, lsmap:{}, time: new Date().getTime()
					};
			}			
			var dff = new Date().getTime()-tabledbUtil.tabObj[idx].time;
			if( tabledbUtil.tabObj[idx].version=="" || dff>60000 ) {
				formUtil.submitTo({
				    url: "CheckCacheVersion.htm",
				    dataObj : {tab: tab, owner: owner, version:tabledbUtil.tabObj[idx].version},
				    onSuccess: function(responseBean) {
				    	if( typeof(responseBean.data)=="object" ) {
				    		tabledbUtil.tabObj[idx].version = responseBean.data.redisver;
					    	tabledbUtil.tabObj[idx].ls = responseBean.data.ls;
					    	tabledbUtil.tabObj[idx].map = responseBean.data.map;
					    	tabledbUtil.tabObj[idx].lsmap = responseBean.data.lsmap;
				    	}
				    	tabledbUtil.tabObj[idx].time = new Date().getTime();
				    }
				});
			}
		}
	};

TableDbUtil.prototype.getOptions = function() { 
	return {		 
		  owner: (typeof(gowner)=="string" ? gowner : "W")	//哪一個物件(select checkbox radio)
			, tab : ""
			, key : ""	

			, valuepattern : ''		//value顯示的樣板
			, textpattern: ''		//text顯示的樣板
			, attrpattern: ''		//屬姓(如 align='center' )
			, defaultValue: null	//資料重畫好之後，預設值是什麼
			, width: screen.availWidth	//開啟視窗的寬度(預設畫面寬度)
			, height: screen.availHeight//開啟視窗的高度(預設畫面高度)
			
			, callback: null			
		};
};

TableDbUtil.prototype.openSingleSelect = function(option) {
	var option = $.extend({}, tabledbUtil.getOptions(), option);
	option.data = tabledbUtil.getList(option.owner, option.tab, option.key);
	dynUtil.openSingleSelect(option);
}

TableDbUtil.prototype.openMultipleSelect = function(option) {	
	var option = $.extend({}, tabledbUtil.getOptions(), option);
	option.data = tabledbUtil.getList(option.owner, option.tab, option.key);
	dynUtil.openMultipleSelect(option);
}

TableDbUtil.prototype.renderObject = function(option) {	
	var option = $.extend({}, tabledbUtil.getOptions(), option);
	option.data = tabledbUtil.getList(option.owner, option.tab, option.key);
	renderUtil.renderObject(option);
}

TableDbUtil.prototype.getObj = function(owner, tab, key) {
	tabledbUtil.tabObj.checkVersion(owner.toUpperCase(), tab.toUpperCase());
	if(key==null || key=="")
		key = "NO##########";
	var idx = owner+"_"+tab;
	if( typeof(tabledbUtil.tabObj[idx].map[key])=="object" )
		return tabledbUtil.tabObj[idx].map[key];
	else
		return null;
}

TableDbUtil.prototype.getList = function(owner, tab, key) {
	tabledbUtil.tabObj.checkVersion(owner.toUpperCase(), tab.toUpperCase());
	
	var idx = owner+"_"+tab;
	if( key==null || key=="" )
		return tabledbUtil.tabObj[idx].ls;
	else if( Array.isArray(tabledbUtil.tabObj[idx].lsmap[key]) )
		return tabledbUtil.tabObj[idx].lsmap[key];	
	else
		return [];
}

//globe object
var tabledbUtil = new TableDbUtil();