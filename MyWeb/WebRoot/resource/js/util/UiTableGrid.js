
/**
 * @description 此共用元件為動態產生表格
 * @class 動態表格產生工具
 * @author chkchk
 */
function UiTableGrid() {
}

UiTableGrid.prototype.getTableGridOption = function() {
	
	return {
		formObj : null						//查詢條件的form，此設定與分頁顯示有關
		, queryFunction: null
		, gridObj : null					//指定要畫TABLE的物件
		, regenTableTitle: false
		, tableTitleLeft : "查詢結果"			//TABLE的TITLE-左側
		, tableTitleRight : ""				//TABLE的TITLE-右側
		, columnMeta : []					//TABLE內容欄位的定義，見 getColumnMetaOptions()
		, ht : {}							//
		, data : []							//資料集
		, pageInfo : null					//分頁資訊
		, trclick: null
		, nodatamsg: "查無資料"				//無資料時的顯示訊息
		, responseBean: null					//後端送回來的物件
		, expXlsUrl: null
		, datamapping: null
		, trattrpattern: ""
		, havetitle: true
		, filter: null
		, treach: null
		, useTimeout: false
		, redrawhead: false
	};
};

UiTableGrid.prototype.render = function(options) {
	
	var options = $.extend({}, uiTableGrid.getTableGridOption(), options);
	
	if( options.responseBean != null ) {
		if( options.responseBean.data != null && typeof(options.responseBean.data)=="object" )
			options.data = options.responseBean.data;		
		if( options.responseBean.pageInfo != null && typeof(options.responseBean.data)=="object" )
			options.pageInfo = options.responseBean.pageInfo;
	}
	
	//欄位初始化
	for(var i=0;i<options.columnMeta.length;i++) {
		options.columnMeta[i] = uiTableGrid.iniColumnMetaOptions(options.columnMeta[i]);
	}
	
	if( options.havetitle ) {
		uiTableGrid.appendTitle(
				options.gridObj,
				options
			);
	}

	uiTableGrid.appendTableTable(
			options.gridObj,
			options
		);
	
	if( options.pageInfo!=null ) {		
		uiTableGrid.appendPageInfo(
				options.gridObj, 
				options
			);
	}
};

UiTableGrid.prototype.appendTitle = function(gridObj, options) {
	
	tableTitleLeft = options.tableTitleLeft;
	tableTitleRight = options.tableTitleRight;
	expXlsUrl = options.expXlsUrl;
	ht = options.ht;
	datamapping = options.datamapping;
	columnMeta = options.columnMeta;
	formObj = options.formObj;
	regenTableTitle = options.regenTableTitle;
	isFirstDraw = false;
	if( $("h4.header", gridObj).length==0 ) {
		isFirstDraw = true;
		gridObj.append(
				"<h4 class='header lighter' style='margin-bottom:0px;margin-top:5px;padding:8px; border:2px solid rgb(221,221,221);background-color: rgb(242, 242, 242);'>" +
				"	<div class='clearfix' style='font-weight:bold;color: rgb(57, 57, 57);'>" +
				"	<span class='float_left'></span>" +
				"	<span class='float_right'></span>" +
				"	</div>" +
				"</h4>"
			);
			
		if( typeof(top.getFontSize)=="function" ) {
			if( top.getFontSize()!="" ) {
				var headermap = {"x-small":"medium", "small":"large", "medium":"x-large", "large":"xx-large"};
				$("h4.header span.pull-left", gridObj).css("font-size", headermap[top.getFontSize()])
			}
		}
	}		
	
	if( regenTableTitle || isFirstDraw ) {
		$("span.float_left", gridObj).empty().append(itemUtil.genObject(tableTitleLeft, ht, datamapping));
		$("span.float_right", gridObj).empty().append(itemUtil.genObject(tableTitleRight, ht, datamapping));
		if( typeof(expXlsUrl)=="string") {
			ExcelBtn = itemUtil.genObject({btn:"EXCEL匯出"});
			$("span.float_right", gridObj).append(ExcelBtn);	
			$("button", ExcelBtn).attr("expXlsUrl", expXlsUrl)
				.attr("columnMeta", JSON.stringify(columnMeta) )
				.attr("formname", formObj!=null ? formObj.attr("name") : "")
				.click(function(){
					uiTableGrid.exportExcel($(this));
				})
		}
	}
};

