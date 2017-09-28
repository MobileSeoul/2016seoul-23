<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="cd" uri="/WEB-INF/tld/codeTld.tld" %>
<%@ taglib prefix="coll" uri="/WEB-INF/tld/collTld.tld" %>
<!DOCTYPE html>
<html lang="ko">
<head>
<title>재능나눔</title>
<%@include file="/WEB-INF/jsp/common/head.jsp" %>
</head>
<body>
<div id="wrap" class="join">
	<header>
		<button type="button" class="btn-l btn-back"><em>뒤로</em></button>
		<h1 class="tit"><em>${LoginCheck eq 'Y' ?'정보 수정' : '회원가입'}</em></h1>
	</header>
<form id="frm" name="frm" method="post" enctype="multipart/form-data">
	<input type="hidden" id="mm_type" name="mm_type" value="C" />
	<input type="hidden" name="logincheck" value="${LoginCheck }" />
	<input type="hidden" name="changeUrl" value="${LoginCheck eq 'Y' ? '/main/main.do' : '/member/login.do' }" />
	<section id="container">
		<h2 class="sub-tit">재능 <strong>수혜자</strong></h2>
		<div class="content">
			<div class="form-area">
				<ul>
					<li class="mail"><span class="label">아이디</span>
<c:choose>
	<c:when test="${LoginCheck eq 'Y' }">
						<span class="txt">${USER.MM_ID}</span>
	</c:when>
	<c:otherwise>
						<input type="text" id="mm_id" name="mm_id" placeholder="아이디" maxlength="20"><button type="button" class="btn-blue" data-type="idCheck"><em>중복검사</em></button>	
	</c:otherwise>
</c:choose>

					</li>
					<li><span class="label">비밀번호</span><input type="password" id="mm_pw" name="mm_pw" class="w100p" placeholder="비밀번호" maxlength="20"></li>
					<li><span class="label">비밀번호 확인</span><input type="password" id="mm_pw1" name="mm_pw1" class="w100p" placeholder="비밀번호 확인" maxlength="20"></li>
					<li class="phone-num">
						<span class="label">연락처</span>
						<input type="tel" id="mm_hp1" name="mm_hp1" value="${USER.MM_HP1 }" maxlength="3" placeholder="010">
						<input type="tel" id="mm_hp2" name="mm_hp2" value="${USER.MM_HP2 }" maxlength="4" placeholder="">
						<input type="tel" id="mm_hp3" name="mm_hp3" value="${USER.MM_HP3 }" maxlength="4" placeholder="">
					</li>
					<li class="mail">
						<span class="label">이메일</span>
<c:choose>
	<c:when test="${LoginCheck eq 'Y' }">
						<span class="txt">${USER.MM_EMAIL}</span>
						
	</c:when>
	<c:otherwise>
						<input type="email" id="mm_email" name="mm_email" value="" placeholder="이메일" maxlength="200"><button type="button" class="btn-blue" data-type="emailCheck"><em>중복검사</em></button>	
	</c:otherwise>
</c:choose>
					</li>
					<li class="profile-pic">
						<span class="label">프로필 사진</span>
<c:choose>
	<c:when test="${LoginCheck eq 'Y' and USER.MM_PIC_URL ne null and USER.MM_PIC_URL ne '' }">
						<span class="pic-area" id="cma_image" style="background-image:url('${USER.MM_PIC_URL}');background-size: cover;">
							<!-- 프로필사진 영역 -->
						</span>	
	</c:when>
	<c:otherwise>
						<span class="pic-area" id="cma_image">
							<!-- 프로필사진 영역 -->
						</span>	
	</c:otherwise>
</c:choose>

						

						<span class="btns">							
							<div class="fileUpload btn-blue btn-album">
								<span>사진앨범</span>
								<input id="uploadBtn" name="profile" type="file" class="upload" />
							</div>
							<input type="hidden" id="mm_pic_url" name="mm_pic_url" value="" />
						</span>
					</li>
					<li class="bin">&nbsp;</li>
					<li><span class="label">단체명</span>
<c:choose>
	<c:when test="${LoginCheck eq 'Y' }">
						<span class="txt">${USER.MM_NAME}</span>
						
	</c:when>
	<c:otherwise>					
					<input type="text" id="mm_name" name="mm_name" class="w100p" placeholder="단체명" maxlength="50">
	</c:otherwise>
</c:choose>				
					</li>
					<li><span class="label">사업자번호</span>
