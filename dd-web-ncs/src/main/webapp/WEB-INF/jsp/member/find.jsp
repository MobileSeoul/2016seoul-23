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

<div id="wrap" class="find bgWhite">
	<header>
		<button type="button" class="btn-l btn-back"><em>뒤로</em></button>
		<h1 class="tit"><em>아이디/비밀번호 찾기</em></h1>
	</header>

	<section id="container">
		<nav class="tab-menu">
			<ul>
				<li class="current"><button type="button" ><em>아이디 찾기</em></button></li>
				<li><button type="button"><em>비밀번호 찾기</em></button></li>
			</ul>
		</nav>
		<div class="swiper-container">
		<div class="swiper-wrapper">
			<!-- 아이디 찾기 -->
			<div class="swiper-slide panel">

				<div class="form-area find-id pd20 alignC">
<form name="frm_id"	method="post">
					<div class="input-area mgB20">
						<span class="ip-group">
							<label for="idName">이름</label>
							<input type="text" id="idName" name="mm_name" value="" />
						</span>
						<span class="ip-group">
							<label for="idMail">메일</label>
							<input type="email" id="idMail" name="mm_email" value="" />
						</span>
					</div>

					<div class="btn-area">
						<button type="button" class="btn-blue btn-send w200" data-type="findId"><em>아이디 찾기</em></button>
					</div>					
</form>

				</div>
			</div>
			<!-- //아이디 찾기 -->
			<!-- 비번 찾기 -->
			<div class="swiper-slide panel">

				<div class="form-area find-pw pd20 alignC">
<form name="frm_pw"	method="post">
					<div class="input-area mgB20">
						<span class="ip-group">
							<label for="mm_id">아이디</label>
							<input type="text" id="mm_id" name="mm_id">
						</span>
						<span class="ip-group">
							<label for="pwName">이름</label>
							<input type="text" id="pwName" name="mm_name">
						</span>
						<span class="ip-group">
							<label for="pwMail">메일</label>
							<input type="email" id="pwMail" name="mm_email">
						</span>
					</div>

					<div class="btn-area">
						<button type="button" class="btn-blue btn-send w200" data-type="findPw"><em>비밀번호 찾기</em></button>
					</div>
</form>

				</div>
			</div>
			<!-- //비번 찾기 -->
		</div>
		</div>

		
	</section>
</div>

<div id="find_id_layer" style="background-color:#ffffff;padding:20px;display:none;">
	<div class="after step3">
		<div class="box mgB20 ">
			<em id="find_id_name"></em>님의 아이디는<br>
			<strong class="txt_blue" id="find_id_id"></strong>입니다.
		</div>
		<div class="btn-area">
			<button type="button" class="btn-orange w200" onclick="layerPopupClose($('div[id=find_id_layer]'));"><em>확인</em></button>
		</div>
	</div>
</div>

<%@include file="/WEB-INF/jsp/common/footer.jsp" %>
</body>

<script type="text/javascript">


var FindAjax = true;
$(document).on("click","[data-type='findId']",function(e){
	if(!FindAjax){
		alertLayer("잠시만 기다려 주세요");
		return;
	}
	var mm_name = $("form[name='frm_id'] input[name='mm_name']");
	var mm_email = $("form[name='frm_id'] input[name='mm_email']");
	if(mm_name.val().length == 0){
		alertLayer("이름을 입력해주세요","","form[name='frm_id'] input[name='mm_name']");
		return;	
	}else if(mm_email.val().length < 1){
		alertLayer("이메일을 입력해주세요","","form[name='frm_id'] input[name='mm_email']");
		return;	
	}
	
	$.ajax({
		url : "/member/findIdProc.do",
		dataType : "json",
		type : "post",
		async   : false,
		data : $("form[name='frm_id']").serialize(),
		beforeSend : function(){
			FindAjax = false;
		},
		success : function(result) {
			if(!result.data){
				alertLayer(result.msg,"","");
			}else{
				var data = result.data;
				var user = result.user;
				$("#find_id_name").text(user.MM_NAME);
				$("#find_id_id").text(user.USER_ID);
				layerPopup($("div[id='find_id_layer']"));				
			}
		},
		error : function() {							
			alertLayer("오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
		},
		complete : function(data) {
			FindAjax = true;
		}			
	});	
});


$(document).on("click","[data-type='findPw']",function(e){
	if(!FindAjax){
		alertLayer("잠시만 기다려 주세요");
		return;
	}	
	var mm_id = $("form[name='frm_pw'] input[name='mm_id']");
	var mm_name = $("form[name='frm_pw'] input[name='mm_name']");
	var mm_email = $("form[name='frm_pw'] input[name='mm_email']");
	
	if(mm_id.val().length == 0){
		alertLayer("아이디를 입력해주세요","","form[name='frm_pw'] input[name='mm_id']");
		return;	
	}else if(mm_name.val().length == 0){
		alertLayer("이름을 입력해주세요","","form[name='frm_pw'] input[name='mm_name']");
		return;	
	}else if(mm_email.val().length < 1){
		alertLayer("이메일을 입력해주세요","","form[name='frm_pw'] input[name='mm_email']");
		return;	
	}
	
	$.ajax({
		url : "/member/findPwProc.do",
		dataType : "json",
		type : "post",
		async   : false,
		data : $("form[name='frm_pw']").serialize(),
		beforeSend : function(){
			FindAjax = false;
		},
		success : function(result) {
			if(result.data){
				alertLayer("입력하신 메일로 패스워드가 재발행 되었습니다.");
			}else{
				alertLayer(result.msg);
			}
		},
		error : function() {							
			alertLayer("오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
		},
		complete : function(data) {
			FindAjax = true;
		}			
	});	
});



		$(function(){
			/* category swiper */
			$(document).on("click",".tab-menu li button",function(e){
				e.preventDefault();
				var id = $(this).parent().index();
				swiper.slideTo(id);
				$(".tab-menu li").removeClass("current").eq(id).addClass("current");
				
				return false;
			});
			/* panel swiper */
			 var swiper = new Swiper('.swiper-container', {
				effect: 'slide',
				calculateHeight:true,
				onSlideChangeStart: function (s) {
					s.container.css({height: ''});
				},
				onSlideChangeEnd: function (s) {
					$(".tab-menu li").removeClass("current").eq(s.activeIndex).addClass("current");
					$("html, body").animate({scrollTop:"0"}, 100);
				}
			});
		});

		function swiperTab(slide){
			var id = slide;
			swiper.slideTo(id);
			$(".sub-tab li").removeClass("current").eq(id).addClass("current");
			
			//$("#container").removeClass().addClass("content tab"+slide);
			return false;
		}
	</script>
</html>