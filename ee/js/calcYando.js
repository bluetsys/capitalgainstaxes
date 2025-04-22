//양도소득세계산 입력값가져오기
function calcYandoTax(){
	
	var acqVal = 0;	//취득가액
	var trnsVal = 0;	//양도가액
	var reqExpnsVal = 0;	//소요경비
	
	var acqDate = new Date();		//취득일자
	var trnsDate = new Date();	//양도일자
	
	var arrRealEstDvCd = new Array();		//부동산구분코드
	
	var arrEtcDvCd = new Array();		//기타정보
	
	var houseQty = "";			//보유갯수
	var jntTncyDvCd = "";		//공동명의구분코드
	
	var obj = document.getElementById("divCalcRst");
	while(obj.hasChildNodes()){
		obj.removeChild(obj.childNodes[0]);
	}
	
	$("input[name=rdoType]").each(
			function(i){				
				arrRealEstDvCd[i] = this.checked;
				i++;
			}			
		);
	
	$("input[name=chkEtc]").each(
			function(i){				
				arrEtcDvCd[i] = this.checked;
				i++;
			}			
		);
	
	$("input[name=radQty]").each(
			function(){
				if($(this).is(":checked")){
					houseQty = $(this).val();					
				}
			}			
		);
	
	jntTncyDvCd = $("#chkJntTncy").is(":checked");
	
	acqVal = $("#acqVal").val();
	acqVal = acqVal.toString();
	acqVal = acqVal.replace(/,/gi, "");
	
	trnsVal = $("#trnsVal").val();
	trnsVal = trnsVal.toString();
	trnsVal = trnsVal.replace(/,/gi, "");
	
	reqExpnsVal = $("#reqExpnsVal").val();
	reqExpnsVal = reqExpnsVal.toString();
	reqExpnsVal = reqExpnsVal.replace(/,/gi, "");
	
	acqDate = $("#acqDate").val();
	trnsDate = $("#trnsDate").val();
	
	var trnsObj = new Object();
	trnsObj.arrRealEstDvCd = arrRealEstDvCd;
	trnsObj.arrEtcDvCd = arrEtcDvCd;
	trnsObj.houseQty = houseQty;
	trnsObj.jntTncyDvCd = jntTncyDvCd;
	trnsObj.acqVal = acqVal;
	trnsObj.trnsVal = trnsVal;
	trnsObj.reqExpnsVal = reqExpnsVal;
	trnsObj.acqDate = acqDate;
	trnsObj.trnsDate = trnsDate;
		
	//dispTrnsObj(trnsObj);
	
	trnsObj = calcTrnsTax(trnsObj);
		
	//dispCalcTrnsTax(trnsObj);
	
}

