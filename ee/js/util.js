
function inputAddPeriod(inputId)
{	
	//alert("inputId : " + inputId);
	var selId = "#" + inputId;
    var nStr = $(selId).val();
    //alert("nStr : " + $.number(nStr));
    $(selId).val($.number(nStr));
    
}

function mthDiff(date1, date2){
	
	date1 = date1.replace(/-/gi, "");
	date2 = date2.replace(/-/gi, "");
	
	date1 = new Date(date1.substr(0,4),date1.substr(4,2)-1,date1.substr(6,2)); 
	date2 = new Date(date2.substr(0,4),date2.substr(4,2)-1,date2.substr(6,2));

	var interval = date2 - date1;
	var day = 1000*60*60*24;
	var month = day*30;
	var year = month*12;
	
	//console.log("기간 개월수: 약 " + parseInt(interval/month) + "개월");
	return parseInt(interval/month);
	
}

function yrDiff(date1, date2){
	
	date1 = date1.replace(/-/gi, "");
	date2 = date2.replace(/-/gi, "");
	
	date1 = new Date(date1.substr(0,4),date1.substr(4,2)-1,date1.substr(6,2)); 
	date2 = new Date(date2.substr(0,4),date2.substr(4,2)-1,date2.substr(6,2));

	var interval = date2 - date1;
	var day = 1000*60*60*24;
	var month = day*30;
	var year = month*12;
	
	//console.log("기간 개월수: 약 " + parseInt(interval/month) + "개월");
	return parseInt(interval/year);
	
}