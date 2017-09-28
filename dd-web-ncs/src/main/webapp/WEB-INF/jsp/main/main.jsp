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
<div class="mask" data-mask-close="Y"></div>

<%@include file="/WEB-INF/jsp/common/header.jsp" %>

<div id="wrap" class="main">
	<header>
		<button type="button" class="btn-l btn-menu"><i class="fa fa-bars" aria-hidden="true"></i></button>
		<h1 class="tit hide"><em></em></h1>
		<div class="util-area alignR">
			<!-- <button type="button" class="btn-msg"><i class="fa fa-commenting" aria-hidden="true"></i><i class="badge">1</i></button> -->
			<button type="button" class="btn-login" onclick="fn_close();"><i class="fa fa-power-off" aria-hidden="true"></i></button>
		</div>
	</header>
	<div class="srch-wrap">
		<select name="search_cate" style="width:20%">
			<option value="">카테고리</option>
<c:if test="${USER.MM_TYPE eq 'U'}">			
			<option value="mycate" ${params.search_cate eq 'mycate' ? 'selected' : '' }>관심 카테고리</option>
</c:if>
<c:forEach var="item" items="${cd:getCodeList(params.CODE, 'MC_CATE_CODE')}" varStatus="status">
							<option value="${item.CD }" ${item.CD eq params.search_cate ? 'selected' :'' }>${item.NM }</option>
</c:forEach>
		</select>
		<select name="search_area2" style="width:20%">
			<option value="">지역</option>
<c:forEach var="item" items="${cd:getCodeList(params.CODE, '서울시')}" varStatus="status">
							<option value="${item.CD }" ${item.CD eq params.search_area2 ? 'selected' :'' }>${item.NM }</option>
</c:forEach>
		</select>
		<input type="text" name="search_text" style="width:58%" onkeyup="(event.keyCode == 13 ? fn_searchText(this): '');" placeholder="검색">
		<button type="button" class="btn-srch"><i class="fa fa-search" aria-hidden="true"></i></button>
	</div>

	<section id="container">
		<nav class="tab-menu">
			<ul>
				<li data-type="C" class="current"><button type="button"><em>재능 수혜자</em></button></li>
				<li data-type="U"><button type="button"><em>재능 기부자</em></button></li>
			</ul>
		</nav>
		<div class="swiper-container">
		<div class="swiper-wrapper">
			<!-- 재능수혜자 -->
			<div class="swiper-slide panel institution">
				<div id="list_c">
					<div id="loading_c" style="display:none;" class="loading"><span class="bar"></span><span class="symbol"></span></div>
				</div>
			</div>
			<!-- //재능수혜자 -->

			<!-- 재능기부자 -->
			<div class="swiper-slide panel">
				<div id="list_u">
					<div id="loading_u"  style="display:none;" class="loading"><span class="bar"></span><span class="symbol"></span></div>
				</div>
			</div>
			<!-- //재능기부자 -->

		</div>
		</div>

		<button type="button" class="btn-write" onclick="fn_write();"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>

	</section>
</div>

<%@include file="/WEB-INF/jsp/common/footer.jsp" %>

</body>

<script type="text/javascript">

var SearchText = "";
var CurrentType = "C";
var PageNum = {c_page : "", u_page : "", c_pageTotal : 0 ,u_pageTotal : 0};
var ListAjax = {c:true, u : true};
var TimeInter; 
$(function(){
	fn_init();
	$(window).scroll(function(e){
		fn_scroller();		
	});
	TimeInter = setInterval("fn_scroller()", 1000); // 매 5000ms(5초)가 지날 때마다 ozit_timer_test() 함수를 실행합니다.
});

//지역  및 카테고리 변경
$(document).on("change","select[name='search_cate'],select[name='search_area2']",function(){
	fn_init();
});

//검색어
$(document).on("focusout","input[name='search_text']",function(){
	fn_searchText(this);
});

//search박스
var fn_searchText = function(obj){
	if(SearchText != $(obj).val()){
		SearchText = $(obj).val();
		fn_init();
	}
} 

//페이지 초기화
var fn_init = function(){
	PageNum = {c_page : "", u_page : "", c_pageTotal : 0 ,u_pageTotal : 0};
	fn_list("C",1);	
	fn_list("U",1);
}

//스크롤시 페이지 읽기
var fn_scroller = function(){
	if(!ListAJaxCheck){
		clearInterval(TimeInter);
	}
	var type = CurrentType.toLowerCase();		
	var bHeight = $("div[id='list_" + type + "']").height() - $("body").height() - $("body").scrollTop();
	if($("div[id='wrap']").css("display") != "none" && bHeight < 600){
		var page = (PageNum[type + "_page"] * 1) + 1;
		fn_list(CurrentType,page);
	}
}