//양도소득세 계산
function calcTrnsTax(trnsObj){
	
	console.log("calcTrnsTax start");
	var arrRealEstDvCd = trnsObj.arrRealEstDvCd;			//주택구분코드
	var arrEtcDvCd = trnsObj.arrEtcDvCd;					//기타구분코드
	var houseQty = trnsObj.houseQty;						//주택수
	var acqVal = trnsObj.acqVal;								//취득가액
	var trnsVal = trnsObj.trnsVal;								//양도가액
	var reqExpnsVal = trnsObj.reqExpnsVal;					//소요경비
	var acqDate = trnsObj.acqDate;							//취득일자
	var trnsDate = trnsObj.trnsDate;							//양도일자
	
	var adjArea = arrEtcDvCd[ADJ_AREA_IDX];							//조정대상지역
	var flgTwoYrRealRsdn = arrEtcDvCd[TWO_YEAR_REAL_IDX];		//2년실거주
	var flgLentalLicn = arrEtcDvCd[LNT_LIC_IDX];						//임대사업자	
	
	var retnMth = mthDiff(acqDate, trnsDate);				//보유개월
	
	trnsObj.retnMth = retnMth;
	
	//일단 주택만 대상	
	console.log("houseQty : " + houseQty 
			+ "\n" + "flgTwoYrRealRsdn : " + flgTwoYrRealRsdn 
			+ "\n" + "flgLentalLicn : " + flgLentalLicn
			+ "\n" + "retnMth : " + retnMth
			+ "\n" + "trnsVal : " + trnsVal
			+ "\n" + "RETENT_MTH : " + RETENT_MTH
			+ "\n" + "HI_GRADE_AMT : " + HI_GRADE_AMT
			);
	
	if(houseQty == "1" && flgTwoYrRealRsdn && !flgLentalLicn 
			&& retnMth > RETENT_MTH 
			&& trnsVal <= HI_GRADE_AMT ){
		console.log("비과세");
		//비과세
		//1주택, 2년실거주, 임대사업자아니고, 보유기간 24개월초과, 양도가액 9억미만
		dispCalcTrnsNonTax(trnsObj);		
		
	} else if ( trnsVal - acqVal <= 0 ){
		//양도가액이 취득가액보다 작으면 비과세
		dispCalcTrnsNonTax(trnsObj);
		
	} else {
		//과세
		console.log("과세");		
		if(retnMth > RETENT_MTH){
			//보유개월 24개월 초과
			if(trnsVal > HI_GRADE_AMT){
				//9억초과 양도세 계산
				trnsObj = calcHiGrdTrnsTax(trnsObj);
				
			} else {
				//9억이하 양도세
				//1주택이상
				//표준과세율대로 계산
				trnsObj = calcGenTrnsTax(trnsObj);
				
			}
			
		} else {
			//보유개월 24개월 미만
			//표준세율에 따라 계산			
			trnsObj = calcGenTrnsTax(trnsObj);			
			
		}
		
		//양도세결과 표시
		dispCalcTrnsTaxTest(trnsObj);
		
	}

	console.log("calcTrnsTax end");
	
}

//양도소득세 표시
function dispCalcTrnsTaxTest(trnsObj){
	
	var trnsVal = trnsObj.trnsVal;
	var acqVal = trnsObj.acqVal;
	
	var acqDate = trnsObj.acqDate;
	var trnsDate = trnsObj.trnsDate;	
	var retnMth = mthDiff(acqDate, trnsDate);
	
	var obj = document.getElementById("divCalcRst");
	
	while(obj.hasChildNodes()){
		obj.removeChild(obj.childNodes[0]);
	}
	
	var newDIV = document.createElement("div");	
	newDIV.setAttribute("id", "divCalcRstDtl");
	newDIV.setAttribute("class", "ui-grid-c calcResult");
	
	newDIV.innerHTML = "<hr><hr>";
	newDIV.innerHTML += "<p>과세대상</p>";
	newDIV.innerHTML += "<div class='ui-block-a'>총양도세</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.totTaxAmt) + "원" + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";

	newDIV.innerHTML += "<div class='ui-block-a'>취득가액</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.acqVal) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";

	newDIV.innerHTML += "<div class='ui-block-a'>양도가액</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.trnsVal) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>소요경비</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.reqExpnsVal) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>취득일자</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" + trnsObj.acqDate + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>양도일자</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" + trnsObj.trnsDate + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>보유개월</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" + trnsObj.retnMth + "개월" + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>양도차익</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.trnsProfit) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>과세표준</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.taxGenAmt) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>표준세율</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.taxRt) + "%" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>양도소득세</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.trnsTax) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c textAlignRight'>(누진공제</div>";
	newDIV.innerHTML += "<div class='ui-block-d'>" + $.number(trnsObj.prgDedAmt) + "원)" + "</div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>주민세</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.rsdTax) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
		
	/*
	newDIV.innerHTML = "<hr>과세대상";	
    newDIV.innerHTML += "<hr><hr>"; 
//    newDIV.innerHTML += "realEstDvCd1 : " + realEstDvCd1 + "<br>";
    newDIV.innerHTML += "취득가액 : " + $.number(trnsObj.acqVal) + "<br>";
    newDIV.innerHTML += "양도가액 : " + $.number(trnsObj.trnsVal) + "<br>";
    newDIV.innerHTML += "소요경비 : " + $.number(trnsObj.reqExpnsVal) + "<br>";
    newDIV.innerHTML += "취득일자 : " + $.number(trnsObj.acqDate) + "<br>";
    newDIV.innerHTML += "양도일자 : " + $.number(trnsObj.trnsDate) + "<br>";
    newDIV.innerHTML += "보유개월 : " + $.number(retnMth) + "<br>";
    //newDIV.innerHTML += "양도차익 : " + (trnsVal - acqVal) + "<br>";
    newDIV.innerHTML += "과세금액 : " + $.number(trnsObj.taxGenAmt) + "<br>";
    newDIV.innerHTML += "양도차익 : " + $.number(trnsObj.trnsProfit) + "<br>";
    newDIV.innerHTML += "표준세율 : " + $.number(trnsObj.taxRt) + "<br>";
    newDIV.innerHTML += "양도소득세 : " + $.number(trnsObj.trnsTax) + "<br>";
    newDIV.innerHTML += "누진공제액 : " + $.number(trnsObj.prgDedAmt) + "<br>";    
    newDIV.innerHTML += "주민세 : " + $.number(trnsObj.rsdTax) + "<br>";    
    newDIV.innerHTML += "총금액 : " + $.number(trnsObj.totTaxAmt) + "<br>";
    */
	
    obj.appendChild(newDIV);
    
    var newDIVHr = document.createElement("div");
    newDIVHr.setAttribute("id", "divHr");
    newDIVHr.innerHTML = "<hr><hr>";
    
    obj.appendChild(newDIVHr);
	
}

