/** 
 * @fileoverview 定義處理畫面效果的共用函式
 *
 * @author Welkin Fan
 * @version 1.0
 */

var __VAR_TIMERID__	=	null;


function HelpUtil() {
}

HelpUtil.prototype.divobj = null;

/**
 * 顯示提示訊息的畫面
 * @param {String} strInfoType 提示訊息的型態 ('WARN','DONE','FAIL','INFO')
 * @param {String} strInfoText 提示訊息的內容
 * @param {Number} strInfoPosX 提示訊息出現的X軸位置,預設值為畫面最左方
 * @param {Number} strInfoPosY 提示訊息出現的Y軸位置,預設值為畫面最上方
 * @param {Number} strInfoTime 提示訊息停留的時間,預設值為3500ms
 * @return 無
 * @type void
 */

HelpUtil.prototype.getWebRoot = function() {
	web = window.location.pathname;
	if( web.indexOf("/") != 0 ) web = "/"+web;
	web = web.substring(0, web.indexOf("/", 1)+1);	
	return web;
}

HelpUtil.prototype.showInfoBar = function() 
{
	$objInfoBar = helpUtil.getObj("#___HELP_INFOBAR___");
	var strInfoType = (arguments.length > 0)?arguments[0].toString().toUpperCase():null;
	var strInfoText = (arguments.length > 1)?arguments[1].toString():null;
	var strInfoTime = (arguments.length > 2)?parseInt(arguments[2].toString()):null;
	
	if ($objInfoBar.length==0 || arguments.length < 2)
		return;
	
	helpUtil.getObj("#img1", $objInfoBar).attr("src", helpUtil.getWebRoot()+"resource/image/"+strInfoType.toLowerCase()+".gif");
	helpUtil.getObj("#font1", $objInfoBar).html(strInfoText);

	$objInfoBar.css("top", document.body.scrollTop);
	$objInfoBar.css("left", document.body.scrollLeft);
	
	helpUtil.getObj("#___HELP_INFOBAR___").css("visibility", "");
	
	if (__VAR_TIMERID__ != null) {
		clearTimeout(__VAR_TIMERID__);
	}
    __VAR_TIMERID__ = setTimeout("helpUtil.closeInfoBar()", (strInfoTime == null)?2000:strInfoTime);
}

/**
 * 關閉提示訊息的畫面
 * @return 無
 * @type void
 */
HelpUtil.prototype.closeInfoBar = function()
{
	$objInfoBar = helpUtil.getObj("#___HELP_INFOBAR___");

	if ($objInfoBar.length==0 )
		return;

	if (__VAR_TIMERID__ != null) {
		clearTimeout(__VAR_TIMERID__);
		__VAR_TIMERID__ = null;
	}
	helpUtil.getObj("#___HELP_INFOBAR___").css("visibility", "hidden");
}

/**
 * 顯示資料處理中的畫面
 * @return 無
 * @type void
 */
HelpUtil.prototype.showProcessBar = function() 
{
	$objProcessBar = helpUtil.getObj("#___HELP_PROCESSBAR___");
	$objInfoBar = helpUtil.getObj("#___HELP_INFOBAR___");
	
	helpUtil.getObj("#img2", $objProcessBar).attr("src", helpUtil.getWebRoot()+"resource/image/loading.gif");
	helpUtil.getObj("#img3", $objProcessBar).attr("src", helpUtil.getWebRoot()+"resource/image/cancel.gif");
	
	if ($objProcessBar.length==0)
		return;
	
	var strInfoText = (arguments.length > 0)?arguments[0].toString():"資料處理中, 請稍待...";
	helpUtil.getObj("#font2", $objProcessBar).text(strInfoText);
	
	helpUtil.showWindowMask();
	helpUtil.getObj("#___HELP_PROCESSBAR___").css("visibility", "");
	helpUtil.getObj("#___HELP_PROCESSBAR___").css("top", document.body.scrollTop);
	helpUtil.getObj("#___HELP_PROCESSBAR___").css("left", document.body.scrollLeft);
}

/**
 * 關閉資料處理中的畫面
 * @return 無
 * @type void
 */