<c:choose>
	<c:when test="${LoginCheck eq 'Y' }">
						<span class="txt">${USER.MM_COM_NO}</span>
	</c:when>
	<c:otherwise>					
					<input type="tel" id="mm_com_no" name="mm_com_no" class="w100p" placeholder="사업자번호" maxlength="15"></li>
	</c:otherwise>
</c:choose>						

					<li class="address"><span class="label">주소</span>
						<div class="zip-code mail mgB5"><input type="tel" id="mm_zip" name="mm_zip" placeholder="우편번호" maxlength="6" value="${USER.MM_ZIP}"><!-- <button type="button" class="btn-blue"><em>우편번호</em></button> --></div>
						<div class="addr-dtl">
							<input type="text" id="mm_addr1" name="mm_addr1" class="w100p mgB5" placeholder="주소" maxlength="200" value="${USER.MM_ADDR1}">
							<input type="text" id="mm_addr2" name="mm_addr2" class="w100p" placeholder="상세 주소" maxlength="200" value="${USER.MM_ADDR2}">
						</div>
					</li>
				</ul>	
				<div class="btn-area bottom">
					<button type="button" class="btn-blue" data-type="save"><em>${LoginCheck eq 'Y' ?'수정' : '회원가입'}</em></button>
				</div>
			</div>
		</div>
	</section>
</form>
</div>

<%@include file="/WEB-INF/jsp/common/footer.jsp" %>
</body>