UiTableGrid.prototype.exportExcel = function($item) {
	columnMeta = $.parseJSON($item.attr("columnMeta"));
	column = [];
	
	$table = formUtil.getParent($item, "table");
	formname = $item.attr("formname");
	if( formname=="" ) {		
		formObj = formUtil.getParent($table, "form");
	}else{
		body = formUtil.getParent($table, "body");
		formObj = $("form[name="+formname+"]", body);
	}
	
	$tr = $("tr.head", $table);
	
	for(var i=0;i<columnMeta.length;i++ ) {
		if( columnMeta[i].exp && (columnMeta[i].textpattern!=null || columnMeta[i].index!=null) ) {			
			column.push({
				title: columnMeta[i].title,
				textpattern: columnMeta[i].index!=null ? "@{"+columnMeta[i].index+"}" : columnMeta[i].textpattern,
				align: columnMeta[i].align==null ? "left" : columnMeta[i].align,
				width: $("td:eq("+i+")", $tr)[0].offsetWidth+""
			})
		}
	}	
	formUtil.submitTo({
		formObj: formObj,
		expcolumn: column, 
		url: $item.attr("expXlsUrl")
	})
	
}

UiTableGrid.prototype.appendTableTable = function(gridObj, options) {
	
	columnMeta = options.columnMeta;
	pageInfo = options.pageInfo;
	data = options.data;
	trclick = options.trclick;
	queryFunction = options.queryFunction;
	formObj = options.formObj;
	datamapping = options.datamapping;
	filter = options.filter;
	trattrpattern = options.trattrpattern; 
	treach = options.treach;
	rewritehead = options.rewritehead;
	useTimeout = options.useTimeout;
	redrawhead = options.redrawhead;
	nodatamsg = options.nodatamsg;
	
	if( $("table.table", gridObj).length==0 ) {
		gridObj.append(
				"<table id='tablecontext' class='table table-striped table-bordered table-hover no-margin no-padding'>" +
				"	<thead></thead>" +
				"	<tbody></tbody>" +
				"</table>"
			);
		uiTableGrid.appendHead(
				$("thead", gridObj),
				columnMeta,
				queryFunction,
				formObj
			)		
	}	
	
	if( redrawhead ) {
	$("thead", gridObj).empty();
		uiTableGrid.appendHead(
				$("thead", gridObj),
				columnMeta,
				queryFunction,
				formObj
			)
	}
		
	var s=1;
	if( pageInfo!=null && pageInfo.pageNum!=null && pageInfo.pageNum > 0 )
		s = (pageInfo.pageNum-1)*pageInfo.pageSize+1;
	
	$body = $("table>tbody:eq(0)", gridObj).empty();
	
	if( data.length>0 ) {		
		if( !useTimeout ) {
			for(var i=0;i<data.length;i++) {
				if( filter == null || strUtil.checkFilter(data[i], filter) ) {
					uiTableGrid.appendTr($body, datamapping, columnMeta, data[i], trclick, i, s, trattrpattern, treach);
					s++;
				}
			}	
		}else{
			if( data.length>0 ) {
				setTimeout(function(){ 
					uiTableGrid.appendTr2($body, datamapping, columnMeta, data, trclick, 0, s, trattrpattern, filter, treach);
				}, 1);	
			}
		}			
	}else{
		$tr = $("<tr><td colspan='"+columnMeta.length+"'>"+nodatamsg+"</td></tr>").appendTo($body);
	}
		
};

