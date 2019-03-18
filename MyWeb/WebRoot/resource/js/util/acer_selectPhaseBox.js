// 開窗選片語
var phaseData;
function phaseDiolag(data, idnm) {
	phaseData = data;
	var test = "<div><div class='search_tool'><button type='button' class='btn btn-xs btn-primary' onclick=\"opWinSearch('"
			+ idnm
			+ "')\">查詢</button>&nbsp;<button class='btn btn-xs btn-primary' type='button' onclick=\"opWinReset()\" >清除</button>&nbsp;<span><label>代碼：<input type='text' size='3' id='searchCode' class='no-padding'></label> <label>內容：<input type='text' size='10' id='searchNm' class='no-padding'></label></span></div><div>";
	test += "<div id='table_div'><table class='table table-striped table_border  table-hover  no-margin no-padding'><thead><tr ><th width='20%' class='center'>選取</th><th width='20%' class='center'>代碼</th><th class='center'>內容</th></tr></thead><tbody id='opWinDataTbody'>";
	for (var i = 0; i < data.length; i++) {
		test += "<tr class='center'><td>";
		test += "[<a href='javascript:doChoose(\"" + data[i].code
				+ "\",\"" + data[i].nm + "\",\"" + idnm
				+ "\")'>選取</a>]</td>";
		test += "<td>" + data[i].code + "</td><td align='left'>"
				+ data[i].nm + "</td></tr>";
	}
	test += "</tbody></table></div>";
	return test;
}
function doChoose(code, nm, idnm) {
	$("#" + idnm).val(nm);
	$("#OpenWinBox").dialog("close");
}
function opWinReset(){
	$("#searchCode").val("");
	$("#searchNm").val("");
}
function opWinSearch(idnm) {
	var code = $("#searchCode").val();
	var nm = $("#searchNm").val();
	var type = (code != "" && nm != "") ? 0 : (code != "") ? 1 : (nm != "") ? 2
			: 3;
	var text = "";
	if (type == 3) {
		for (var i = 0; i < phaseData.length; i++) {
			text += "<tr><td>";
			text += "[<a href='javascript:doChoose(\""
					+ phaseData[i].code + "\",\""
					+ phaseData[i].nm + "\",\"" + idnm
					+ "\")'>選取</a>]</td>";
			text += "<td>" + phaseData[i].code + "</td><td>"
					+ phaseData[i].nm + "</td></tr>";
		}
		$("#opWinDataTbody").html(text);
	} else if (type == 1) {
		var flag = 0;
		for (var i = 0; i < phaseData.length; i++) {
			if (phaseData[i].code == code) {
				flag++;
				text += "<tr><td>";
				text += "[<a href='javascript:doChoose(\""
						+ phaseData[i].code + "\",\""
						+ phaseData[i].nm + "\",\"" + idnm
						+ "\")'>選取</a>]</td>";
				text += "<td>" + phaseData[i].code + "</td><td>"
						+ phaseData[i].nm + "</td></tr>";
			}
		}
		if (flag == 0) {
			text += "<tr><td colspan='3' align='center'>查無資料!</td></tr>";
		}
		$("#opWinDataTbody").html(text);
	} else if (type == 2) {
		var flag = 0;
		for (var i = 0; i < phaseData.length; i++) {
			if ((phaseData[i].nm).indexOf(nm) >= 0) {
				flag++;
				text += "<tr><td>";
				text += "[<a href='javascript:doChoose(\""
						+ phaseData[i].code + "\",\""
						+ phaseData[i].nm + "\",\"" + idnm
						+ "\")'>選取</a>]</td>";
				text += "<td>" + phaseData[i].code + "</td><td>"
						+ phaseData[i].nm + "</td></tr>";
			}
		}
		if (flag == 0) {
			text += "<tr><td colspan='3' align='center'>查無資料!</td></tr>";
		}
		$("#opWinDataTbody").html(text);
	} else if (type == 0) {
		var flag = 0;
		for (var i = 0; i < phaseData.length; i++) {
			if ((phaseData[i].nm).indexOf(nm) >= 0
					&& phaseData[i].code == code) {
				flag++;
				text += "<tr><td>";
				text += "[<a href='javascript:doChoose(\""
						+ phaseData[i].code + "\",\""
						+ phaseData[i].nm + "\",\"" + idnm
						+ "\")'>選取</a>]</td>";
				text += "<td>" + phaseData[i].code + "</td><td>"
						+ phaseData[i].nm + "</td></tr>";
			}
		}
		if (flag == 0) {
			text += "<tr><td colspan='3' align='center'>查無資料!</td></tr>";
		}
		$("#opWinDataTbody").html(text);
	}
}
///開窗選擇案由(暫定版)

///自訂開窗表格
function openWinTable(data,th,td) {
	//alert();
	var text="<div id='table_div'><table class='table table-striped table_border  table-hover  no-margin no-padding'><thead><tr>";

	//TH
	for(var i=0; i<th.length; i++){
		text += th[i].TH;
	}
	text += "</tr></thead><tbody id='opWinDataTbody'>";
	//TD
	for(var i=0; i<data.length; i++){
		var tr = "<tr>";
		for(var t=0; t<td.length; t++){
			var TDstring = td[t].TD;
			var TDsplit = TDstring.split("@#");
			var reltdString = "";
			for(var v=0; v<TDsplit.length; v++){
				if(TDsplit.length==1||v==0||v%2==0){
					reltdString += TDsplit[v];
				}else if(v%2!=0){
					reltdString += data[i][TDsplit[v]];
				}
			}
			tr += reltdString;
		}
		tr += "</tr>";
		text += tr;
	}
	text += "</tbody></table></div>";
	
	return text;
}
