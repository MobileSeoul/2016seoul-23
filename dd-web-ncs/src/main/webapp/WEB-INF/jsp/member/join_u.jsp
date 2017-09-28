<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="cd" uri="/WEB-INF/tld/codeTld.tld" %>
<%@ taglib prefix="coll" uri="/WEB-INF/tld/collTld.tld" %>
<%@ taglib prefix="dt" uri="/WEB-INF/tld/dateTld.tld" %>
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
	<input type="hidden" id="mm_type" name="mm_type" value="U" />
	<input type="hidden" name="logincheck" value="${LoginCheck }" />
	<input type="hidden" name="changeUrl" value="${LoginCheck eq 'Y' ? '/main/main.do' : '/member/login.do' }" />	
	<section id="container">
		<h2 class="sub-tit">재능 <strong>기부자</strong></h2>
		<div class="content">
			<div class="form-area">
				<ul>
					<li>
						<span class="label">이름</span>
<c:choose>
	<c:when test="${LoginCheck eq 'Y' }">
						<span class="txt">${USER.MM_NAME}</span>
	</c:when>
	<c:otherwise>
						<input type="text" id="mm_name" name="mm_name" placeholder="이름" maxlength="50">	
	</c:otherwise>
</c:choose>

					</li>
					<li class="mail">
						<span class="label">아이디</span>
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
						<input type="tel" id="mm_hp1" name="mm_hp1" value="${USER.MM_HP1}" maxlength="3" placeholder="010">
						<input type="tel" id="mm_hp2" name="mm_hp2" value="${USER.MM_HP2}" maxlength="4" placeholder="">
						<input type="tel" id="mm_hp3" name="mm_hp3" value="${USER.MM_HP3}" maxlength="4" placeholder="">
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
					<li class="two-select">
						<span class="label">선호기부지역</span>
						<select id="mm_area1" name="mm_area1">
							<option value="서울시">서울시</option>
						</select>
						<select id="mm_area2" name="mm_area2">
							<option value=""></option>
<c:forEach var="item" items="${cd:getCodeList(params.CODE, '서울시')}" varStatus="status">
							<option value="${item.CD }" ${USER.MM_AREA2 eq item.CD ? 'selected' : ''}>${item.NM }</option>
</c:forEach>
						</select>
					</li>
					<li class="gender">
						<span class="label">성별</span>
<c:choose>
	<c:when test="${LoginCheck eq 'Y' }">
		<c:choose>
			<c:when test="${USER.MM_SEX eq 'F' }">
						<label class="female" for="sexFemale"><input type="radio" name="mm_sex" id="sexFemale" value="F" checked> 여자</label>			
			</c:when>
			<c:otherwise>
						<label class="male" for="sexMale"><input type="radio" name="mm_sex" id="sexMale" value="M" checked> 남자</label>			
			</c:otherwise>
		</c:choose>
	</c:when>
	<c:otherwise>
						<label class="female" for="sexFemale"><input type="radio" name="mm_sex" id="sexFemale" value="F"> 여자</label>
						<label class="male" for="sexMale"><input type="radio" name="mm_sex" id="sexMale" value="M"> 남자</label>	
	</c:otherwise>
</c:choose>						
						

					</li>
					<li class="yymmdd">
						<span class="label">생일</span>
<c:choose>
	<c:when test="${LoginCheck eq 'Y' }">
						<span class="txt">${USER.MM_BIRTH_Y}. ${USER.MM_BIRTH_M lt 10 ? '0' : ''}${USER.MM_BIRTH_M}. ${USER.MM_BIRTH_D lt 10 ? '0' : ''}${USER.MM_BIRTH_D}</span>
	</c:when>
	<c:otherwise>
<c:set var="MAXYEAR" value="${dt:toDateP('yyyy')}" />
						<select id="mm_birth_y" name="mm_birth_y" title="년">
							<option value=""></option>
		<c:forEach var="ii" begin="1900" end="${MAXYEAR - 10 }" step="1">
							<option value="${ii}" ${USER.MM_BIRTH_Y eq ii ? 'selected' : '' }>${ii}</option>
		</c:forEach>
						</select>
						<select id="mm_birth_m" name="mm_birth_m" title="월">
							<option value=""></option>
		<c:forEach var="ii" begin="1" end="12" step="1">						
							<option value="${ii}" ${USER.MM_BIRTH_M eq ii ? 'selected' : '' }>${ii lt 10 ? '0' : ''}${ii}</option>
		</c:forEach>
						</select>
						<select id="mm_birth_d" name="mm_birth_d" title="일">
							<option value=""></option>
		<c:forEach var="ii" begin="1" end="31" step="1">						
							<option value="${ii}" ${USER.MM_BIRTH_D eq ii ? 'selected' : '' }>${ii lt 10 ? '0' : ''}${ii}</option>
		</c:forEach>
						</select>	
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
					<li class="category">
						<span class="label">재능 카테고리</span>
						<ul>