UiTableGrid.prototype.appendTr2 = function($body, datamapping, columnMeta, data, trclick, i, s, trattrpattern, filter, treach) {
	
	if( $("tr", $body).length<i )
		return;
	
	if( filter == null || strUtil.checkFilter(data[i], filter) ) {	
		$tr = $("<tr id='trdata' sel='"+i+"' "+strUtil.tranPattern(trattrpattern, data[i])+"></tr>").appendTo($body);
		uiTableGrid.appendTrTd($tr, datamapping, columnMeta, data[i], i, s);
		
		$tr.data("json", data[i]);	
		if( typeof(trclick)=="function" ) {
			$tr.data("clk", trclick);
			$tr.click(function(){
				$(this).data("clk")($(this).data("json"));
			}).css("cursor", "pointer");
		}
		s++;
		
		if( typeof(treach)=="function" ) {
			treach($tr, data[i]);
		}
	}
	i++;
	
	if( i<data.length ) {
		setTimeout(function(){ 
			uiTableGrid.appendTr2($body, datamapping, columnMeta, data, trclick, i, s, trattrpattern, filter, treach);
		}, 1);	
	}
}

UiTableGrid.prototype.appendHead = function(headObj, columnMeta, queryFunction, formObj) {
	
	tr = $("<tr class='head'></tr>").appendTo(headObj);
	for(var i=0;i<columnMeta.length;i++) {
		uiTableGrid.appendHeadTd(tr, columnMeta[i], queryFunction, formObj);
	}
	$("td", tr).css("text-align", "center").css("vertical-align", "middle"); 
	
};

UiTableGrid.prototype.appendHeadTd = function($tr, columnMeta, queryFunction, formObj) {
	
	var Column = columnMeta;
	
	$td = $("");
	if( Column.tag=="checkbox" && Column.title=="") {
		$td = $("<td "+Column.titleAttr+" nowrap='nowrap'><input type='checkbox' id='"+Column.id+"__'></td>").appendTo($tr);
		if( Column.tdid!=null )
			$td.attr("id", Column.tdid);
		
		$("input[id="+Column.id+"__]", $td).click(function(){
			var id = $(this).attr("id").replace("__", "");
			$table = formUtil.getParent($(this), "table");
			if( $(this)[0].checked ){
				$("input[type=checkbox][id="+id+"]", $table).each(function(){
					$(this)[0].checked = true;
					$(this).click();
					$(this)[0].checked = true;
				});
			}else{
				$("input[type=checkbox][id="+id+"]", $table).each(function(){
					$(this)[0].checked = false;
					$(this).click();
					$(this)[0].checked = false;
				});
			}
		});
	}else{
		$td = $("<td "+Column.titleAttr+" nowrap='nowrap'>"+Column.title+"</td>").appendTo($tr);
		if( Column.tdid!=null )
			$td.attr("id", Column.tdid);
	
	}
	
	if( typeof(Column.order)=="string" && typeof(queryFunction)=="function") {
		
		var orderby = typeof($(":hidden[name=_ORDER_BY]", formObj).val())=="undefined" ? "" : $(":hidden[name=_ORDER_BY]", formObj).val();
		if( orderby.indexOf(",")>-1 )
			orderby = orderby.substring(0, orderby.indexOf(","));
		$td.attr("order", Column.order);
		if( orderby == Column.order ) {
			$td.addClass("tablesorterheaderAsc");
		}else if( orderby == (Column.order + " DESC") ) {
			$td.addClass("tablesorterheaderDesc");
		}else{
			$td.addClass("tablesorterheader");
		}
		
		$td.click(function(){
			if( typeof($(":hidden[name=_ORDER_BY]", formObj).val())=="undefined" ) {
				formObj.append("<input type='hidden' name='_ORDER_BY'>");
			}
			var orderby = $(":hidden[name=_ORDER_BY]", formObj).val();
			var clickfield = $(this).attr("order");
			var cls = "tablesorterheaderAsc";
			if( orderby.indexOf(clickfield)==-1 ) {
				orderby = clickfield + (orderby==""?"":",") +orderby;
			}else{
				orderby = ","+orderby+",";				
				asc = orderby.indexOf(","+clickfield+",");
				desc= orderby.indexOf(","+clickfield+" DESC,");				
				if( asc>-1 ) {
					orderby = orderby.replace(","+clickfield+",", ",");
					orderby = "," + clickfield + (asc==0? " DESC" : "") + orderby;
					cls = (asc==0? "tablesorterheaderDesc" : "tablesorterheaderAsc");
				}else{
					orderby = orderby.replace(","+clickfield+" DESC,", ",");
					orderby = "," + clickfield + orderby;
				}
				orderby = orderby.substring(1, orderby.length-1);
			}			
			$(":hidden[name=_ORDER_BY]", formObj).val(orderby);
			$("td[order]", $(this).parent()).removeClass("tablesorterheaderAsc");
			$("td[order]", $(this).parent()).removeClass("tablesorterheaderDesc");
			$("td[order]", $(this).parent()).removeClass("tablesorterheader");
			$("td[order]", $(this).parent()).addClass("tablesorterheader");
			$(this).addClass(cls);
			queryFunction();
		})
	}
};

