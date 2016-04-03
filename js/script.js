function init() {
	
	/* Подгруппа */
	$(document).click(function(){
		$('.abs_list_block').hide();
	});
	
	$('.ab_select_wrap').click(function(e){
		
		var pnd = this.parentNode;
		var alb = [];
		alb = $(pnd).find('.abs_list_block');
		$(alb[0]).toggle();
		
		/* hide another */
		$('#'+reverseAss[pnd.id]).find('.abs_list_block').hide();
		
		e.stopPropagation();
	});
	
	/* initJsonGroup */
	$.getJSON('json/products-groups.json', function(data) {
		pgs = {};
		for (var d in data) {
			pgs[data[d]['id']] = data[d]['title'];
		}
		initJSON();
	});
	
}


function initJSON() {
	var iconsAss = {};
	iconsAss['001'] = 'abs_visa';
	iconsAss['002'] = 'abs_master';
	iconsAss['003'] = 'abs_master';
	iconsAss['004'] = 'abs_safe';
	iconsAss['005'] = 'abs_visa';
	iconsAss['006'] = 'abs_safe';
	iconsAss['007'] = 'abs_master';
	iconsAss['008'] = 'abs_visa';
	
	/* initJSON */
	$.getJSON('json/products.json', function(data) {
		ps = {};
		
		var tempObj1level = {};
		var tempObj2level = {};
		var tempObj3level = {};
		
		var tempStr = '';
		var tempCompleteArr = [];
		
		var alwArr = [];
		alwArr = $('.abs_list_wrap');
		for (var a=0;a<alwArr.length;a++) {
			tempCompleteArr.push([]);
		}
		
		if (!pgs['1']) {
			alert('no loaded');
		}
		
		for (var t in tempCompleteArr) {
			for (var d in data) {
				ps[data[d]['product_id']] = data[d];
				
				/* Obj itself */
				tempObj1level = document.createElement('div');
				$(tempObj1level).addClass('abs_object');
				$(tempObj1level).addClass(iconsAss[data[d]['product_id']]);
				$(tempObj1level).attr('rel',data[d]['product_id']);
				
				/* Ico obj */
				tempObj2level = document.createElement('div');
				$(tempObj2level).addClass('abso_icon');
				tempObj2level.innerHTML = '<br />';
				tempObj1level.appendChild(tempObj2level);
				
				/* Ico title */
				tempObj2level = document.createElement('div');
				$(tempObj2level).addClass('abso_title');
				tempObj2level.innerHTML = '&laquo;'+data[d]['product_name']+'&raquo; ';
				tempObj2level.innerHTML += pgs[data[d]['product_type'][0]] + ' ';
				tempObj2level.innerHTML += '****'+data[d]['product_number'].substr(data[d]['product_number'].length-4,4);
				
				tempObj1level.appendChild(tempObj2level);
				
				/* Price */
				tempObj2level = document.createElement('div');
				$(tempObj2level).addClass('abso_price');
				tempStr = data[d]['product_rest'];
				tempObj2level.innerHTML = '<span class="absop_rouble">'+tempStr.split('.')[0]+'</span>,';
				tempObj2level.innerHTML += '<span class="absop_kop">'+ tempStr.split('.')[1]+'</span> ';
				tempObj2level.innerHTML += '<span class="absop_currency">'+ data[d]['product_currency']+'</span>';
				tempObj1level.appendChild(tempObj2level);
				
				/* Checkbox */
				tempObj2level = document.createElement('div');
				$(tempObj2level).addClass('abso_state');
				tempObj2level.innerHTML = '<br />';
				tempObj1level.appendChild(tempObj2level);
				
				/* Clear Both */
				tempObj2level = document.createElement('div');
				$(tempObj2level).addClass('clear');
				tempObj2level.innerHTML = '<br />';
				tempObj1level.appendChild(tempObj2level);
				
				/* reaction */
				tempObj1level.onclick = function(){objectClicked(this);};
				tempObj1level.onmouseover = function(){objectHover(this);};
				
				/* obj to list */
				tempCompleteArr[t].push(tempObj1level);
			}
		}
		
		
		var bufferArr = [];
		
		for (var a=0;a<alwArr.length;a++) {
			for (var t in tempCompleteArr[a]) {
				$(alwArr[a]).append(tempCompleteArr[a][t]);
			}
		}
		
		/* Choose First Default */
		initStartList();
	});
}

