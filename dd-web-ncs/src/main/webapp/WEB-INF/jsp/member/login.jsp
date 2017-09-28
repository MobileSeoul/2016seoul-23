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
<div class="loginWrap">
	<header>
		<h1><strong>재능기부앱</strong><em>서울시 재능나눔</em></h1>
	</header>
			<form name="frm" method="post">	
	<section class="contentsWrap">
		<fieldset>
			<legend>로그인하기</legend>

			<div class="loginbox">
				<div>
					<input type="text" id="mm_id" name="mm_id" placeholder="아이디" />
				</div>
				<div>
					<input type="password" id="mm_pw" name="mm_pw" placeholder="비밀번호" />
				</div>
			</div>

			
			<div class="save">
				<div class="util-btn">
					<button type="button" class="btn-join" data-type="join">회원가입</button>
					<button type="button" class="btn-find" data-type="findPw">ID/PW 찾기</button>
				</div>
				<label for="autoLogin"><input type="checkbox" id="autoLogin" name="autologin" name="" value="Y" /> <span>자동로그인</span></label>
			</div>
			
			<button type="button" class="btn_login" data-type="login">로그인</button>
		</fieldset>
	</section>
			</form>
	<footer>
		<span class="footer_logo">jsobar</span>
	</footer>

</div>

	<%@include file="/WEB-INF/jsp/common/footer.jsp" %>
	
</body>
<script type="text/javascript">
	//로그인
	var LoginAjax = true;	
	$(document).on("click","[data-type='login']",function(){
		if(!LoginAjax){
			alertLayer("잠시만 기다려주세요.");
			return;
		}
		
		if($("input[name='mm_id']").val().length == 0){
			alertLayer("아이디를 입력해주세요","","[name='mm_id']");
			return;
		}else if($("input[name='mm_pw']").val().length == 0){
			alertLayer("패스워드를 입력해주세요","","[name='mm_pw']");
			return;
		}
		
		$.ajax({
			url : "/member/loginProc.do",
			dataType : "json",
			type : "post",
			async   : false,
			data : $("form[name='frm']").serialize(),
			beforeSend : function(){
				LoginAjax = false;
			},
			success : function(result) {
				if(result.data){
					location.href = "/main/main.do";
				}else{
					alertLayer(result.msg);
				}
			},
			error : function() {							
				alertLayer("로그인 중 오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
			},
			complete : function(data) {
				LoginAjax = true;
			}			
		});
	});
	//회원가입
	$(document).on("click","[data-type='join']",function(){
		location.href="/member/join.do";	
	});
	//패스워드 찾기
	$(document).on("click","[data-type='findPw']",function(){
		location.href="/member/find.do";	
	});
		
</script>
</html>