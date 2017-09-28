/************************************************************
	 SmartEditor script
	 Data : 2015.11.27
	 Developer : Heo Woo Sik
************************************************************/

//에디터오브젝트
var oEditors = [];
//기본 옵션값
var defaultSe = {
	textareaId : ""
	, skinhtml : "/plugin/se/SmartEditor2Skin.html"
	, fCreator : "createSEditor2"
	, defaultContents : ""
	, seCnt : 1
};

//에디터셋팅
var setSe = function(options){
	
	options = options || {};
	for (var prop in defaultSe)  {
		options[prop] = typeof options[prop] !== 'undefined' ? options[prop] : defaultSe[prop];
	}
	
	if(options.seCnt > 1){
		
		for(var seCntIdx=1; seCntIdx<=options.seCnt; seCntIdx++){
			
			if(options.textareaId == null || options.textareaId == "" || $("#"+options.textareaId + seCntIdx).val() == undefined ){
				alert("SmartEditor를 붙일 textarea의 id는 필수값입니다.");
				return;
			}
			
			nhn.husky.EZCreator.createInIFrame({
				oAppRef: oEditors,
				elPlaceHolder: options.textareaId + seCntIdx,
				sSkinURI: options.skinhtml, 
				htParams : {
					bUseToolbar : true,    // 툴바 사용 여부 (true:사용/ false:사용하지 않음)
					bUseVerticalResizer : true,  // 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
					bUseModeChanger : true,   // 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
					//aAdditionalFontList : aAdditionalFontSet,  // 추가 글꼴 목록
					fOnBeforeUnload : function(){
					}
				}, //boolean
				fOnAppLoad : function(){
					oEditors.getById[options.textareaId + seCntIdx].exec("PASTE_HTML", [options.defaultContents]);
				},
				fCreator: options.fCreator
			});
		}
	}else{
		
		if(options.textareaId == null || options.textareaId == "" || $("#"+options.textareaId).val() == undefined ){
			alert("SmartEditor를 붙일 textarea의 id는 필수값입니다.");
			return;
		}
		
		nhn.husky.EZCreator.createInIFrame({
			oAppRef: oEditors,
			elPlaceHolder: options.textareaId,
			sSkinURI: options.skinhtml, 
			htParams : {
				bUseToolbar : true,    // 툴바 사용 여부 (true:사용/ false:사용하지 않음)
				bUseVerticalResizer : true,  // 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
				bUseModeChanger : true,   // 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
				//aAdditionalFontList : aAdditionalFontSet,  // 추가 글꼴 목록
				fOnBeforeUnload : function(){
				}
			}, //boolean
			fOnAppLoad : function(){
				oEditors.getById[options.textareaId].exec("PASTE_HTML", [options.defaultContents]);
			},
			fCreator: options.fCreator
		});
	}
	
}

//내용가져오기
var getSeContents  = function(textareaId){
//	oEditors.getById["ir1"].exec("UPDATE_CONTENTS_FIELD", []);
	var seContents = $("#"+textareaId).val();
	try{
		seContents = oEditors.getById[textareaId].getIR();
	}catch (e) {
	}
	
	return seContents.replace(/<(\/?)(input|textarea|select|script)/ig, '&lt;$1$2').replace(/(<img\s+src\s?=["']?.+)\n(["']?)/ig, "$1$2");;
}