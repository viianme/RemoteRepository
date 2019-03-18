function CalendarUtil() { 
	
}

CalendarUtil.prototype.targetid = '';
CalendarUtil.prototype.targetobj = '';

CalendarUtil.prototype.renderCalendar=function($obj, dateFmt) {
	$obj.attr("size", dateFmt.length);
	$obj.attr("maxlength", dateFmt.length);
	$obj.keydown(checkUtil.onlyInt).blur(function(){
		if( $(this).val() != "") {
			while( $(this).val().length<this.maxLength )
				$(this).val( "0"+$(this).val())
		}
	}) 
	 
	if( $obj.next().length==0 || $obj.next().attr("id")!="calendarbtn") {
		$btn = $("<i id='calendarbtn' class='ace-icon fa fa-calendar' style='margin:-3px 0 5px 5px'></i>").insertAfter($obj);		
		$btn.click(function(){
			calendarUtil.targetobj = $(this).prev()
			if( !calendarUtil.targetobj.is(":disabled") ) {
				dialogUtil.openDialog({
					title: "請選擇日期",
					url: formUtil.getWebRoot() + "resource/jsp/CALENDAR.jsp",
					dataObj: {dt: calendarUtil.targetobj.val()},
					width: 235,
					height: 310,
					callback: function(para){
						calendarUtil.targetobj.val(para.dt);
						calendarUtil.targetobj.change();
						calendarUtil.targetobj.blur();
					}
				})
			}
		}).css("cursor", "pointer");
	}	
}

var calendarUtil = new CalendarUtil();