//양도소득세계산값 표시
function dispCalcTrnsTax(trnsObj){
	
	var acqDate = trnsObj.acqDate;
	var trnsDate = trnsObj.trnsDate;	
	var retnMth = mthDiff(acqDate, trnsDate);
	
	//엘리먼트 추가
	var obj = document.getElementById("divCalcRst");
	var newDIV = document.createElement("div");
	
	newDIV.innerHTML = "<hr>추가된 DIV 입니다";
	newDIV.setAttribute("id", "divCalcRstDtl");
    newDIV.innerHTML += "<hr><hr>"; 
//    newDIV.innerHTML += "realEstDvCd1 : " + realEstDvCd1 + "<br>";
    newDIV.innerHTML += "acqVal : " + trnsObj.acqVal + "<br>";
    newDIV.innerHTML += "trnsVal : " + trnsObj.trnsVal + "<br>";
    newDIV.innerHTML += "reqExpnsVal : " + trnsObj.reqExpnsVal + "<br>";
    newDIV.innerHTML += "acqDate : " + trnsObj.acqDate + "<br>";
    newDIV.innerHTML += "trnsDate : " + trnsObj.trnsDate + "<br>";
    newDIV.innerHTML += "보유개월 : " + retnMth + "<br>";
    newDIV.innerHTML += "양도차익 : " + (trnsVal - acqVal) + "<br>";
    
    obj.appendChild(newDIV);
    
}

//양도소득세 비과세 표시
function dispCalcTrnsNonTax(trnsObj){
	//비과세표시
	var acqDate = trnsObj.acqDate;
	var trnsDate = trnsObj.trnsDate;	
	var retnMth = mthDiff(acqDate, trnsDate);
	
	var trnsVal = trnsObj.trnsVal;
	var acqVal = trnsObj.acqVal;
	
	//엘리먼트 추가
	var obj = document.getElementById("divCalcRst");
	var newDIV = document.createElement("div");
	newDIV.setAttribute("id", "divCalcRstDtl");
	newDIV.setAttribute("class", "calcResult");
	
	newDIV.innerHTML = "<hr><hr>취득세 계산 결과";	
    newDIV.innerHTML += "<hr><hr>"; 
    newDIV.innerHTML += "총양도세 : 비과세 입니다.<br>" ;

    newDIV.innerHTML += "취득가액 : " + $.number(trnsObj.acqVal) + "<br>";    
    newDIV.innerHTML += "양도가액 : " + $.number(trnsObj.trnsVal) + "<br>";
    newDIV.innerHTML += "소요경비 : " + $.number(trnsObj.reqExpnsVal) + "<br>";
    newDIV.innerHTML += "취득일자 : " + trnsObj.acqDate + "<br>";
    newDIV.innerHTML += "양도일자 : " + trnsObj.trnsDate + "<br>";
    newDIV.innerHTML += "보유개월 : " + retnMth + "<br>";
    newDIV.innerHTML += "양도차익 : " + $.number(trnsVal - acqVal) + "<br>";
    
    obj.appendChild(newDIV);
	
}