UiTableGrid.prototype.appendTr = function($body, datamapping, columnMeta, data, trclick, i, s, trattrpattern, treach) {
	
	$tr = $("<tr id='trdata' sel='"+i+"' "+strUtil.tranPattern(trattrpattern, data)+"></tr>").appendTo($body);
	uiTableGrid.appendTrTd($tr, datamapping, columnMeta, data, i, s);
	
	$tr.data("json", data);
	if( typeof(trclick)=="function" ) {
		$tr.data("clk", trclick);
		$tr.click(function(){
			$(this).data("clk")($(this).data("json"));
		}).css("cursor", "pointer");
	}
	
	if( typeof(treach)=="function" ) {
		treach($tr, data);
	}
	
}

UiTableGrid.prototype.appendTrTd = function($tr, datamapping, columnMeta, data, i, sno) {
	
	for(var j=0;j<columnMeta.length;j++) {
		
		var Column = columnMeta[j];
		$td = $("<td "+strUtil.tranPattern(Column.dataAttr, data)+"></td>").appendTo($tr);
		if( Column.tdid!=null )
			$td.attr("id", Column.tdid);
		
		if( Column.index != null ) {
			if( Column.index=="_SNO") {
				text = sno+"";
			}else if( Column.index=="_RNO") {
				text = (i+1)+""; 
			}else {
				text = data[Column.index];				
			}
		} else if( Column.genObject != null ){
			text = itemUtil.genObject(Column.genObject, data, datamapping, Column.click);
		} else if( Column.textpattern != null) {
			text = Column.textpattern;
			if( typeof(text)=="string" ) {
				text = text.replace("@{_SNO}", sno);
				text = text.replace("@{_RNO}", i);
			} 
			text = strUtil.tranPattern(text, data, datamapping);
		}else if( Column.tag.toLowerCase() == "checkbox" ) {
			text = $("<input type='checkbox' name='"+Column.id+"' id='"+Column.id+"'>").attr("value", strUtil.tranPattern(Column.valuepattern, data));
			$td.attr("align", "center");
		}else if( Column.tag.toLowerCase() == "radio" ) {
			text = $("<input type='radio' name='"+Column.id+"' id='"+Column.id+"'>").attr("value", strUtil.tranPattern(Column.valuepattern, data));
			$td.attr("align", "center");
		}else{
			text = "";
		}
		
		if( typeof(Column.setSeq)=="function" ) {					
			$td.data("setSeq", Column.setSeq);				
			$td.data("seqMaxLength", Column.seqMaxLength);				
			$td.data("seqAddZero", Column.seqAddZero);
			$td.click(function(){
				var sel = $(this).html();
				$(this).attr("orgsel", sel).attr("orghtml", $(this).html()).html("");						
				$text = $("<input type='text' value='"+sel+"' size='2' style='text-align:right' maxlength='"+$(this).data("seqMaxLength")+"' check='F1"+($(this).data("seqAddZero")?"1":"0")+"'>");
				checkUtil.iniObjectCondition($text);
				$text.appendTo($(this)).focus().blur(function(){ 
					$td = $(this).parent(); 
					setSeq = $td.data("setSeq");
					if(this.value=="" || this.value==$td.attr("orgsel")) {
						$td.html($td.attr("orghtml"));
					}else{			
						$td.html(this.value);
						setSeq($td.parent().data("json"), this.value)
					}
				}).keypress(function(event){
					if( event.keyCode==13 ) {
						$(this).blur();
					}
				}).click(function(event){event.stopPropagation()});						
			})
		}
		
		if( (text+"")=="" ) text = "&nbsp;";
		$td.append(text);
	}
	
}