<script type="text/javascript">
	var SaveAjax = true;
	
	var IdCheck = false;
	var IdVal = "";	
	//아이디 변경
	$(document).on("focusout","input[name='mm_id']",function(){
		if(IdVal != $(this).val()){
			IdCheck = false;
			IdVal = "";
		}
	});
	//아이디 중복검사
	$(document).on("click","[data-type='idCheck']",function(){
		if(!SaveAjax){
			alertLayer("잠시만 기다려 주세요.");
		}
		var id = $("input[name='mm_id']");
		if(id.val().replace(/ /g,"").length < 5){
			alertLayer("아이디를 최소 5자리 이상 입력해주세요","","[name='mm_id']");
			return;
		}
		
		$.ajax({
			url : "/member/idCheck.do",
			dataType : "json",
			type : "post",
			async   : false,
			data : {mm_id : $("input[name='mm_id']").val()},
			beforeSend : function(){
				SaveAjax = false;
			},
			success : function(result) {
				if(result.data){
					alertLayer("사용가능한 아이디 입니다.");
					IdCheck = true;
					IdVal = $("input[name='mm_id']").val();
				}else{
					alertLayer(result.msg);
					IdCheck = false;
					IdVal = "";
				}
			},
			error : function() {							
				alertLayer("오류가 발생했습니다.");
			},
			complete : function(data) {
				SaveAjax = true;
			}			
		});
	});
	var EmailCheck = false;
	var EmailVal = "";	
	//아이디 변경
	$(document).on("focusout","input[name='mm_email']",function(){
		if(EmailVal != $(this).val()){
			EmailCheck = false;
			EmailVal = "";
		}
	});
	//아이디 중복검사
	$(document).on("click","[data-type='emailCheck']",function(){
		if(!SaveAjax){
			alertLayer("잠시만 기다려 주세요.");
		}
		var id = $("input[name='mm_email']");
		if(id.val().replace(/ /g,"").length < 5){
			alertLayer("이메일을 입력해주세요.","","[name='mm_email']");
			return;
		}else if(!fn_emailcheck(id.val())){
			alertLayer("이메일 형식이 올바르지 않습니다.","","[name='mm_email']");
			return;
		}
		
		$.ajax({
			url : "/member/emailCheck.do",
			dataType : "json",
			type : "post",
			async   : false,
			data : {mm_email : $("input[name='mm_email']").val()},
			beforeSend : function(){
				SaveAjax = false;
			},
			success : function(result) {
				if(result.data){
					alertLayer("사용가능한 이메일 입니다.");
					EmailCheck = true;
					EmailVal = $("input[name='mm_email']").val();
				}else{
					alertLayer(result.msg);
					EmailCheck = false;
					EmailVal = "";
				}
			},
			error : function() {							
				alertLayer("오류가 발생했습니다.");
			},
			complete : function(data) {
				SaveAjax = true;
			}			
		});
	});
	//사진 업로드
	$(document).on("change","[name='profile']",function(){
		var fileType = fn_ExtType($(this).val());
		if (fileType != "IMAGE") {
			alertLayer("이미지 파일만 업로드가 가능합니다.");
			return;
		}
		
		$("form[name='frm']").ajaxSubmit({
			url: "/member/fileupload.do"
			, type: 'post'
			, dataType: 'json'
			, beforeSend: function (xhr) {
			}
			, success: function (result, textStatus) {
				if(!result.data){
					alertLayer(result.msg);
				}else{
					var file = result.file[0];
					var filePath = "/files/" + file.c_name + "/" + file.real_file_name;
					var filename = file.file_name;
					$("input[name='mm_pic_url']").val(filePath);
					$("[id='cma_image']").css({'background-image': 'url(\"' + filePath + '\")', 'background-size':'cover'});
				}
				
			}
			, error: function (xhr, ajaxOptions, thrownError) {
				alertLayer("파일 업로드 중 오류가 발생했습니다.");
			}
			, complete: function (xhr, textStatus) {
			}
		});
	});
	
	//저장
	var saveText = "${LoginCheck eq 'Y' ?'정보 수정' : '회원가입'}";
	$(document).on("click","[data-type='save']",function(e){
		if(!SaveAjax){
			alertLayer("잠시만 기다려 주세요.");
			return;
		}
		
		var logincheck = $("input[name='logincheck']").val();
		if(logincheck != "Y"){
			if($("input[name='mm_id']").val().length < 5){
				alertLayer("아이디를 최소 5자리 이상 입력해주세요","","[name='mm_id']");
				return;
			}else if(!IdCheck){
				alertLayer("아이디 중복여부를 확인해주세요.","","[name='mm_id']");
				return;
			}else if($("input[name='mm_pw']").val().length < 6){
				alertLayer("비밀번호를 6자리 이상 입력해주세요.","","[name='mm_pw']");
				return;
			}
		}
		
		if($("input[name='mm_pw']").val().length > 0){
			if($("input[name='mm_pw1']").val() == ""){
				alertLayer("비밀번호 확인을 입력해주세요.","","[name='mm_pw1']");
				return;
			}else if($("input[name='mm_pw']").val() != $("input[name='mm_pw1']").val()){
				alertLayer("비밀번호와 비밀번호 확인이 일치하지 않습니다.","","[name='mm_pw']");
				return;
			}
		}
		
		else if($("input[name='mm_hp1']").val().length < 2){
			alertLayer("연락처 국번을 입력해주세요.","","[name='mm_hp1']");
			return;
		}else if($("input[name='mm_hp2']").val().length < 3){
			alertLayer("연락처 앞자리를 입력해주세요.","","[name='mm_hp2']");
			return;
		}else if($("input[name='mm_hp3']").val().length != 4){
			alertLayer("연락처 뒷자리를 입력해주세요.","","[name='mm_hp3']");
			return;
		} 
			
		if(logincheck != "Y"){
			if($("input[name='mm_email']").val().length < 1){
				alertLayer("이메일을 입력해주세요.","","[name='mm_email']");
				return;
			}else if(!EmailCheck){
				alertLayer("이메일을 중복 확인해주세요.","","[name='mm_email']");
				return;
			}else if($("input[name='mm_name']").val().length < 3){
				alertLayer("단체명을 입력해주세요.","","[name='mm_name']");
				return;
			}else if($("input[name='mm_com_no']").val().length < 10){
				alertLayer("사업자 번호를 입력해주세요.","","[name='mm_com_no']");
				return;
			}	
		}
		
		if($("input[name='mm_zip']").val().length < 4){
			alertLayer("우편번호를 입력해주세요","","[name='mm_zip']");
			return;
		}else if($("input[name='mm_addr1']").val().length < 5){
			alertLayer("주소를 입력해주세요.","","[name='mm_addr1']");
			return;
		}else if($("input[name='mm_addr2']").val().length < 5){
			alertLayer("상세주소를 입력해주세요.","","[name='mm_addr2']");
			return;
		}
		
		var con = confirm(saveText + "하시겠습니까?");
		if(!con){
			return;
		}
		
		$.ajax({
			url : "/member/joinProc.do",
			dataType : "json",
			type : "post",
			async   : false,
			data : $("form[name='frm']").serialize(),
			beforeSend : function(){
				SaveAjax = false;
			},
			success : function(result) {
				if(result.data){
					var changeUrl = $("input[name='changeUrl']").val();
					alertLayer(saveText + "이 완료되었습니다.",changeUrl,"");
				}else{
					alertLayer(result.msg);

				}
			},
			error : function() {							
				alertLayer(saveText + " 중 오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
			},
			complete : function(data) {
				SaveAjax = true;
			}			
		});
		$.hrefStop(e);
	});
</script>
</html>  