function WizardControlUtil() {
}

WizardControlUtil.prototype.pageIndex = 0;
WizardControlUtil.prototype.stepclick = function(step){return true};
WizardControlUtil.prototype.finishclick = function(){return true};

WizardControlUtil.prototype.autoset = function($div, $body, win) {
	
	$div.each(function(){
		
		stepclick = typeof($(this).attr("stepclick"))=="string" ? $(this).attr("stepclick") : "";
		if( stepclick!="" && typeof(eval("win."+stepclick))=="function" )
			wizardControlUtil.stepclick = eval("win."+stepclick);
		finishclick = typeof($(this).attr("finishclick"))=="string" ? $(this).attr("finishclick") : "";
		if( finishclick!="" && typeof(eval("win."+finishclick))=="function" )
			wizardControlUtil.finishclick = eval("win."+finishclick);
		
		$(this).css("margin", "0px")
		var wizardPages = [];
		$wizard = $("span[wizard]", $(this));
		$wizard.each(function(){
			wizardPages.push({
					title: $(this).attr("title"), 
					content:$(this).children()
				});
		})		
		
		wizardPages = {
			 pages: wizardPages
		};
		
		wizardControlUtil.iniDiv($(this));
		wizardControlUtil.setAllPage({
			targetObj : $(this),
			pages: wizardPages
		}); 
		$('#fuelux-wizard-container', $(this)).ace_wizard(
			).on('actionclicked.fu.wizard' , function(e, info){
				return wizardControlUtil.stepclick(info.step);
			}).on('finished.fu.wizard', function(e) {
				return wizardControlUtil.finishclick();
			})
		$("span[wizard]", $(this)).remove();
	})
	
}

WizardControlUtil.prototype.iniDiv = function(divObj) {	
	
	divObj.append(
			"<div class='widget-body'>"+
			"	<div class='widget-main'>"+
			"		<div id='fuelux-wizard-container'>"+
			"			<div>"+
			"				<ul class='steps' id='step'>"+
			"				</ul>"+
			"			</div>"+
			"			<hr />"+
			"			<div class='step-content pos-rel' id='content'>"+
			"			</div>"+
			"		</div>"+
			"		<hr />"+
			"		<div class='wizard-actions'>"+
			"			<button class='btn btn-prev'>"+
			"				<i class='ace-icon fa fa-arrow-left'></i>上一步"+
			"			</button>"+
			"			<button class='btn btn-success btn-next' data-last='結　束'>"+
			"				下一步<i class='ace-icon fa fa-arrow-right icon-on-right'></i>"+
			"			</button>"+
			"		</div>"+
			"	</div>"+
			"</div>"
		)
}

WizardControlUtil.prototype.setAllPage = function(options) {
	
	var pages = options.pages.pages;
	var divObj = options.targetObj;	
	
	for(var i=0;i<pages.length;i++) {
		wizardControlUtil.addPage(divObj, pages[i]);
	}
	
	if( pages.length>0 ) {
		$(".steps li:eq(0)", divObj).addClass("active");
	}
};

WizardControlUtil.prototype.addPage = function(divObj, page) {

	var step 	= $("#step", divObj)
	var content 	= $("#content", divObj)
	var idx = $("li", step).length+1;
	step.append(
			"<li data-step='"+idx+"'>"+
			"	<span class='step'>"+idx+"</span>"+
			"	<span class='title'>"+page.title+"</span>"+
			"</li>"
		);		
	content.append(
			"<div class='step-pane' data-step='"+idx+"'>"+
			"</div>"
		);	
	$("div:last", content).append(page.content)
}

var wizardControlUtil = new WizardControlUtil();