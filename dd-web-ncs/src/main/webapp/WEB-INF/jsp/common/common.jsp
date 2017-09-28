<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="cd" uri="/WEB-INF/tld/codeTld.tld" %>
<%@ taglib prefix="coll" uri="/WEB-INF/tld/collTld.tld" %>
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<meta name="format-detection" content="telephone=no" />
	<title>재능나눔</title>
	<link rel="stylesheet" type="text/css" href="/common/css/common.css" />
	<script src="/common/js/jquery-1.11.2.min.js"></script>
</head>
<body>
<div class="loginWrap">
	<header>
		<h1><strong>재능기부앱</strong><em>재능나눔</em></h1>
	</header>
	
	<section class="contentsWrap">
		<fieldset>
			<legend>로그인하기</legend>
			<div class="loginbox">
				<div>
					<input type="text" id="" placeholder="아이디" />
				</div>
				<div>
					<input type="password" id="" placeholder="비밀번호" />
				</div>
			</div>
			
			<div class="save">
				<div class="util-btn">
					<button type="button" class="btn-join">회원가입</button>
					<button type="button" class="btn-find">ID/PW 찾기</button>
				</div>
				<label for="autoLogin"><input type="checkbox" id="autoLogin" name="" /> <span>자동로그인</span></label>
			</div>
			
			<button type="button" class="btn_login" onclick="alert('ㅇㅇ');">로그인</button>
		</fieldset>
	</section>

	<footer>
		<span class="footer_logo">jsobar</span>
	</footer>

</div>
</body>
</html>