//양도소득세 표시
function dispTrnsObj(trnsObj){
	console.log("trnsObj.arrRealEstDvCd : " + trnsObj.arrRealEstDvCd);
	console.log("trnsObj.arrEtcDvCd : " + trnsObj.arrEtcDvCd);
	console.log("trnsObj.houseQty : " + trnsObj.houseQty);
	console.log("trnsObj.jntTncyDvCd : " + trnsObj.jntTncyDvCd);
	console.log("trnsObj.acqVal : " + trnsObj.acqVal);
	console.log("trnsObj.trnsVal : " + trnsObj.trnsVal);
	console.log("trnsObj.reqExpnsVal : " + trnsObj.reqExpnsVal);
	console.log("trnsObj.acqDate : " + trnsObj.acqDate);
	console.log("trnsObj.trnsDate : " + trnsObj.trnsDate);
}

//일반과세 세율 계산
function calcGenTrnsTax(trnsObj){
	
	var arrRealEstDvCd = trnsObj.arrRealEstDvCd;
	var arrEtcDvCd = trnsObj.arrEtcDvCd
	var houseQty = trnsObj.houseQty;
	var jntTncyDvCd = trnsObj.jntTncyDvCd;
	var acqVal = trnsObj.acqVal;
	var trnsVal = trnsObj.trnsVal;
	var reqExpnsVal = trnsObj.reqExpnsVal;
	var acqDate = trnsObj.acqDate;
	var trnsDate = trnsObj.trnsDate;
	var taxRtIdx = 0;
	var taxGenAmt = 0;		//과세표준금액

	var trnsProfit = 0;		//양도차익	
	
	var retnMth = trnsObj.retnMth;		//보유기간
	
	trnsProfit = Number(trnsVal) - Number(acqVal) - Number(reqExpnsVal);
	
	var taxRt = 0.0;		//과세율
	
	if(retnMth <= POSSESSION_PERIOD_12){
		//12개월이하
		if(jntTncyDvCd){
			//공동명의
			trnsProfit = Number(trnsProfit) / 2;
			taxGenAmt = Number(trnsProfit) - Number(BASIC_DEDUCT_AMT);
			
		} else {
			//단독명의
			taxGenAmt = Number(trnsProfit) - Number(BASIC_DEDUCT_AMT);
			
		}
		
		taxRt = mstEtcTaxRt[POSS_PERIOD_UND_12][HOS_TAX_RT_IDX];
		
	} else if(retnMth > POSSESSION_PERIOD_12){
		//12개월 이상
		if(jntTncyDvCd){
			//공동명의
			trnsProfit = Number(trnsProfit) / 2;
			taxRtIdx = getGenTaxRtIdx(trnsProfit, trnsDate);
			taxGenAmt = Number(trnsProfit) - Number(BASIC_DEDUCT_AMT);
			
			
		} else {
			//단독명의			
			taxRtIdx = getGenTaxRtIdx(trnsProfit, trnsDate);
			taxGenAmt = Number(trnsProfit) - Number(BASIC_DEDUCT_AMT);
			
		}
		
		taxRt = mstGenTaxRt[taxRtIdx][GEN_TAX_RT_IDX];
		
	}
	
	//주택수
	if(houseQty == "2"){
		taxRt = Number(taxRt) + Number(HOUSE_QTY_TWO_RATE);  
	} else if(houseQty == "3"){
		taxRt = Number(taxRt) + Number(HOUSE_QTY_MORE_RATE);
	} 
	
	var trnsTax = 0;			//양도세액
	var prgDedAmt = 0;	//누진공제액
	
	prgDedAmt = mstGenTaxRt[taxRtIdx][GEN_TAX_DED_AMT_IDX];
	trnsTax = Number(taxGenAmt) * Number(taxRt / 100) - Number(prgDedAmt);
		
	var rsdTax = 0.1;	//주민세	
	var totTaxAmt = 0;
	rsdTax =  Number(trnsTax * rsdTax);
	totTaxAmt = Number(trnsTax) + Number(rsdTax);	
	
	if(jntTncyDvCd){
		//공동명의
		totTaxAmt = totTaxAmt * 2;
	}
	
	trnsObj.taxGenAmt = taxGenAmt;
	trnsObj.trnsProfit = trnsProfit;
	trnsObj.taxRt = taxRt;
	trnsObj.trnsTax = trnsTax;
	trnsObj.prgDedAmt = prgDedAmt;
	trnsObj.rsdTax = rsdTax;
	trnsObj.totTaxAmt = totTaxAmt;
	
	return trnsObj;
	
}