UiTableGrid.prototype.getColumnMetaOptions = function() {
	var options = {
			  title: ""						//欄位title名稱
			, order: null
			, titleAttr: ""					//title行的style
			, dataAttr: ""					//data行的style
			, align: null					//TD的屬性
			, width: null
			, tdid: null					//那個td欄位的id
				
			, index: null					//直接讓TD顯示該欄位的資料  (特殊設定　_SNO：總筆數的第幾筆，_RNO：頁面的第幾筆　)
			, datamapping: null
			, setSeq: null					//點欄位可直接編輯修改排序使用
			, seqMaxLength: 3				//同上
			, seqAddZero: false				//同上
			
			, genObject: null				//透過 itemUtil.genObject 產生物件
			
			, textpattern: null				//依據特定格式顯示TD的資料 
			
			, tag: ""						//特殊顯示，可設定 a, span, checkbox, radio 四類
			, valuepattern: ""				//td內checkbox or radio的value
			, click: null	  				//tag為 a, span 時，點及該欄位所觸發的事件(將會傳入該筆資料的json格式內容)
			, id: ""						//tag為 checkbox, radio 時物件的name與id屬性
			, exp: false
			
		};
	
	return options;
	//註：設定權限　index > genObject > textpattern > tag
}

UiTableGrid.prototype.iniColumnMetaOptions = function(columnMeta) {
	var Column = $.extend({}, uiTableGrid.getColumnMetaOptions(), columnMeta);
	if( Column.align!=null ) {
		if( Column.titleAttr.toLowerCase().indexOf("align=")==-1 )
			Column.titleAttr += " align='"+Column.align+"'";
		if( Column.dataAttr.toLowerCase().indexOf("align=")==-1 )
			Column.dataAttr += " align='"+Column.align+"'";
	}
	if( Column.width!=null ) {
		if( Column.titleAttr.toLowerCase().indexOf("width=")==-1 )
			Column.titleAttr += " width='"+Column.width+"'";
	}
	return Column;
}