HelpUtil.prototype.closeProcessBar = function()
{
	$objProcessBar = helpUtil.getObj("#___HELP_PROCESSBAR___");
	
	if ($objProcessBar.length==0)
		return;

	helpUtil.closeWindowMask();
	helpUtil.getObj("#___HELP_PROCESSBAR___").css("visibility", "hidden");
}

/**
 * 顯示畫面的遮罩
 * @return 無
 * @type void
 */
HelpUtil.prototype.showWindowMask = function()
{
	helpUtil.getObj("#___HELP_WINDOWMASK___").css("visibility", "");
	helpUtil.getObj("#___HELP_WINDOWMASK___").css("top", document.body.scrollTop);
	helpUtil.getObj("#___HELP_WINDOWMASK___").css("left", document.body.scrollLeft);
}

/**
 * 關閉畫面的遮罩
 * @return 無
 * @type void
 */
HelpUtil.prototype.closeWindowMask = function()
{
	helpUtil.getObj("#___HELP_WINDOWMASK___").css("visibility", "hidden");
}

HelpUtil.prototype.getObj = function(selector)
{
	if( $(selector, helpUtil.divobj).length==0 )
		helpUtil.genMsgHtml();
	return $(selector, helpUtil.divobj);
}

HelpUtil.prototype.genMsgHtml = function()
{
	$("body").append(
			"<div id='___HELPOBJ___'><div id='___HELP_INFOBAR___' style='font:normal 12pt Arial;position:absolute; top:0px; left:0px; z-index: 100; width:100%; padding:0px 0px 0px 0px; margin:0px 0px 0px 0px; background-color:#FFFF99; border: #000000 1px solid;visibility:hidden' nowrap>" +
			"	<table width='100%'><tr>" +
			"	<td style='width:32px'><img id='img1' src='"+helpUtil.getWebRoot()+"resource/image/warn.gif' style='width:32px; height: 32px; vertical-align:middle'></td>" +
			"	<td><font id='font1' style='font:bold 17pt 新細明體; color: #996600'>111</font></td>" +
			"	<td style='width:32px'><img src='"+helpUtil.getWebRoot()+"resource/image/cancel.gif' alt='取消' style='float:right; cursor: pointer;width:32px; height: 32px; vertical-align:middle'></td>" +
			"	</tr></table>" +
			"</div>" +
			"<div id='___HELP_PROCESSBAR___' style='font:normal 12pt Arial;position:absolute; top: 0px; left: 0px; z-index: 1001; width: 100%; height: 35px; padding:0px 0px 0px 0px; margin:0px 0px 0px 0px; background-color:#FFFF99; border: #000000 1px solid; overflow:hidden;visibility:hidden'>" +
			"	<img id='img2' src='"+helpUtil.getWebRoot()+"resource/image/loading.gif' style='float:left;width:32px; height: 32px; vertical-align:middle'>" +
			"	<font id='font2' style='float:left; margin-top: 5px; font:bold 17pt 新細明體;'>資料處理中, 請稍待...</font>" +
			"	<img id='img3' src='"+helpUtil.getWebRoot()+"resource/image/cancel.gif' alt='取消' style='float:right; cursor: pointer;width:32px; height: 32px; vertical-align:middle'>" +
			"</div>" +
			"<div id='___HELP_WINDOWMASK___' style='position:absolute; top: 0px; left: 0px; z-index: 1000; width: 100%; height: 100%; padding:0px 0px 0px 0px; margin:0px 0px 0px 0px; background-color:#E8FCE4; opacity: 0.5;filter: Alpha(Opacity=50); overflow: hidden;visibility:hidden'>" +
			"	<iframe style='position:absolute;top:0px;left:0px;z-index:-1;filter:mask();width:100%;height:100%;'></iframe>" +
			"</div></div>"
		);
	helpUtil.divobj = $("#___HELPOBJ___", $("body"));
	$("img[alt=取消]:eq(0)", helpUtil.divobj).click(function(){
		helpUtil.closeInfoBar();
	})
	$("img[alt=取消]:eq(1)", helpUtil.divobj).click(function(){
		helpUtil.closeProcessBar();
	})
} 

//globe object
var helpUtil = new HelpUtil();
helpUtil.genMsgHtml();