//양도소득세 과제세율 index 가져오기
function getGenTaxRtIdx(trnsProfit, trnsDate){
	console.log("trnsProfit : " + trnsProfit);
	var minAmt = 0;
	var maxAmt = 0;
	var fromDate;
	var maxDate;
	
	trnsDate = trnsDate.replace(/-/gi, "");

	var i = 0;
	for(i = 0; i < mstGenTaxRt.length; i++){
		minAmt = mstGenTaxRt[i][GEN_TAX_MIN_AMT_IDX];
		maxAmt = mstGenTaxRt[i][GEN_TAX_MAX_AMT_IDX];
		fromDate = mstGenTaxRt[i][GEN_TAX_FROM_DATE_IDX];
		maxDate = mstGenTaxRt[i][GEN_TAX_TO_DATE_IDX];

		if(trnsProfit >= MAX_PRF_AMT){
			if(maxAmt == 0
					&& trnsDate >= fromDate && trnsDate <= maxDate){

				return i;
			}
		} else {
			if(trnsProfit >= minAmt && trnsProfit <= maxAmt
					&& trnsDate >= fromDate && trnsDate <= maxDate){
				return i;
			}
			
		}
		
	}
	
}

//화면 초기화
function initYandoTax(){ 
	var rdoIdx = 0;
	$('input:radio[name="rdoType"]').each(function() {			
			if(rdoIdx == 0){
				$(this).prop('checked', true);
			} else {
				$(this).prop('checked', false);
			}
			rdoIdx++;
	   }	).checkboxradio('refresh');
	
	$('input:checkbox[name="chkEtc"]').each(function() {
	      $(this).prop('checked', false);
	   }	).checkboxradio('refresh');
	
	rdoIdx = 0;
	$('input:radio[name="radQty"]').each(function() {			
		if(rdoIdx == 0){
			$(this).prop('checked', true);
		} else {
			$(this).prop('checked', false);
		}
		rdoIdx++;
   }	).checkboxradio('refresh');
		
	$("#chkJntTncy").prop('checked', false).checkboxradio('refresh');
	
	$("#acqVal").val("");
	$("#trnsVal").val("");
	$("#reqExpnsVal").val("");
	$("#acqDate").val("");
	$("#trnsDate").val("");

	var obj = document.getElementById("divCalcRst");
	while(obj.hasChildNodes()){
		obj.removeChild(obj.childNodes[0]);
	}
	
}

