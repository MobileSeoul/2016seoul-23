$(function() {
	var userAgent = navigator.userAgent;
	if ( userAgent.match(/LG-P490L/) || userAgent.match(/SHW-M480S/) || userAgent.match(/iPad/) ) {
	 $("html,body").addClass("tablet");
	}
	
	/* category swiper */
	$(document).on("click",".category li button",function(e){
		e.preventDefault();
		var id = $(this).parent().index();
		swiper.slideTo(id);
		$(".category li").removeClass("current").eq(id).addClass("current");
		
		return false;
	});

	//중요 깃발 토글
	$(document).on("click",".btn-important",function(e){
		$(this).toggleClass("on");
	});

	//메일 sort 
	$(document).on("click",".sort-list h3 button,.select-lang h3 button",function(){
		$(this).toggleClass("fold");
		$(this).parent().siblings("ul").slideToggle('fast');
	});
	
	//내 할일 다른 리스트  닫기
	$(document).on("click",".select-status h3 button",function(){
		var ul = $(this).parent().siblings("ul");
		$(".sort-list h3 button").not(this).removeClass("fold");
		$(".sort-list ul").not(ul).hide();
		$(".sort-list").not(this).css("z-index","");
		$(this).parent().parent().css("z-index","100");
	});
	
	//document 클릭 시 sort 레이어 닫기
	$(document).on("click",function(e) { 
		if($(e.target).parents(".sort-list").size() == 0) {
			$('.sort-list ul').hide();
	        $(".sort-list h3 button").removeClass("fold");
		}
	});

	//메일리스트 삭제 버튼 클릭 시 
	$(document).on("click",".mail .btn-del",function(){
		$(".content").addClass("list-del");
	});
	//메일리스트 삭제 cancle 클릭 시
	$(document).on("click",".mail .btn-cancle",function(){
		$(".content").removeClass("list-del");
	});
	
	//메일 상세 주소영역 fold
	$(document).on("click",".mail-view .btn-fold",function(){
		$(this).toggleClass("fold");
		$(".address-area").slideToggle('fast');
	});

	//accordion
	$(document).on("click",".accordion",function(){
		$(this).toggleClass("fold");
		$(this).next("dd").slideToggle('fast');
	});

	//메일함
	$(document).on("click",".list-box li > button.fold",function(){
		$(this).toggleClass('up');
		$(this).prev(".btn-folder").toggleClass('open up');
		$(this).parent().next(".folder-box").slideToggle('fast');
		$(this).parent().next("ul").slideToggle('fast');
	});

	//예약함
	$(document).on("click",".reserve .list-box li > button.open",function(){
		//alert("d");
		$(this).toggleClass('up');
		$(this).next("ul").slideToggle('fast');
	});

	//결재함
	$(document).on("click",".approval .list-box li button.open",function(){
		$(this).toggleClass('up');
		$(this).prev(".btn-folder").toggleClass('open up');
		$(this).next("ul").slideToggle('fast');
	});

	//메일 sort 
	$(document).on("click",".btn-approvalLine",function(){
		$(this).toggleClass("open");
		$(this).next(".approval-line").slideToggle('fast');
	});

	//일정 리스트 클릭 시
	$(document).on("click",".sch-list li button",function(){
		$(".sch-list li").removeClass("current");
		$(this).parent().addClass("current");
	});

	/*연락처 조직도 
	$(document).on("click",".add-list li > button",function(e){
		if ( $(e.target).is('.depth1') ){
			$(this).parent().addClass("fold");
		}
		
		if( $(this).attr('data-click-state') == 1) {
			$(this).attr('data-click-state', 0)
			$(this).removeClass('up');
			$(this).next().slideUp('fast');
			
			$("li").not(this).removeClass("last");
			$(this).parent().removeClass("last");

		} else {
			$(this).attr('data-click-state', 1)
			$(this).addClass('up');
			$(this).next().slideDown('fast');
			
			$("li").not(this).removeClass("last");
			$(this).parent().addClass("last");

		}
	});
	*/
	//연락처 조직도 선택
	$(document).on("click",".add-list .ac button",function(e){
		if ( $(e.target).is('.depth1') ){
			$(this).parent().addClass("fold");
		}
		
		if( $(this).attr('data-click-state') == 1) {
			$(this).attr('data-click-state', 0)
			$(this).removeClass('up');
			$(this).parent().next().slideUp('fast');
			
			$("li").not(this).removeClass("last");
			$(this).parent().parent().removeClass("last");

		} else {
			$(this).attr('data-click-state', 1)
			$(this).addClass('up');
			$(this).parent().next().slideDown('fast');
			
			$("li").not(this).removeClass("last");
			$(this).parent().parent().addClass("last");

		}
	});
	
});