<c:forEach var="item" items="${cd:getCodeList(params.CODE, 'MC_CATE_CODE')}" varStatus="status">
	<c:if test="${item.ETC1 ne null and item.ETC1 ne ''}">
		<c:set var="CATECHECK" value="N" />
		<c:forEach var="cate" items="${categoryList}">
			<c:if test="${CATECHECK eq 'N' and cate.MC_CATE_CODE eq item.CD}">
				<c:set var="CATECHECK" value="Y" />
			</c:if>
		</c:forEach>
							<li><input type="checkbox" id="category0${status.count }" name="mc_cate_code__${status.count }" value="${item.CD }" ${CATECHECK eq 'Y' ? 'checked' : '' }><label for="category0${status.count }"><i class="fa ${item.ETC1 }"></i> <em>${item.NM }</em></label></li>
	</c:if>							
</c:forEach>
						</ul>
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
			if($("input[name='mm_name']").val().length < 2){
				alertLayer("이름을 입력해주세요.","","[name='mm_name']");
				return;
			}else if($("input[name='mm_id']").val().length < 5){
				alertLayer("아이디를 최소 5자리 이상 입력해주세요","","[name='mm_id']");
				return;
			}else if(!IdCheck){
				alertLayer("아이디 중복여부를 확인해주세요.","","[name='mm_id']");
				return;
			}
			if($("input[name='mm_pw']").val().length < 6){
				alertLayer("비밀번호를 6자리 이상 입력해주세요.","","[name='mm_pw']");
				return;
			}
		}
		
		if($("input[name='mm_pw']").val().length > 0){
			if($("input[name='mm_pw1']").val() == ""){
				alertLayer("비밀번호 확인을 입력해주세요.","","[name='mm_pw1']");
				return;
			}
			if($("input[name='mm_pw']").val() != $("input[name='mm_pw1']").val()){
				alertLayer("비밀번호와 비밀번호 확인이 일치하지 않습니다.","","[name='mm_pw']");
				return;
			}
		}

		
		if($("input[name='mm_hp1']").val().length < 2){
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
			}	
		}
		
		if($("select[name='mm_area1']").val().length == 0){
			alertLayer("선호기부지역을 선택해주세요.","","[name='mm_area1']");
			return;
		}else if($("select[name='mm_area2']").val().length == 0){
			alertLayer("선호기부지역을 선택해주세요.","","[name='mm_area2']");
			return;
		}else if(!$("input[name='mm_sex']").is(":checked")){
			alertLayer("성별을 선택해주세요.","","[name='mm_sex']");
			return;	
		}
		
		if(logincheck != "Y"){
			if($("select[name='mm_birth_y']").val().length == 0){
				alertLayer("생일(년)을 입력해주세요.","","[name='mm_birth_y']");
				return;
			}else if($("select[name='mm_birth_m']").val().length == 0){
				alertLayer("생일(월)을 입력해주세요.","","[name='mm_birth_m']");
				return;
			}else if($("select[name='mm_birth_d']").val().length == 0){
				alertLayer("생일(일)을 입력해주세요.","","[name='mm_birth_d']");
				return;	
			}		
		}
		
		if($("input[name^='mc_cate_code__']:checked").length == 0){
			alertLayer("재능 카테고리를 1개 이상 선택해주세요.","","");
			return;	
		}
		
		var con = confirm(saveText + " 하시겠습니까?");
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
	<script>
		$(document).on('click','.category li',function(){
			var thisLabel = $(this).find("label");
			//thisLabel.addClass("checked");
			//$(".category li :radio[name=checkCategory]").removeAttr("checked"); // 기존에 체크된 라디오버튼을 초기화
			//$(this).find("input").prop("checked", true); // 현재 선택된 값으로 라디오 버튼이 체크되도록 함.
		});


	</script>
</html>