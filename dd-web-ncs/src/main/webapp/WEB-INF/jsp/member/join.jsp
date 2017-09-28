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
		<h1 class="tit"><em>회원가입</em></h1>
	</header>

	<section id="container">
		<div class="content alignC mgT40">
			<button type="button" class="btn-blueLine2 w80p mgB20" data-type="join_u"><em>재능 기부자 회원가입</em></button>
			<button type="button" class="btn-blueLine2 w80p" data-type="join_c"><em>재능 수혜자 회원가입</em></button>
		</div>
	</section>
</div>

<div class="popup confirm">
	<div class="popup-cont">
		<p>입력하신 이메일은 사용 가능합니다.</p>
	</div>
	<div class="popup-foot">
		<div class="btn-area bottom">
			<button type="button" class="btn-blue" onclick="layerPopupClose()"><em>확인</em></button>
		</div>
	</div>

</div>

</body>

	<script>
	$(document).on("click","[data-type='join_u'],[data-type='join_c']",function(){
		var type = $(this).attr("data-type");
		location.href = "/member/" + type + ".do";
	});
	
	</script>
</html>