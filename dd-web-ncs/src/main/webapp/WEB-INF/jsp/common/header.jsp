<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:set var="USER_IMAGE" value="/common/images/default_img.png" />
<c:if test="${USER.MM_PIC_URL ne null and USER.MM_PIC_URL ne ''}">
	<c:set var="USER_IMAGE" value="${USER.MM_PIC_URL }" />
</c:if>
<div id="menu-wrap" class="menu-wrap">
	<header>
	
	
		
		<div class="profile-area theme1">
			<dl>
				<dt><span class="thumb" style="background-image:url('${USER_IMAGE}')"></span></dt>
				<dd class="user-info">
					<div class="align-box">
						<span>
							<span class="name"><strong>${USER.MM_NAME }</strong> 
							<i class="division">${USER.MC_CATE_NM}</i></span> 
							<span class="info"><em class="region">${USER.MM_AREA2 }</em></span>
						</span>
					</div>
				</dd>
			</dl>
		</div>
	</header>

	<div class="cont">
		<div class="quick-btn">
			<ul>
				<li class="menu-modify"><button type="button" onClick="location.href='/user/modify.do';"><i class="fa fa-user" aria-hidden="true"></i><em>회원정보수정</em></button></li>
				<li class="menu-logout"><button type="button" onClick="fn_logout();"><i class="fa fa-power-off" aria-hidden="true"></i><em>로그아웃</em></button></li>
			</ul>
		</div>
		<nav>
			<ul>
<c:if test="${USER.MM_TYPE eq 'U'}">
				<li class="menu-setting">
	<c:choose>
		<c:when test="${params.search_my eq 'Y' }">
					<button type="button" onclick="location.href='/main/main.do';"><em>전체목록</em></button>						
		</c:when>
		<c:otherwise>
					<button type="button" onclick="location.href='/main/main.do?search_my=Y&search_cate=mycate&search_area1=${USER.MM_AREA1}&search_area2=${USER.MM_AREA2}';"><em>관심목록</em></button>						
		</c:otherwise>
	</c:choose>
				</li>
</c:if>
				<li class="menu-setting"><button type="button" onclick="fn_write();return false;"><em>재능기부 ${USER.MM_TYPE eq 'U' ? '하기' : '요청'}</em></button></li>
				<!-- <li class="menu-setting"><button type="button"><em>후기관리</em></button></li> -->
				<li class="menu-setting"><button type="button" onclick="location.href='/managers/manager1.do';"><em>앱정보</em></button></li>
			</ul>
		</nav>
	</div>

	<button type="button" data-mask-close="Y" class="btn-close"><i class="fa fa-times" aria-hidden="true"></i></button>
</div>