UiTableGrid.prototype.appendPageInfo = function(gridObj, options) {
	
	pageInfo = options.pageInfo;
	queryFunction = options.queryFunction;
	formObj = options.formObj;
	
	
	
	var pn = pageInfo.pageNum;
	var ps = pageInfo.pageSize;
	var tot = pageInfo.totalNum;
	
	if( pn==0 || pn=="" || ps==0 || ps=="")
		return;
	
	var s = (pn-1)*ps+1;
	var e = (pn)*ps;
	var m = parseInt((tot/ps))+(tot%ps>0?1:0);

	if( e>tot )
		e = tot;
	
	if( $("div.message-footer", gridObj).length==0 ) {	
		
		//formObj.bind("submit", function(){
		//	return false;
		//})		
		div =  $("<div class='message-footer clearfix no-padding-top no-padding-bottom'>"+
				"	<span class='pull-left' ></span>"+
				"	<span class='pull-right'>"+
				"		<div class='inline middle'></div>"+
				"		<ul class='pagination middle'>"+
				"			<input type='hidden' name='_totalPageNum_'>" +
				"			<li><span><i class='ace-icon fa fa-step-backward middle'></i></span></li>"+
				"			<li><span><i class='ace-icon fa fa-caret-left bigger-140 middle'></i></span></li>"+						
				"			<li><span><input name='_pageNum_' style='width:40px' type='text' return=false/></span></li>"+			
				"			<li><span><i class='ace-icon fa fa-caret-right bigger-140 middle'></i></span></li>"+
				"			<li><span><i class='ace-icon fa fa-step-forward middle'></i></span></li>"+
				"		</ul>"+
				"	</span>"+ 
				"</div>").appendTo(gridObj);
		div.data("queryFunction", queryFunction);
		
		$("i.fa-step-backward", gridObj).click(function(){
			$ul = formUtil.getParent($(this), "ul");
			formObj = formUtil.getParent($(this), "form");
			div = formUtil.getParent($(this), "div");
			_totalPageNum_ = $("input[name=_totalPageNum_]", $ul).val();
			_pageNum_ = $("input[name=_pageNum_]", $ul).val()
			if( _pageNum_!="1" && _totalPageNum_>0 ) {
				$("input[name=pageNum]", formObj).val("1");
				div.data("queryFunction")();
			}
		}).css("cursor", "pointer");
		
		$("input[name=_pageNum_]", gridObj).change(function(){
			$ul = formUtil.getParent($(this), "ul");
			formObj = formUtil.getParent($(this), "form");
			div = formUtil.getParent($(this), "div");
			_totalPageNum_ = $("input[name=_totalPageNum_]", $ul).val();
			_pageNum_ = $("input[name=_pageNum_]", $ul).val()
			if( _pageNum_*1>_totalPageNum_*1 && _totalPageNum_>0 ) {
				_pageNum_=_totalPageNum_;
			}			
			$("input[name=pageNum]", formObj).val(_pageNum_);
			div.data("queryFunction")(); 
		});
		
		$("input[name=_pageNum_]", gridObj).keypress(function(event){
			if( event.keyCode==13 ) {		
				$(this).change();
				event.keyCode = 0;
				$(this).focus();
				return false;
			}
		});	
		
		$("i.fa-caret-left", gridObj).click(function(){
			$ul = formUtil.getParent($(this), "ul");
			formObj = formUtil.getParent($(this), "form");
			div = formUtil.getParent($(this), "div");
			_totalPageNum_ = $("input[name=_totalPageNum_]", $ul).val();
			_pageNum_ = $("input[name=_pageNum_]", $ul).val()
			if( _pageNum_!="1" && _totalPageNum_>0 ) {
				$("input[name=pageNum]", formObj).val(_pageNum_*1-1);
				div.data("queryFunction")();
			}
		}).css("cursor", "pointer");
		
		$("i.fa-caret-right", gridObj).click(function(){
			$ul = formUtil.getParent($(this), "ul");
			formObj = formUtil.getParent($(this), "form");
			div = formUtil.getParent($(this), "div");
			_totalPageNum_ = $("input[name=_totalPageNum_]", $ul).val();
			_pageNum_ = $("input[name=_pageNum_]", $ul).val()
			if( _pageNum_!=_totalPageNum_ && _totalPageNum_>0 ) {
				$("input[name=pageNum]", formObj).val(_pageNum_*1+1);
				div.data("queryFunction")();
			}
		}).css("cursor", "pointer");
		
		$("i.fa-step-forward", gridObj).click(function(){
			$ul = $(this).parent().parent().parent();
			formObj = formUtil.getParent($(this), "form");
			div = formUtil.getParent($(this), "div");
			_totalPageNum_ = $("input[name=_totalPageNum_]", $ul).val();
			_pageNum_ = $("input[name=_pageNum_]", $ul).val()
			if( _pageNum_!=_totalPageNum_ && _totalPageNum_>0 ) {
				$("input[name=pageNum]", formObj).val(_totalPageNum_);
				div.data("queryFunction")();
			}
		}).css("cursor", "pointer");
	}	
	
	$div = $("div.message-footer", gridObj);
	$("input[name=_totalPageNum_]", $div).val(m);
	$("input[name=_pageNum_]", $div).val(pn).keydown(checkUtil.onlyInt);
	$(".pull-left", $div).text("總筆數："+tot);
	$("div.inline", $div).text("第 "+pn+" / "+m+" 頁");

};
var uiTableGrid = new UiTableGrid();