$(document).ready(function(){

	// swiper 초기 높이 지정
/*	
	$(".main .swiper-container").each(function(){
		$(this).css("height",$(".swiper-slide-active").height());
	});
*/

	$(".datepicker").each(function(){
		$(this).datepicker({
			showMonthAfterYear: true,
			changeMonth: true,
			changeYear: true,
			dateFormat: "yy.mm.dd",
			monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
			dayNamesMin: [ "일", "월", "화", "수", "목", "금", "토" ],
			showButtonPanel: true,
			currentText: "오늘",
			closeText: "취소",
			showOn: 'both'
		});
	});

	//메일상세 주소 5개 이상 일 때
	$(".address-area dd").each(function(){
		var count = $(this).find(".addr_obj").length;
		if ( count > 5 ){
			$(this).addClass("fold");
		}
		$(this).find(".btn-more").click(function(){
			$(this).parent("dd").toggleClass("fold");
		});
	});

	//로그인 탭
	$(".login-tab").each(function(){
		$(this).find("button").click(function(){
			var num = $(this).parent("li").index(); 
			var $form = $(".login-form");
			
			if (num == 0){
				$(".login-tab li").removeClass("current");
				$(this).parent("li").addClass("current");
				$form.hide();
				$(".employee-login").show();
			}
			if (num == 1){
				$(".login-tab li").removeClass("current");
				$(this).parent("li").addClass("current");
				$form.hide();
				$(".mail-login").show();
			}
		});
	});

	//경조사 등록 라디오버튼
	$(".family-event li label").each(function(){
		$(this).bind("click", function(){
			var num = $(this).parent().index(); 
			$(this).find("input").attr("checked",true);
			$(".form-area .evt").removeClass("show").eq(num).addClass("show");
		});
	});

	//일정 sort 
	$(".schedule .sort-category").each(function(){
		$(document).on('click', '.sort-category h3 button', function(){
			$(this).toggleClass("fold");
			$(this).parent().next("ul").slideToggle('fast');
		});
	});
	
	//설정 아코디언 클릭 시 스크롤 위치 조정
	$(".setting .accordion").each(function(){
		$(this).bind("click", function(){
			var currScroll = $(this).offset().top - 52;
			$("html, body").animate({scrollTop:currScroll + "px"}, 300);

		});
	});

		
});

$(window).load(function(){
	
	//메인 탭메뉴
	$(".home .tab-menu").each(function(){
		var topH = $(".main .util-area").height();
		$(this).sticky({ topSpacing: topH });
	});
	
	
	//일정 월간, 주간
	$(".schedule .month .sch-list,.reserve .sch-list").each(function(){
		var topH = $(this).offset().top;
		$(this).css({"position":"absolute","top":topH});
	});
	
	
	//예약 월간, 주간
	$(".res-cont .week:last-child").each(function(){
		var topH = $(this).offset().top;
		$(this).css({"position":"absolute","top":topH});
	});

	

	//게시판
	$(".board-list .sc-cont").each(function(){
		var topH = $(this).offset().top;
		$(this).css({"position":"absolute","top":topH});
	});


	
});

function swiperTab(slide){
	var id = slide;
	swiper.slideTo(id);
	$(".sub-tab li").removeClass("current").eq(id).addClass("current");
	
	//$("#container").removeClass().addClass("content tab"+slide);
	return false;
}