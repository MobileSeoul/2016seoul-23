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
				<li class="current"><button type="button"><em>아이디 찾기</em></button></li>
				<li><button type="button"><em>비밀번호 찾기</em></button></li>
			</ul>
		</nav>
		<div class="swiper-container">
		<div class="swiper-wrapper">
			<!-- 재능수혜자 -->
			<div class="swiper-slide panel">

				<div class="form-area find-id pd20 alignC">
					
					<div class="input-area mgB20">
						<input type="number" class="w100p alignC">
						<span class="txt-msg  step2">SMS로 인증번호가 오면 입력해주세요</span>
					</div>

					<div class="btn-area">
						<button type="button" class="btn-blue btn-send w200 step1"><em>인증번호 전송</em></button>
						<button type="button" class="btn-orange btn-next w200 step2"><em>다음</em></button>
					</div>

					<div class="after step3">
						<div class="box mgB20 ">
							<em>김형길</em>님의 아이디는<br>
							<strong class="txt_blue">hyeongg**</strong>입니다.
						</div>
						<div class="btn-area">
							<button type="button" class="btn-orange w200"><em>확인</em></button>
						</div>
					</div>


				</div>
			</div>

			<div class="swiper-slide panel">

				<div class="form-area find-pw pd20 alignC">
					
					<div class="input-area mgB20">
						<input type="number" class="w100p alignC">
						<span class="txt-msg step2">SMS로 인증번호가 오면 입력해주세요</span>
					</div>

					<div class="btn-area">
						<button type="button" class="btn-blue btn-send w200 step1"><em>인증번호 전송</em></button>
						<button type="button" class="btn-orange btn-next w200 step2"><em>다음</em></button>
					</div>

					<div class="change-pw step3">
						<div class="pw-area">
							<span><label>새 비밀번호</label><input type="password"></span>
							<span><label>새 비밀번호 확인</label><input type="password"></span>
						</div>
						<div class="btn-area mgT20">
							<button type="button" class="btn-orange w200"><em>확인</em></button>
						</div>
					</div>


				</div>
			</div>
		</div>
		</div>

		
	</section>
</div>

</body>

<script>
		$(function(){
			//Keep track of last scroll
			var lastScroll = 0;
			$(window).scroll(function(event){
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
			});
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
		

		$(document).on('click','.find-id .btn-send',function(){
			alert("인증번호를 전송하였습니다");
			$(".find-id .step1").hide();
			$(".find-id .step2").show();
		});
		$(document).on('click','.find-id .btn-next',function(){
			$(".find-id .step2,.find-id .input-area").hide();
			$(".find-id .step3").show();
		});
		$(document).on('click','.find-pw .btn-send',function(){
			alert("인증번호를 전송하였습니다");
			$(".find-pw .step1").hide();
			$(".find-pw .step2").show();
		});
		$(document).on('click','.find-pw .btn-next',function(){
			$(".find-pw .step2,.find-pw .input-area").hide();
			$(".find-pw .step3").show();
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