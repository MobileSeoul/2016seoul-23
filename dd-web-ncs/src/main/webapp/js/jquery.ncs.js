
$(function(){
	if($(".onoffBtn").length != 0) {
		js.onoff();
	}
	
	$("input[type=text][name!=id],textarea").css("ime-mode", "active");
});

/************************************************************
	 Common Jacascript
	 Data : 2015.04.15
	 Developer : Sung Min Chang
************************************************************/

var js = {
	nav : function(menu1, menu2, menu3){ 
		 var $menu1 = $(".subNav ul li[data-menu1-id='" + menu1 + "']");
		 $menu1.addClass("on");
		 if(menu2 != undefined){
			 var $menu2 = $menu1.find("ol li[data-menu2-id='" + menu2 + "']");
			 $menu2.addClass("on");
			 if(menu3 != undefined){
				 $menu2.find("p[data-menu3-id='" + menu3 + "']").addClass("on");
			 }
		 }
		
		/*var $nav = $(".subNav"),
			$li = $nav.find(" > ul > li"),
			now = be = (lnb != 99) ? lnb : 99,
			setTime = null;
		
		$li.eq(lnb).addClass("on").find(" > ol > li").eq(sub).addClass("on");*/
		
	},
	onoff : function(){
		
		var $inp = $(".onoffBtn"),
			agt = navigator.userAgent.toLowerCase();

		var inpPos = function(idx){
			var posVal = ["bottom", "top"];
			var posIdx = ($inp.eq(idx).find("input").is(":checked")) ? 0 : 1;
			$inp.eq(idx).find("label").css("background-position","left "+posVal[posIdx]);
		};

		$inp.each(function(idx){
			inpPos(idx);
			$(this).find("input").bind("change", function(){
				inpPos(idx);
			});
		});


	}
};



/************************************************************
	 view More Jacascript
	 Data : 2015.09.29
	 Developer : Sung Min Chang
************************************************************/

var viewTab = function(){
	
	var $viewBtn = $(".viewBtn"),
		$viewBox = $(".viewBox");

	$viewBtn.each(function(idx){

		var onOff = ($viewBox.eq(idx).css("display") != "none") ? "left top" : "left bottom";
		$(this).find("a:last-child").css("background-position" , onOff);

		$(this).find("a:last-child").unbind("click");
		$(this).find("a:last-child").bind("click", function(){
			var pos = ($viewBox.eq(idx).css("display") == "none") ? "left top" : "left bottom",
				dis = ($viewBox.eq(idx).css("display") != "none") ? "none" : "block";
			$(this).css("background-position" , pos);
			$viewBox.eq(idx).css("display", dis);

		});
	});

}



/************************************************************
	 CheckBox Jacascript
	 Data : 2015.03.19
	 Developer : Sung Min Chang
************************************************************/

var ckFn = function(obj){
	var $obj = $("."+obj),
		$allCk = $obj.find("input[name=allCk]"),
		$ck = $obj.find("input[name=ck]"),
		num = max = 0,
		ckAt = cls = null,
		max = $ck.length;

	$allCk.bind("click", function(){

		num  = ($allCk.attr("checked") == "checked") ? max : 0,
		ckAt = ($allCk.attr("checked") == "checked") ? true : false;
		
		$ck.attr("checked", ckAt);

	});

	$ck.each(function(idx){
		$(this).bind("click", function(){

			num = ($(this).attr("checked") == "checked") ? num+1 : num-1,
			ckAt = (num == max) ? true : false;

			$allCk.attr("checked", ckAt);

		});
	});

};


/************************************************************
	 Popup Jacascript
	 Data : 2014.10.29
	 Developer : Sung Min Chang
************************************************************/