//고가주택 양도세 계산
function calcHiGrdTrnsTax(trnsObj){
	console.log("고가주택 양도세 계산");
	//양도차익 = 양도가액 - 취득가 - 필요경비
	
	//고가주택 양도차익
	//양도차익 * ((양도가액 - 9억) / 양도가액)
	
	//양도소득금액
	//양도차익 - 장기보유특별공제
	
	//과세표준
	//양도소득금액 - 양도소득기본공제
	
	//산출세액
	//양도소득과세표준 * 양도소득세율 - 누진공제액
	
	console.log("calcHiGrdTrnsTax start");
	var arrRealEstDvCd = trnsObj.arrRealEstDvCd;			//주택구분코드
	var arrEtcDvCd = trnsObj.arrEtcDvCd;					//기타구분코드
	var houseQty = trnsObj.houseQty;						//주택수
	var acqVal = trnsObj.acqVal;								//취득가액
	var trnsVal = trnsObj.trnsVal;								//양도가액
	var reqExpnsVal = trnsObj.reqExpnsVal;					//소요경비
	var acqDate = trnsObj.acqDate;							//취득일자
	var trnsDate = trnsObj.trnsDate;							//양도일자
	
	var adjArea = arrEtcDvCd[ADJ_AREA_IDX];							//조정대상지역
	var flgTwoYrRealRsdn = arrEtcDvCd[TWO_YEAR_REAL_IDX];		//2년실거주
	var flgLentalLicn = arrEtcDvCd[LNT_LIC_IDX];						//임대사업자	
	
	var jntTncyDvCd = trnsObj.jntTncyDvCd;					//공동명의
	
	var retnMth = mthDiff(acqDate, trnsDate);				//보유개월
	
	trnsObj.retnMth = retnMth;
	
	//일단 주택만 대상	
	console.log("houseQty : " + houseQty 
			+ "\n" + "flgTwoYrRealRsdn : " + flgTwoYrRealRsdn 
			+ "\n" + "flgLentalLicn : " + flgLentalLicn
			+ "\n" + "retnMth : " + retnMth
			+ "\n" + "trnsVal : " + trnsVal
			+ "\n" + "RETENT_MTH : " + RETENT_MTH
			+ "\n" + "HI_GRADE_AMT : " + HI_GRADE_AMT
			+ "\n" + "acqVal : " + acqVal
			+ "\n" + "reqExpnsVal : " + reqExpnsVal
			);
	
	
	//양도차익
	var trnsProfit = 0;
	trnsProfit = Number(trnsVal) - Number(acqVal) - Number(reqExpnsVal);
	trnsProfit = Number(trnsProfit) * Number((Number(trnsVal) - Number(HI_GRADE_AMT)) / Number(trnsVal)) ;
	trnsObj.trnsProfit = trnsProfit;
	console.log("trnsProfit : " + trnsProfit);
	
	var lngTrmDedTaxRt = 0;		//장기보유특별공제세율
	
	lngTrmDedTaxRt = getLngTrmDedTaxRt(trnsObj);
	trnsObj.lngTrmDedTaxRt = lngTrmDedTaxRt;		//장기보유특별공제세율
	console.log("lngTrmDedTaxRt : " + lngTrmDedTaxRt);
	
	var lngTrmDedTaxAmt = 0;		//장기보유특별공제액
	lngTrmDedTaxAmt = trnsProfit * lngTrmDedTaxRt / 100;
	trnsObj.lngTrmDedTaxAmt = lngTrmDedTaxAmt;		//장기보유특별공제액
	console.log("lngTrmDedTaxAmt : " + lngTrmDedTaxAmt);
	
	//양도소득금액
	//양도차익 - 장기보유특별공제
	var cptGainAmt = 0;		//양도소득금액
	cptGainAmt = trnsProfit - lngTrmDedTaxAmt;
	trnsObj.cptGainAmt = cptGainAmt;
	console.log("lngTrmDedTaxRt : " + lngTrmDedTaxRt);
	console.log("cptGainAmt : " + cptGainAmt);
	
	//과제표준세율
	var taxRtIdx = 0;
	taxRtIdx = getGenTaxRtIdx(cptGainAmt, trnsDate);
	console.log("taxRtIdx : " + taxRtIdx);
	
	var taxRt = 0;
	taxRt = mstGenTaxRt[taxRtIdx][GEN_TAX_RT_IDX];
	
	var taxGenAmt = 0;
	if(jntTncyDvCd){
		//공동명의
		trnsProfit = Number(cptGainAmt) / 2;
		taxRtIdx = getGenTaxRtIdx(cptGainAmt, trnsDate);
		taxGenAmt = Number(cptGainAmt) - Number(BASIC_DEDUCT_AMT);
		
		
	} else {
		//단독명의			
		taxRtIdx = getGenTaxRtIdx(cptGainAmt, trnsDate);
		taxGenAmt = Number(cptGainAmt) - Number(BASIC_DEDUCT_AMT);
		
	}
	
	//주택수
	if(houseQty == "2"){
		taxRt = Number(taxRt) + Number(HOUSE_QTY_TWO_RATE);  
	} else if(houseQty == "3"){
		taxRt = Number(taxRt) + Number(HOUSE_QTY_MORE_RATE);
	} 
	
	var trnsTax = 0;			//양도세액
	var prgDedAmt = 0;	//누진공제액
	
	prgDedAmt = mstGenTaxRt[taxRtIdx][GEN_TAX_DED_AMT_IDX];
	trnsTax = Number(taxGenAmt) * Number(taxRt / 100) - Number(prgDedAmt);
		
	var rsdTax = 0.1;	//주민세	
	var totTaxAmt = 0;
	rsdTax =  Number(trnsTax * rsdTax);
	totTaxAmt = Number(trnsTax) + Number(rsdTax);	
	
	if(jntTncyDvCd){
		//공동명의
		totTaxAmt = totTaxAmt * 2;
	}
	
	trnsObj.taxGenAmt = taxGenAmt;			//표준과세금액
	trnsObj.trnsProfit = trnsProfit;				//양도차익
	trnsObj.taxRt = taxRt;						//표준양도세율
	trnsObj.trnsTax = trnsTax;					//양도세
	trnsObj.prgDedAmt = prgDedAmt;		//누진공제액
	trnsObj.rsdTax = rsdTax;					//주민세
	trnsObj.totTaxAmt = totTaxAmt;			//총양도세액	
	
	console.log("trnsObj : " + trnsObj);
		
	//고액양도세결과 표시
	dispCalcHignGrdTrnsTaxRst(trnsObj);
	
}

