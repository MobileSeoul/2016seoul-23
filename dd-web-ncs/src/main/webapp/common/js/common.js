//이전으로 돌아가기
$(document).on("click",".btn-back",function(){
	history.back();
});

//문서별 확장자
var imageExt = new Array('jpg', 'png', 'gif', 'jpeg', 'bmp');
var movieExt = new Array('mp4', 'mp3');
var docExt = new Array('pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'hwp');
var otherExt = new Array();


function fn_emailcheck(strValue)
{
	var regExp = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;
	//입력을 안했으면
	if(strValue.length == 0){
		return false;
	}
	//이메일 형식에 맞지않으면
	if (!strValue.match(regExp)){
		return false;
	}
	return true;
}

//확장자에 따른 파일 형식 확인
function fn_ExtType(FileName) {
	var AllType = new Array();
	AllType[0] = { fileType: "IMAGE", Ext: "\\.(" + imageExt.join("|") + ")$" };
	AllType[1] = { fileType: "MOVIE", Ext: "\\.(" + movieExt.join("|") + ")$" };
	AllType[2] = { fileType: "DOC", Ext: "\\.(" + docExt.join("|") + ")$" };
	if (otherExt.length > 0) {
		AllType[3] = { fileType: "OTHER", Ext: "\\.(" + otherExt.join("|") + ")$" };
	}

	for (jj = 0; jj < AllType.length; jj++) {
		if ((new RegExp(AllType[jj].Ext, "i")).test(FileName)) return AllType[jj].fileType;
	}
	return "";
}

//alert대체용 layer띄우기
var alertLayer = function(objText  ,hf ,fs){
	$("[id='layerPopText']").html(objText);
	layerPopup($("[id='layerPop']"));

	if(hf != undefined && hf != ""){
		$("[id='layerBtn']").attr("data-href",hf);
	}
	
	if(fs != undefined && fs != ""){
		$("[id='layerBtn']").attr("data-focus",fs);
	}
	$("[id='layerBtn']").focus();
}

//레이어 닫기
$(document).on("click","[data-type='layerPopupClose']",function(){
	var hf = $(this).attr("data-href");
	var fs = $(this).attr("data-focus");
	$(this).attr("data-focus","");
	if(hf != undefined && hf != ""){
		location.href = hf;
	}
	
	layerPopupClose();
	if(fs != undefined && fs != ""){
		$(fs).focus();
	}
});

//팝업 띄우기
function layerPopup(obj) {
	var top = (($(window).height() - $(obj).height()) / 2)-100;
	top = (top < 20) ? 20 : top;
	top +=  $("body").scrollTop();
	var left = (($(window).width() - $(obj).width()) / 2) + ($(obj).width() / 2) ;
	$(obj).css("top",top).css("left",left).css("z-index","9999").css("position","absolute").show();
	var body =  $("body");
	body.append('<div class="mask"></div>');
	$(".mask").show();
	return false;
}
//팝업 닫기
function layerPopupClose(obj) {
	if(obj != undefined && obj != null){
		$(obj).hide();
	}
	var mask =  $(".mask");
	var popup =  $(".popup");
	popup.animate({marginTop: 0,'opacity':0}, 200, function() {
		$(this).css({'opacity':1}).hide();
	});
	mask.remove();
	return false;
}

//로그아웃
function fn_logout(){
	if(confirm("로그아웃하시겠습니까?")){
		location.href = "/member/logout.do";
	}
}

//설정화면
function fn_manager1(){
	$.ajax({
		url : "/manager/manager1.do",
		dataType : "html",
		type : "post",
		async   : true,
		data : "",
		beforeSend : function(){
		},
		success : function(result) {
			$("body").append(result);
/*			$("div[id='wrap']").hide();
			$("div[id='menu-wrap']").hide();
			$("div[class='mask']").hide();*/
			
		},
		error : function() {							
			alertLayer("오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
		},
		complete : function(data) {
		}			
	});
}

//앱 종료
function fn_close(){
	if(confirm("재능나눔 앱을 종료하시겠습니까?")){
		window.BridgeFromMainActivity.appClose();
	}
}

function fn_write(){
	location.href="/board/write.do";
}


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
