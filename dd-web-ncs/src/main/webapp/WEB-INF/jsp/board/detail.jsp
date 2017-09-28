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

<div id="wrap" class="detail">
	<header>
		<button type="button" class="btn-l btn-back"><em>뒤로</em></button>
		<h1 class="tit"><em>글 상세</em></h1>
	</header>

	<section id="container" class="content">
		<div class="view-header">
			<div class="profile-area">
				<dl>
<c:set var="USER_IMAGE" value="/common/images/default_img.png" />
<c:if test="${detailBoard.MM_PIC_URL ne null and detailBoard.MM_PIC_URL ne ''}">
	<c:set var="USER_IMAGE" value="${detailBoard.MM_PIC_URL }" />
</c:if>				
					<dt><span class="thumb" style="background-image:url('${USER_IMAGE}')"></span></dt>
					<dd class="user-info">
						<div class="align-box">
							<span class="user">
								<span class="name"><strong>${detailBoard.MM_NAME }</strong></span>
								<i class="division">${detailBoard.UB_CATEGORY_NM}</i>
								<i class="date-time">${detailBoard.CRE_DT}</i>
							</span>
							<span class="info"><em class="region">${detailBoard.UB_AREA2}(${detailBoard.UB_AREA1})</em></span>
						</div>
					</dd>
				</dl>
			</div>
		</div>

		<div class="view-body">
		
<c:if test="${detailBoard.MODIFY_YN eq 'Y'}">		

			<div class="option-area">
				<button type="button" class="btn-option"><em>option menu</em></button>
				<div class="btns">
					<button type="button" class="btn-modify" data-type="modify" data-seq="${detailBoard.UB_SEQ}"><em>수정</em></button><button type="button" class="btn-del" data-type="delete" data-seq="${detailBoard.UB_SEQ}"><em>삭제</em></button>
				</div>
			</div>