//누진공제율구하기
function getLngTrmDedTaxRt(trnsObj){

	console.log("getLngTrmDedTaxRt start");
	
	var retnMth = 0;	
	retnMth = trnsObj.retnMth;		//보유개월
	
	console.log("retnMth : " + retnMth);
	var retnYr = 0;		//보유년수
	if(Number(retnMth) % 12 == 0){
		retnYr = parseInt(parseInt(Number(retnMth))/12 - 1);
	} else {
		retnYr = parseInt(parseInt(Number(retnMth))/12);
	}
	
	console.log("retnYr : " + retnYr);
	
	var trnsDate = trnsObj.trnsDate;							//양도일자
	trnsDate = trnsDate.replace(/-/gi, "");
	
	var lngTrmDedTaxRt = 0;		//장기보유공제세율
	
	var arrRealEstDvCd = trnsObj.arrRealEstDvCd;			//주택구분코드
	
	var realEstDvCdIdx = 0;
	for(var i = 0; i < arrRealEstDvCd.lenth; i++){
		if(arrRealEstDvCd[i]){
			realEstDvCdIdx = i;
			break;
		}
	}
	
	console.log("realEstDvCdIdx : " + realEstDvCdIdx);
	
	var lngTermDcdIdx = 0;
	
	if( realEstDvCdIdx == HOS_TAX_RT_IDX){
		lngTermDcdIdx = LNG_POSS_ONE_HOS_YR_IDX;
	} else if( realEstDvCdIdx == BLD_TAX_RT_IDX){
		lngTermDcdIdx = LNG_POSS_MUT_HOS_YR_IDX;
	} else if( realEstDvCdIdx == LND_TAX_RT_IDX){
		lngTermDcdIdx = LNG_POSS_LENT_YR_IDX;
	}

	for(var i = 0; i < mstLngTermPossTaxRt.length; i++){
		console.log("trnsDate : " + trnsDate);
		console.log("mstLngTermPossTaxRt[i][LNG_POSS_EFCT_ST_IDX] : " + mstLngTermPossTaxRt[i][LNG_POSS_EFCT_ST_IDX]);
		console.log("mstLngTermPossTaxRt[i][LNG_POSS_EFTC_ED_IDX] : " + mstLngTermPossTaxRt[i][LNG_POSS_EFTC_ED_IDX]);
		console.log("mstLngTermPossTaxRt[i][LNG_POSS_ST_YR_IDX] : " + mstLngTermPossTaxRt[i][LNG_POSS_ST_YR_IDX]);
		console.log("mstLngTermPossTaxRt[i][LNG_POSS_ED_YR_IDX] : " + mstLngTermPossTaxRt[i][LNG_POSS_ED_YR_IDX]);
		console.log("mstLngTermPossTaxRt[i][LNG_POSS_EFCT_ST_IDX] >= trnsDate : " + (mstLngTermPossTaxRt[i][LNG_POSS_EFCT_ST_IDX] >= trnsDate));
		console.log("trnsDate <= mstLngTermPossTaxRt[i][LNG_POSS_EFTC_ED_IDX] :" + (trnsDate <= mstLngTermPossTaxRt[i][LNG_POSS_EFTC_ED_IDX]));
		console.log("mstLngTermPossTaxRt[i][LNG_POSS_ST_YR_IDX] >= retnYr :" + (mstLngTermPossTaxRt[i][LNG_POSS_ST_YR_IDX] >= retnYr));
		console.log("retnYr < mstLngTermPossTaxRt[i][LNG_POSS_ED_YR_IDX] :" + (retnYr < mstLngTermPossTaxRt[i][LNG_POSS_ED_YR_IDX]));
		if(mstLngTermPossTaxRt[i][LNG_POSS_EFCT_ST_IDX] <= trnsDate && trnsDate <= mstLngTermPossTaxRt[i][LNG_POSS_EFTC_ED_IDX]
			&& mstLngTermPossTaxRt[i][LNG_POSS_ST_YR_IDX] <= retnYr && retnYr < mstLngTermPossTaxRt[i][LNG_POSS_ED_YR_IDX]
			){
			lngTrmDedTaxRt = mstLngTermPossTaxRt[i][lngTermDcdIdx];
			return lngTrmDedTaxRt;
		}
		
	}
	
	
	
}