/* Choosing object */
function objectClicked(thisObj) {
	if ((!$(thisObj).hasClass('abs_object_chosen'))&&(!$(thisObj).hasClass('abs_object_locked'))) {
		var pnd = thisObj.parentNode; // abs_list_wrap
		
		$(pnd).find('.abs_object_chosen').removeClass('abs_object_chosen');
		$(thisObj).addClass('abs_object_chosen');
		
		pnd = pnd.parentNode; // abs_list_block		
		pnd = pnd.parentNode; // ab_select_wrap
		pnd = pnd.parentNode; // account_block
		
		window[pnd.id] = $(thisObj).attr('rel');
		
		var anotherBlock = {};
		anotherBlock = $('#'+reverseAss[pnd.id]).find('.abs_list_wrap');
		
		$(anotherBlock).find('.abs_object_locked').removeClass('abs_object_locked');
		$(anotherBlock).find('div[rel='+window[pnd.id]+']').addClass('abs_object_locked');
		
		
		chooseBlock(thisObj,pnd.id);
	}
}

/* Changing Tooltip */
function objectHover(thisObj) {
	var tempObject = ps[$(thisObj).attr('rel')];
	var ttStr = '<div class="abtt_title">*Информация по продукту</div>';
	
	ttStr += '<div><span>тип счета</span> ';
	ttStr += pgs[tempObject['product_type'][0]]+'</div>';
	
	ttStr += '<div><span>номер</span> ';
	ttStr += tempObject['product_number']+'</div>';
	
	ttStr += '<div><span>ставка</span> ';
	ttStr += tempObject['product_tax'].replace('.',',')+'% годовых</div>';
	
	ttStr += '<div><span>дата открытия</span> ';
	ttStr += normalizeDate(tempObject['product_opened'])+'</div>';
	
	ttStr += '<div><span>дата окончания</span> ';
	ttStr += normalizeDate(tempObject['product_closed'])+'</div>';
	
	ttStr += '<div><span>адрес банка</span> ';
	ttStr += tempObject['product_bank_adress']+'</div>';
	
	ttStr += '<div><span>наименование ТБ</span> ';
	ttStr += tempObject['product_bank_name']+'</div>';
	
	ttStr += '<table>';
	
	ttStr += '<colgroup><col width="317" /><col width="75" /></colgroup>';
	
	ttStr += '<tr>';
	ttStr += '<td class="abt_title">валюта</td>';
	ttStr += '<td>'+tempObject['product_currency']+'</td>';
	ttStr += '</tr>';
	
	ttStr += '<tr>';
	ttStr += '<td class="abt_title">остаток</td>';
	ttStr += '<td>'+tempObject['product_rest'].replace('.',',')+'</td>';
	ttStr += '</tr>';
	
	ttStr += '<tr>';
	ttStr += '<td class="abt_title">доступно для совершения операции</td>';
	ttStr += '<td>'+tempObject['product_rest'].replace('.',',')+'</td>';
	ttStr += '</tr>';
	
	ttStr += '<tr>';
	ttStr += '<td class="abt_title">прогнозируемый остаток</td>';
	ttStr += '<td>0,00</td>';
	ttStr += '</tr>';
	
	ttStr += '</table>';
	
	
	
	$('.ab_tooltip').html(ttStr);
	
}

function normalizeDate(sourceDate) {
	var resultDate = '';
	if (sourceDate.length < 10) {
		resultDate = '0' + sourceDate;
	} else {
		resultDate = sourceDate;
	}
	return resultDate;
}

var lists = ['writeoff_account','enrollment_account'];
var reverseAss = {};

function initStartList() {
	
	var objectsList = [];
	var topObj = [];
	
	for (var l=0;l<lists.length;l++) {
		reverseAss[lists[l]] = lists[((l+1)%lists.length)];
	}
	
	for (var l in lists) {
		objectsList = [];
		objectsList = $('#'+lists[l]).find('.abs_list_wrap').find('.abs_object');
		
		window[lists[l]] = $(objectsList[l]).attr('rel');
		chooseBlock(objectsList[l],lists[l]);
		
	}
	
	$('.abs_topwrap').mouseover(function(){
		var abs_object = this.getElementsByTagName('div')[0];
		objectHover(abs_object);
	});
	
}

/* Choosing one block */
function chooseBlock(sourceBlock,listId) {
	var blocksList = [];
	blocksList = $('#'+listId).find('.abs_object');
	var topObj = blocksList[0];
	$(sourceBlock).addClass('abs_object_chosen');
	
	$('#'+reverseAss[listId]).find('div[rel='+$(sourceBlock).attr('rel')+']').addClass('abs_object_locked'); // blocking in another list
	
	topObj.outerHTML = sourceBlock.outerHTML;
	topObj.onmouseover = function(){objectHover(this);};
}