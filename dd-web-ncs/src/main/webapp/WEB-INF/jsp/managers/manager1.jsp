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
<body >
<div id="wrap"class="setting">
	<header>
		<button type="button" class="btn-l btn-back"><em>뒤로</em></button>
		<h1 class="tit"><em>설정</em></h1>	
	</header>

	<section id="container">
		<div class="content">
			<div class="setting-list">
				<ul>
					<!-- <li>
						<dl>
							<dt><label for="smsAgree">SMS 수신동의</label></dt>
							<dd>
								<label class="switch" for="smsAgree">
									<input type="checkbox" class="switch-input" id="smsAgree" checked>
									<span class="switch-ani"><span class="switch-label"></span><span class="switch-handle"></span></span>
								</label>
							</dd>
						</dl>
					</li>
					<li>
						<dl>
							<dt><label for="psuhAgree">PSUH 수신동의</label></dt>
							<dd>
								<label class="switch" for="psuhAgree">
									<input type="checkbox" class="switch-input" id="psuhAgree">
									<span class="switch-ani"><span class="switch-label"></span><span class="switch-handle"></span></span>
								</label>
							</dd>
						</dl>
					</li> -->
					<li>
						<dl>
							<dt>버전정보 <em>Ver. 1.3</em></dt>
							<dd>
								<button type="button" class="btn-blueLine"><em>최신버전</em></button>
								<!-- <button type="button" class="btn-blueLine"><em>업그레이드</em></button> -->
							</dd>
						</dl>
					</li>
				</ul>
			</div>
		</div>
	</section>
</div>
<%@include file="/WEB-INF/jsp/common/footer.jsp" %>
</body>
</html>