function dispCalcHignGrdTrnsTaxRst(trnsObj){
	
	console.log("dispCalcHignGrdTrnsTaxRst start");
	
	var trnsVal = trnsObj.trnsVal;
	var acqVal = trnsObj.acqVal;
	
	var acqDate = trnsObj.acqDate;
	var trnsDate = trnsObj.trnsDate;	
	var retnMth = mthDiff(acqDate, trnsDate);
	
	var obj = document.getElementById("divCalcRst");
	
	while(obj.hasChildNodes()){
		obj.removeChild(obj.childNodes[0]);
	}
	
	var newDIV = document.createElement("div");	
	newDIV.setAttribute("id", "divCalcRstDtl");
	newDIV.setAttribute("class", "ui-grid-c calcResult");
	
	newDIV.innerHTML = "<hr><hr>";
	newDIV.innerHTML += "<p>과세대상</p>";
	newDIV.innerHTML += "<div class='ui-block-a'>총양도세</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.totTaxAmt) + "원" + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";

	newDIV.innerHTML += "<div class='ui-block-a'>취득가액</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.acqVal) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";

	newDIV.innerHTML += "<div class='ui-block-a'>양도가액</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.trnsVal) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>소요경비</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.reqExpnsVal) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>취득일자</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" + trnsObj.acqDate + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>양도일자</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" + trnsObj.trnsDate + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>보유개월</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" + trnsObj.retnMth + "개월" + "</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>양도소득금액</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.cptGainAmt) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	
	newDIV.innerHTML += "<div class='ui-block-a'>양도세과세대상금액</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.trnsProfit) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>장기보유특별공제세율</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.lngTrmDedTaxRt) + "%" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>장기보유특별공제액</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.lngTrmDedTaxAmt) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";	
	
	newDIV.innerHTML += "<div class='ui-block-a'>양도차익</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.trnsProfit) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>과세표준</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.taxGenAmt) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>표준세율</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.taxRt) + "%" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>양도소득세</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.trnsTax) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c textAlignRight'>(누진공제</div>";
	newDIV.innerHTML += "<div class='ui-block-d'>" + $.number(trnsObj.prgDedAmt) + "원)" + "</div>";
	
	newDIV.innerHTML += "<div class='ui-block-a'>주민세</div>";
	newDIV.innerHTML += "<div class='ui-block-b textAlignRight'>" +$.number(trnsObj.rsdTax) + "원" +"</div>";
	newDIV.innerHTML += "<div class='ui-block-c'></div>";
	newDIV.innerHTML += "<div class='ui-block-d'></div>";
	
    obj.appendChild(newDIV);
    
    var newDIVHr = document.createElement("div");
    newDIVHr.setAttribute("id", "divHr");
    newDIVHr.innerHTML = "<hr><hr>";
    
    obj.appendChild(newDIVHr);	
	
}