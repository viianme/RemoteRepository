// �}������y
var phaseData;
function phaseDiolag(data, idnm) {
	phaseData = data;
	var test = "<div><div class='search_tool'><button type='button' class='btn btn-xs btn-primary' onclick=\"opWinSearch('"
			+ idnm
			+ "')\">�d��</button>&nbsp;<button class='btn btn-xs btn-primary' type='button' onclick=\"opWinReset()\" >�M��</button>&nbsp;<span><label>�N�X�G<input type='text' size='3' id='searchCode' class='no-padding'></label> <label>���e�G<input type='text' size='10' id='searchNm' class='no-padding'></label></span></div><div>";
	test += "<div id='table_div'><table class='table table-striped table_border  table-hover  no-margin no-padding'><thead><tr ><th width='20%' class='center'>���</th><th width='20%' class='center'>�N�X</th><th class='center'>���e</th></tr></thead><tbody id='opWinDataTbody'>";
	for (var i = 0; i < data.length; i++) {
		test += "<tr class='center'><td>";
		test += "[<a href='javascript:doChoose(\"" + data[i].code
				+ "\",\"" + data[i].nm + "\",\"" + idnm
				+ "\")'>���</a>]</td>";
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
					+ "\")'>���</a>]</td>";
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
						+ "\")'>���</a>]</td>";
				text += "<td>" + phaseData[i].code + "</td><td>"
						+ phaseData[i].nm + "</td></tr>";
			}
		}
		if (flag == 0) {
			text += "<tr><td colspan='3' align='center'>�d�L���!</td></tr>";
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
						+ "\")'>���</a>]</td>";
				text += "<td>" + phaseData[i].code + "</td><td>"
						+ phaseData[i].nm + "</td></tr>";
			}
		}
		if (flag == 0) {
			text += "<tr><td colspan='3' align='center'>�d�L���!</td></tr>";
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
						+ "\")'>���</a>]</td>";
				text += "<td>" + phaseData[i].code + "</td><td>"
						+ phaseData[i].nm + "</td></tr>";
			}
		}
		if (flag == 0) {
			text += "<tr><td colspan='3' align='center'>�d�L���!</td></tr>";
		}
		$("#opWinDataTbody").html(text);
	}
}
///�}����ܮץ�(�ȩw��)

///�ۭq�}�����
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
