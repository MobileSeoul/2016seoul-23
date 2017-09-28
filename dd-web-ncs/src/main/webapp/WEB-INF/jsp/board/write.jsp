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

<div id="wrap" class="write">
	<header>
		<button type="button" class="btn-l btn-back"><em>뒤로</em></button>
		<h1 class="tit"><em>글쓰기</em></h1>
	</header>

<form name="frm" method="post">
	<section id="container">
		<div class="form-area">
			<ul class="form-list">
				<li><label for="ub_title">제목<sup></sup></label><span><input type="text" id="ub_title" name="ub_title" class="full"></span></li>
				<li><label for="location">위치</label>
					<span class="two-select">
						<select title="시 선택" id="ub_area1" name="ub_area1">
							<option>서울시</option>
						</select>
<c:set var="AREA2" value="${USER.MM_AREA2}" />						
						<select title="구 선택" id="ub_area2" name="ub_area2">
							<option value=""></option>
<c:forEach var="item" items="${cd:getCodeList(params.CODE, '서울시')}" varStatus="status">
							<option value="${item.CD }" ${item.CD eq AREA2 ? 'selected' :'' }>${item.NM }</option>
</c:forEach>							
						</select>
					</span>
				</li>
				<li><label for="ub_category">카테고리<sup></sup></label>
					<span>
						<select id="ub_category" name="ub_category" class="full">
							<option value=""></option>
<c:forEach var="item" items="${cd:getCodeList(params.CODE, 'MC_CATE_CODE')}" varStatus="status">
	<c:set var="SELECTED" value="N" />
	<c:set var="STYLE" value="" />
	<c:forEach var="cate" items="${categoryList}" varStatus="status1">
		<c:if test="${item.CD eq cate.MC_CATE_CODE}">
			<c:set var="STYLE" value="style='color:red;'" />
		</c:if>
		<c:if test="${item.CD eq USER.MC_CATE_CODE}">
			<c:set var="SELECTED" value="Y" />
		</c:if>
	</c:forEach> 
							<option value="${item.CD }" ${STYLE } ${SELECTED eq 'Y' ? 'selected' : '' }>${item.NM }</option>
</c:forEach>
						</select>
					</span>
				</li>
				<li><label for="ub_cmt">내용</label><span><textarea rows="8" id="ub_cmt" name="ub_cmt" class="full"></textarea></span></li>
			</ul>
		</div>

		<div class="btn-area bottom">
			<button type="button" class="btn-blue" data-type="save"><em>참가신청하기</em></button>
		</div>
	</section>
	
</form>	
</div>

<%@include file="/WEB-INF/jsp/common/footer.jsp" %>

</body>

<script type="text/javascript">
	//저장
	var SaveAjax = true;
	$(document).on("click","[data-type='save']",function(){
		if(!SaveAjax){
			alertLayer("잠시만 기다려 주세요.");
			return;
		}
		if($("input[name='ub_title']").val().length < 5){
			alertLayer("제목을 5자이상 입력해주세요.","","[name='ub_title']");
			return;
		}else if($("select[name='ub_area1']").val() == ""){
			alertLayer("기부지역을 선택해주세요.","","[name='ub_area1']");
			return;
		}else if($("select[name='ub_area2']").val() == ""){
			alertLayer("기부지역을 선택해주세요.","","[name='ub_area2']");
			return;
		}else if($("select[name='ub_category']").val() == ""){
			alertLayer("카테고리를 선택해주세요.","","[name='ub_category']");
			return;
		}else if($("textarea[name='ub_cmt']").val().length < 10){
			alertLayer("내용을 입력해주세요.","","[name='ub_cmt']");
			return;
		}
		
		var con = confirm("등록 하시겠습니까?");
		if(!con){
			return;
		}
		
		$.ajax({
			url : "/board/writeProc.do",
			dataType : "json",
			type : "post",
			async   : false,
			data : $("form[name='frm']").serialize(),
			beforeSend : function(){
				SaveAjax = false;
			},
			success : function(result) {
				if(result.data){
					alertLayer("등록되었습니다.","/main/main.do","");
				}else{
					alertLayer(result.msg);

				}
			},
			error : function() {							
				alertLayer("등록 중 오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
			},
			complete : function(data) {
				SaveAjax = true;
			}			
		});
		
	});
</script>
</html>
  