var pop = {
	open : function(obj, url){
		$obj = $("#"+obj);
		
		if (url && $obj.find("iframe").attr("src") != url) {
			$obj.find("iframe").attr("src", url);
		}

		$obj.fadeIn(500);
		$(".popBg").fadeIn(500);

		if (!obj.match(/_full$/)) {
			setTimeout(function(){
				$obj.css({
					"margin-left" : -1*($obj.outerWidth()/2) + "px",
					"margin-top" : -1*($obj.outerHeight()/2) + "px"
				});
			},50);
		}
	},
	close : function(obj){
		if(obj == undefined){
			var $obj = $(".layPop");

			$obj.fadeOut(300);
			$(".popBg").fadeOut(300);
		}else{
			var $obj = $("#"+obj);

			$obj.fadeOut(500);
		}
	},
	chang : function(obj){
		$obj = $("#"+obj);

		$obj.fadeIn(500);

		if (!obj.match(/_full$/)) {
			setTimeout(function(){
				$obj.css({
					"z-index" : "120",
					"margin-left" : -1*($obj.outerWidth()/2) + "px",
					"margin-top" : -1*($obj.outerHeight()/2) + "px"
				});
			},50);
		}
	}
};


/************************************************************
Round calculation Javascript
Data : 2015.12.20
Developer : Min Wook Kim
************************************************************/
var roundCal = function(val){
	val += "";
	if(jQuery.isNumeric(val.replace(/,/gi,""))){
		value = val.replace(/,/gi,"") * 1;		
		return (Math.round(value * 10 * 10) / 100);	
	}else{
		return val;
	}	
}

/************************************************************
이벤트 실행 중지
Data : 2015.12.20
Developer : Min Wook Kim
************************************************************/
jQuery.hrefStop = function (event) {
	if (event.preventDefault) {
		event.preventDefault();
	} else if (event.stopPropagation) {
		event.stopPropagation();
	} else {
		event.stop();
	}
	event.returnValue = false;
}



/************************************************************
IE8 대응
Data : 2015.12.29
Developer : Min Wook Kim
************************************************************/
if (!Array.indexOf) {
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
			if(this[i]==obj){
				return i;
			}
		}
		
		return -1;
	}
}
/************************************************************
소수점 2자리 이후 절사
Data : 2015.12.20
Developer : Min Wook Kim
************************************************************/
var floorCal = function(val){
	val += "";
	if(jQuery.isNumeric(val.replace(/,/gi,""))){
		value = val.replace(/,/gi,"") * 1;		
		return (Math.floor(value * 10 * 10) / 100);	
	}else{
		return val;
	}
}


var printPop = function(page, param) {
	window.open(page + window.location.search + (param ? param : ""), "print", "width=910,height=600,scrollbars=1");
}


//평가 제외 alert
var exceptMsg = function(){
	alert("평가 제외된 학생입니다.\n종합평가에서 평가제외 해제 후 이용해주세요.");
}


var printScreen = function() {
	//$("textarea.noPrint|input[type!=radio][type!=checkbox][type!=hidden].noPrint").each(function() {
	$("#inputBody textarea").each(function() {
		if ($(this).parent().find(".inputPrint").length == 0) {
			$(this).before('<div class="inputPrint left printOnly"></div>');
		}
		
		$(this).parent().find(".inputPrint").html(this.value.replace(/</g, "&lt;").replace(/\n/g, "<br/>"));
	});
	$("#inputBody input[type!=radio][type!=checkbox][type!=hidden]").each(function() {
		if ($(this).parent().find(".inputPrint").length == 0) {
			$(this).before('<div class="inputPrint left printOnly"></div>');
		}
		
		$(this).parent().find(".inputPrint").html(this.value.replace(/</g, "&lt;").replace(/\n/g, "<br/>"));
	});
	window.print();
}


var lod = {
	open : function(){
		$("body").append("<div class='loding'><img src='/images/common/ico_loding.gif' alt='' /></div>");
	},
	close : function(){
		$(".loding").remove();
	}
}

//팝업 기능 추가
var winPop = function(url,name,opt){
	window.open(url, name, opt);
}