</c:if>
			<div class="cont">
				<h3>${detailBoard.UB_TITLE}</h3>
				<p>
					${fn:replace(detailBoard.UB_CMT,'
','<br/>')}
				</p>

				<div class="count-area">
					<ul>
						<li><span><i>좋아요</i> <strong id="likeCount">${detailBoard.UB_LIKE_CNT }</strong></span></li>
						<li><span><i>댓글</i> <strong id="replyCount">${detailBoard.UB_REPLY_CNT }</strong></span></li>
					</ul>
				</div>
			</div>

			<div class="btn-area">
				<button type="button" id="likebutton" class="btn-like"><i class="fa fa-heart-o" aria-hidden="true"></i>  <em>좋아요</em></button>
				<button type="button" class="btn-comment"><em><i class="fa fa-comments" aria-hidden="true"></i> 댓글달기</em></button>
			</div>
	<form name="reply_frm" mehtod="post">
		<input type="hidden" id="ub_seq" name="ub_seq" value="${detailBoard.UB_SEQ}" />
		<input type="hidden" id="ur_pre_seq" name="ur_pre_seq" value="0" />
			<div class="comment-input">
				<textarea id="ur_text" name="ur_text"></textarea>
				<button type="button" class="btn-blue" data-type="replyWrite"><em>등록</em></button>
			</div>
	</form>
			<div class="comment-list">
			</div>
		</div>
	</section>
</div>

<%@include file="/WEB-INF/jsp/common/footer.jsp" %>

</body>

<script type="text/javascript">

$(function(){
	fn_replyList();
	fn_likeList();
});

//댓글 저장
var SaveAjax = true;
$(document).on("click","[data-type='replyWrite']",function(){
	if(!SaveAjax){
		alertLayer("잠시만 기다려 주세요.");
		return;
	}
	if($("textarea[name='ur_text']").val().length < 5){
		alertLayer("댓글을 5자이상 입력해주세요.","","[name='ur_text']");
		return;
	}
	
	var con = confirm("등록 하시겠습니까?");
	if(!con){
		return;
	}
	
	$.ajax({
		url : "/board/writeReplyProc.do",
		dataType : "json",
		type : "post",
		async   : false,
		data : $("form[name='reply_frm']").serialize(),
		beforeSend : function(){
			SaveAjax = false;
		},
		success : function(result) {
			if(result.data){
				alertLayer("등록되었습니다.","","");
				fn_replyList();
				$(".btn-comment").trigger("click");
				$("textarea[name='ur_text']").val("");
			}else{
				alertLayer(result.msg);			}
		},
		error : function() {							
			alertLayer("등록 중 오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
		},
		complete : function(data) {
			SaveAjax = true;
		}			
	});
});


//댓글 리스트 가져오기
var fn_replyList = function(){
	$.ajax({
		url : "/board/replyList.do",
		dataType : "json",
		type : "post",
		async   : false,
		data : {ub_seq : $("input[name='ub_seq']").val()},
		beforeSend : function(){
		},
		success : function(result) {
			var data = result.data;
			$("strong[id='replyCount']").text(data.totalCount);
			var list = data.list;
			if(list.length > 0){
				var html = "";
				html += "<ul>";
				for(var i=0; i<list.length; i++){
					html += ""
						+ " <li> "
						+ " 	<p>" + list[i].UR_TEXT.replace("\r\n","<br/>").replace("\r","<br/>").replace("\n","<br/>") + "</p> "
						+ " 	<span class=\"user-info\"><span class=\"name\"><strong>" + list[i].MM_NAME + "</strong></span><i class=\"date-time\">" + list[i].CRE_DT + "</i></span> ";
					if(list[i].DEL_YN == "Y"){
						html += " 	<button type=\"button\" class=\"btn-del\" data-type=\"replyDel\" data-seq=\"" + list[i].UR_SEQ + " \" ><i class=\"fa fa-times\" aria-hidden=\"true\"></i></button> ";						
					}

	
					html += " </li> ";
				}
				html += "</ul>";
				$("div[class='comment-list']").html(html);
			}
		},
		error : function() {							
			alertLayer("오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
		},
		complete : function(data) {
		}			
	});
}


//댓글 삭제
$(document).on("click","button[data-type='replyDel']",function(){
	if(!SaveAjax){
		alertLayer("잠시만 기다려 주세요.");
		return;
	}
	if(!confirm("삭제하시겠습니까?")){
		return;
	}
	
	$.ajax({
		url : "/board/replyDeleteProc.do",
		dataType : "json",
		type : "post",
		async   : false,
		data : {ub_seq : $("input[name='ub_seq']").val(),ur_seq : $(this).attr("data-seq")},
		beforeSend : function(){
			SaveAjax = false;
		},
		success : function(result) {
			fn_replyList();
		},
		error : function() {							
			alertLayer("오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
		},
		complete : function(data) {
			SaveAjax = true;
		}			
	});
});



//좋아요
var LikeAjax = true;
$(document).on('click','.btn-like',function(){
	var like_flag = "";
	if($(this).hasClass("checked")){
		like_flag = "N";
	}else{
		like_flag = "Y";
	}
	
	if(!LikeAjax){
		alertLayer("잠시만 기다려 주세요.");
		return;
	}
	$.ajax({
		url : "/board/likeProc.do",
		dataType : "json",
		type : "post",
		async   : false,
		data : {ub_seq : $("input[name='ub_seq']").val(),like_flag : like_flag},
		beforeSend : function(){
			LikeAjax = false;
		},
		success : function(result) {
			fn_likeList();
		},
		error : function() {							
			alertLayer("오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
		},
		complete : function(data) {
			LikeAjax = true;
		}			
	});
});

var fn_likeList = function(){
	$.ajax({
		url : "/board/likeList.do",
		dataType : "json",
		type : "post",
		async   : false,
		data : {ub_seq : $("input[name='ub_seq']").val()},
		beforeSend : function(){
		},
		success : function(result) {
			var data = result.data;
			$("strong[id='likeCount']").text(data.count);
			if(data.LIKE_YN == "Y"){
				$("button[id='likebutton']").addClass("checked");
			}else{
				$("button[id='likebutton']").removeClass("checked");
			}
		},
		error : function() {							
			alertLayer("오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
		},
		complete : function(data) {
		}			
	});
}


//수정
$(document).on("click","[data-type='modify']",function(){
	if(!confirm("수정하시겠습니까?")){
		return;
	}
	location.href = "/board/modify.do?ub_seq=" + $(this).attr("data-seq");
});

//삭제
var DeleteAjax = true;
$(document).on("click","[data-type='delete']",function(){
	if(!DeleteAjax){
		alertLayer("잠시만 기다려 주세요.");
	}
	if(!confirm("삭제하시겠습니까?")){
		return;
	}
	$.ajax({
		url : "/board/deleteProc.do",
		dataType : "json",
		type : "post",
		async   : false,
		data : {ub_seq : $(this).attr("data-seq")},
		beforeSend : function(){
			DeleteAjax = false;
		},
		success : function(result) {
			location.href ="/main/main.do";
		},
		error : function() {							
			alertLayer("오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
		},
		complete : function(data) {
			DeleteAjax = true;
		}			
	});
});


$(document).on('click','.btn-comment',function(){
	$(this).toggleClass("open");
	$(".comment-input").slideToggle();
});

$(document).on('click','.btn-option',function(){
	$(this).parents(".view-body").toggleClass("option");
});

</script>
</html>
  