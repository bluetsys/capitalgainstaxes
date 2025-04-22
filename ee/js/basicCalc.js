var view = 0;
var flag = 0;
var temp = 0;

var pointFlag = false;

function btnNumber(panelId, num) {
	var selId = "#" + panelId;
	if (!pointFlag) {
		if (Number(view) == 0 && num == 0) {
			
		} else if (Number(view) == 0 && num != 0) {			
			view = num;
			
		} else if (Number(view) != 0) {			
			view = view + "" + num;
			
		}		
		$(selId).text(view);

	} else {
		view = view + "" + num;		
		$(selId).text(view);
		
	}

}

function btnClear(panelId) {
	var selId = "#" + panelId;
	view = 0;
	$(selId).text(0);

}

function btnPlus(panelId){	
	temp = view;
	flag = 1;
	view = 0;		
	pointFlag = false;
}

function btnMinus(panelId){	
	temp = view;
	flag = 2;
	view = 0;		
	pointFlag = false;
}

function btnMulti(panelId){	
	temp = view;
	flag = 3;
	view = 0;		
	pointFlag = false;
}

function btnDivide(panelId){	
	temp = view;
	flag = 4;
	view = 0;
	pointFlag = false;		

}

function btnEqual(panelId) {
	var selId = "#" + panelId;
	if (flag == 1) {
		temp = Number(temp) + Number(view);
	} else if (flag == 2) {
		temp = Number(temp) - Number(view);
	} else if (flag == 3) {
		temp = Number(temp) * Number(view);
	} else if (flag == 4) {
		temp = Number(temp) / Number(view);
	}

	$(selId).text(temp);

	pointFlag = false;
	view = 0;		

}

function btnBackspace(panelId) {
	var selId = "#" + panelId;
	view = view.substring(0, view.length-1);
	$(selId).text(view);	
}

function btnPoint(panelId) {
	var selId = "#" + panelId;
	pointFlag = true;
	view += ".";
	$(selId).text(view);
}