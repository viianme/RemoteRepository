

function DateUtil() {
}

DateUtil.prototype.weebmap = ["日","一","二","三","四","五","六"];

DateUtil.prototype.getMonthFirstDay=function(month)
{
	return month+"01";
}

DateUtil.prototype.getMonthLastDay=function(month)
{	
	return dateUtil.calDays(dateUtil.addMonth(month)+"01", -1);
}

DateUtil.prototype.calDays=function(day, i) 
{
	var date = dateUtil.str2date(day);
	date.setDate(date.getDate() + i);
	return dateUtil.date2str(date);
}

DateUtil.prototype.calMonths=function(day, i)
{
	var date = dateUtil.str2date(day);
	date.setMonth(date.getMonth() + i);
	return dateUtil.date2str(date);
}

DateUtil.prototype.addMonth=function(month)
{
	var date = dateUtil.str2date(month+"01");
	date.setMonth(date.getMonth() + 1);
	return dateUtil.date2str(date).substring(0,5);
}

DateUtil.prototype.subMonth=function(month)
{
	var date = dateUtil.str2date(month+"01");
	date.setMonth(date.getMonth() - 1);
	return dateUtil.date2str(date).substring(0,5);
}

DateUtil.prototype.getSundayOfDay=function(str){
	while( dateUtil.getWeekOfDay(str)!=0 ) {
		str = dateUtil.calDays(str, -1);
	}
	return str;
}

DateUtil.prototype.getSaturdayOfDay=function(str){
	while( dateUtil.getWeekOfDay(str)!=6 ) {
		str = dateUtil.calDays(str, 1);
	}
	return str;
}

DateUtil.prototype.getWeekOfDayCnm=function(str)
{
	var day = dateUtil.str2date(str).getDay();
	return dateUtil.weebmap[day];	
}

DateUtil.prototype.getWeekOfDay=function(str)
{
	return dateUtil.str2date(str).getDay();
}

DateUtil.prototype.str2date=function(str)
{	
	if( str.length==7 ) 
		str = (str*1 + 19110000)+"";
	return new Date(str.substring(0,4) + "/" + str.substring(4,6) + "/" + str.substring(6,8) );
}

DateUtil.prototype.strDate = function (str)
{
	if( str.length==8 ) {
		str = (str*1 - 19110000)+"";
	}
	return new Date(str.substring(0,3) + "/" + str.substring(3,5) + "/" + str.substring(5,7));

}

DateUtil.prototype.date2str=function(date)
{ 
	return date.toCDateStr();
}

DateUtil.prototype.getNowDate=function()
{
	return new Date().toDateStr();
}

DateUtil.prototype.getNowCDate=function()
{
	return new Date().toCDateStr();
}

DateUtil.prototype.getNowTime=function()
{
	return new Date().toTimeStr();
}

DateUtil.prototype.getNowYM = function() {
	var now = new Date();
	var year = now.getFullYear() - 1911 + "";
	var month = (now.getMonth() + 1) + "";
	if(month.length < 2) {
		month = "0" + month;
	}
	return year + month;
}

DateUtil.prototype.DateDiff=function(str1, str2)
{		
	var oDate1 = dateUtil.str2date(str1);
	var oDate2 = dateUtil.str2date(str2); 
	var iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24);
	return iDays
}

DateUtil.prototype.showCalendarDt=function(str)
{			
	if( str.substring(5,7)=="01" )
		return str.substring(3,5)*1+"月1日";
	else
		return str.substring(5,7)*1;
}

//globe object
Date.prototype.toDateStr = function() {	
	var year = (this.getYear() < 1000) ? (this.getYear()+1900) : this.getYear();
	while((year+"").length<3)
		year = "0"+year;
	var month = this.getMonth()+1;
	while((month+"").length<2)
		month = "0"+month;
	var day = this.getDate(); 
	while((day+"").length<2)
		day = "0"+day;	
	return year+""+month+""+day;
}

//globe object
Date.prototype.toCDateStr = function() {	
	var year = (this.getYear() < 1000) ? (this.getYear()+1900) : this.getYear();
	year -= 1911;
	while((year+"").length<3)
		year = "0"+year;
	var month = this.getMonth()+1;
	while((month+"").length<2)
		month = "0"+month;
	var day = this.getDate(); 
	while((day+"").length<2)
		day = "0"+day;	
	return year+""+month+""+day;
}

//globe object
Date.prototype.toTimeStr = function() {	
	var hours = this.getHours();
	while((hours+"").length<2)
		hours = "0"+hours;
	var minutes = this.getMinutes();
	while((minutes+"").length<2)
		minutes = "0"+minutes;
	var seconds = this.getSeconds(); 
	while((seconds+"").length<2)
		seconds = "0"+seconds;	
	return hours+""+minutes+""+seconds;
}

DateUtil.prototype.mainShowTime=function()
{
    var date = new Date;
    var year = date.getFullYear();
    year=year.valueOf()-1911;
    var month = date.getMonth();
    months = new Array('1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月');
    var d = date.getDate();
    var day = date.getDay();
    var days = new Array('星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
    var h = date.getHours();
    if(h<10) {
    	h = "0"+h;
    }
    var m = date.getMinutes();
    if(m<10) {
    	m = "0"+m;
    }
    var s = date.getSeconds();
    if(s<10) {
    	s = "0"+s;
    }
    return '民國 '+year+'年 '+months[month]+d+'日  '+days[day]+' '+h+':'+m+':'+s;
}

var dateUtil = new DateUtil();