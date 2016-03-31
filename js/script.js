
function init() {
	/*
	$(document).click(function(){
		$('.abs_list_block').hide();
	});
	*/
	/*
	$('.ab_select_wrap *').click(function(e){
		e.stopPropogation();
	});
	*/
	
	$('.ab_select_wrap').click(function(e){
		
		
		var pnd = this.parentNode;
		var alb = [];
		alb = $(pnd).find('.abs_list_block');
		$(alb[0]).toggle();
		e.stopPropogation();
	});
	
	
}