//리스트 가져오기
var ListAJaxCheck = true;
var fn_list = function(mm_type,pageNum){
	var type = mm_type.toLowerCase();
	
	if(!ListAjax[type]){
		return;
	}
	var cPage = PageNum[type + "_page"];
	var cPageTotal  = PageNum[type + "_pageTotal"];
	if(cPage != "" && cPage > cPageTotal){
		return;
	}
	var $loadingBar = $("div[id='loading_" + type + "']");
	$.ajax({
		url : "/board/boardList.do",
		dataType : "json",
		type : "post",
		async   : true,
		data : {mm_type : mm_type, pageNum : pageNum
			,search_cate : $("select[name='search_cate']").val()
			,search_area2 : $("select[name='search_area2']").val()
			,search_text : $("input[name='search_text']").val()},
		beforeSend : function(){
			ListAjax[type] = false;
			$loadingBar.show();
		},
		success : function(result) {
			var data = result.data;
			var page = data.page;
			
			var type = page.mm_type.toLowerCase();
			var totalCount = page.totalCount;
			var pageTotal  = page.pageTotal;
			var pageNum = page.pageNum;
			PageNum[type + "_page"] = pageNum;
			PageNum[type + "_pageTotal"] = pageTotal;

			if(pageNum == 1){
				$("div[id='list_" + type + "'] [data-type='feed']").remove();
			}
			
			var list = data.list;

			var html = "";
			for(var i=0; i< list.length ; i++){
				html += ""

					+ " <div class=\"feed\" data-type=\"feed\"> "
					+ " 	<div class=\"profile-area\"> "
					+ " 		<dl> "
					+ " 			<dt><span class=\"thumb\" style=\"background-image:url('" + (list[i].MM_PIC_URL != undefined && list[i].MM_PIC_URL != '' ? list[i].MM_PIC_URL : '/common/images/default_img.png') + "')\"></span></dt> "
					+ " 			<dd class=\"user-info\"> "
					+ " 				<div class=\"align-box\"> "
					+ " 					<span class=\"user\"> "
					+ " 						<span class=\"name\"><strong>" + list[i].MM_NAME + "</strong></span> "
					+ " 							<i class=\"division\">" + (list[i].UB_CATEGORY_NM ? list[i].UB_CATEGORY_NM : "") + "</i> "
					+ " 							<i class=\"date-time\">" + list[i].DATE_SHOW + "</i> "
					+ " 						</span> "
					+ " 					<span class=\"info\"><em class=\"region\">" + list[i].UB_AREA2 + "(" + list[i].UB_AREA1 + ")" + "</em></span> "
					+ " 				</div> "
					+ " 			</dd> "
					+ "		 	</dl> "
					+ " 	</div> ";

				if(list[i].MODIFY_YN == "Y"){
					html += "	<div class=\"option-area\"> "
						+ "		<button type=\"button\" class=\"btn-option\"><em>option menu</em></button> "
						+ "		<div class=\"btns\"> "
						+ "			<button type=\"button\" class=\"btn-modify\" data-type=\"modify\" data-seq=\"" + list[i].UB_SEQ + "\"><em>수정</em></button><button type=\"button\" class=\"btn-del\" data-type=\"delete\" data-seq=\"" + list[i].UB_SEQ + "\"><em>삭제</em></button> "
						+ "		</div> "
						+ "	</div> ";					
				}
					
				html += " 	<div class=\"cont\"> "
					+ " 		<a href=\"#detail\" onclick=\"location.href='/board/detail.do?ub_seq=" + list[i].UB_SEQ + "';return false;\">"
					+ " 		<dl> "
					+ " 			<dt>" + list[i].UB_TITLE + "</dt> "
					+ " 			<dd> "
					+ " 				" + list[i].UB_CMT
					+ " 			</dd> "
					+ " 		</dl> "
					+ "			</a>"
					+ " 	</div> "
					+ "		<div class=\"count-area\"> "
					+ "			<ul> "
					+ "				<li><button type=\"button\" class=\"btn-like " + (list[i].LIKE_YN == "Y" ? 'checked' : '')  + "\" data-id=\"likebutton\" data-seq=\"" + list[i].UB_SEQ + "\"><i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i> <i>좋아요</i> <strong data-id=\"likeCount\" data-seq=\"" + list[i].UB_SEQ + "\">" + list[i].UB_LIKE_CNT + "</strong></button></li> "
					/* + "				<li><span class=\"entry\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i> <i>참가자</i> <strong>3</strong></span></li> " */
					+ "				<li><button type=\"button\" class=\"btn-comment\"><i class=\"fa fa-comments\" aria-hidden=\"true\"></i> <i>댓글</i> <strong>" + list[i].UB_REPLY_CNT + "</strong></button></li> "
					+ "			</ul> "
					+ "		</div> "
					+ "	</div> "

			}
			$("div[id='loading_" + type + "']").before(html);
		
			ListAjax[type] = true;
		},
		error : function() {							
			alertLayer("오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
			ListAjax[type] = true;
			ListAJaxCheck = false;
		},
		complete : function(data) {
			$loadingBar.hide();
		}			
	});
}
	

</script>


	<script>
	
		$(function(){
			//Keep track of last scroll
			var lastScroll = 0;
/* 			$(window).scroll(function(event){
				var st = $(this).scrollTop();
				if (st > lastScroll && st >= 70){
					//alert("DOWN");
					$(".btn-write").stop().animate( {'right':'-5rem'}, {duration: 300, easing: "easeInOutCubic"});
				}
				else {
					//alert("UP");
					$(".btn-write").stop().animate( {'right':'1rem'}, {duration: 300, easing: "easeInOutCubic"});
				}
				if (st==0){
					$(".btn-write").stop().animate( {'right':'1rem'}, {duration: 300, easing: "easeInOutCubic"});
				}
				lastScroll = st;
			}); */
			/* category swiper */
			$(document).on("click",".tab-menu li button",function(e){
				e.preventDefault();
				var id = $(this).parent().index();
				swiper.slideTo(id);
				$(".tab-menu li").removeClass("current").eq(id).addClass("current");
				CurrentType = $(".tab-menu li").eq(id).attr("data-type");
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
					CurrentType = $(".tab-menu li").eq(s.activeIndex).attr("data-type");
					$("html, body").animate({scrollTop:"0"}, 100);

/* 					var activeSlideHeight = s.slides.eq(s.activeIndex).height();
					s.container.css({height: activeSlideHeight+'px'});	 */
				}
			});
		});
		

		$(document).on('focus','.srch-wrap input',function(){
			$("#wrap").addClass("focus");
		});
		$(document).on('focusout','.srch-wrap input',function(){
			$("#wrap").removeClass("focus");
		});
		//좋아요
		var LikeAjax = true;
		$(document).on('click','.btn-like',function(){
			var like_flag = "";
			var ub_seq = $(this).attr("data-seq");
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
				data : {ub_seq : ub_seq,like_flag : like_flag},
				beforeSend : function(){
					LikeAjax = false;
				},
				success : function(result) {
					fn_likeList(ub_seq);
				},
				error : function() {							
					alertLayer("오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
				},
				complete : function(data) {
					LikeAjax = true;
				}			
			});
		});

		
		var fn_likeList = function(ub_seq){
			$.ajax({
				url : "/board/likeList.do",
				dataType : "json",
				type : "post",
				async   : false,
				data : {ub_seq : ub_seq},
				beforeSend : function(){
				},
				success : function(result) {
					var data = result.data;
					$("strong[data-id='likeCount'][data-seq='" + ub_seq + "']").text(data.count);
					if(data.LIKE_YN == "Y"){
						$("button[data-id='likebutton'][data-seq='" + ub_seq + "']").addClass("checked");
					}else{
						$("button[data-id='likebutton'][data-seq='" + ub_seq + "']").removeClass("checked");
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
					fn_init();
				},
				error : function() {							
					alertLayer("오류가 발생했습니다.\n잠시 후 다시 이용해주세요.");
				},
				complete : function(data) {
					DeleteAjax = true;
				}			
			});
		});
		
		
		$(document).on('click','.btn-menu',function(){
			$(".menu-wrap").stop().animate( {'left':'0'}, {duration: 300, easing: "easeInOutCubic"});
			$(".btn-close").stop().animate( {'left':'82%'}, {duration: 300, easing: "easeInOutCubic"});
			$(".mask").fadeIn();
		});
		$(document).on("click","[data-mask-close='Y']",function(){
			$(".menu-wrap").stop().animate( {'left':'-80%'}, {duration: 300, easing: "easeInOutCubic"});
			$(".btn-close").stop().animate( {'left':'-12%'}, {duration: 300, easing: "easeInOutCubic"});
			$(".mask").fadeOut();
		});

		$(document).on('click','.btn-option',function(){
			$(this).parents(".feed").toggleClass("option");
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
  