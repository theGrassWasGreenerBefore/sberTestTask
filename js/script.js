
function init() {
	
	$(document).click(function(){
		$('.abs_list_block').hide();
	});
	
	$('.ab_select_wrap').click(function(e){
		
		
		var pnd = this.parentNode;
		var alb = [];
		alb = $(pnd).find('.abs_list_block');
		$(alb[0]).toggle();
		e.stopPropagation();
	});
	
	$.getJSON('json/products.json', function(data) {
		console.log(data);
	});
	
}