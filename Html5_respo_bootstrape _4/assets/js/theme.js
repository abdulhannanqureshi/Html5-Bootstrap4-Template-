/**
 * common.js
 *
 *  version --- 3.6
 *  updated --- 2011/09/06
 */


/* !stack ------------------------------------------------------------------- */
/* 全てのスマホで幅320px(iphone)相当に見えるようにdpiを調整 */
jQuery(document).ready(function($) {
	/*
	 Android の場合 DPIを調整
	=========================================*/
	$(window).on('resize.dpi', function () {

		// 指定済みの viewport を取得
		var BASE_PARAM = $('meta[name="viewport"]').attr('content');
	
		// Android スマートフォンのみに適用する（タブレットも対象にしたい場合は 'Mobile' の判定を削除）
		if (navigator.userAgent.indexOf('Android') != -1 && navigator.userAgent.indexOf('Mobile') != -1 && window.orientation === 0) {
	
			// デバイスのスクリーンの幅を取得する
			var width = $(window).width();
	
			// Android の仕様でDPI基準値となる 160 で固定
			var DEFAULT_DPI = 160;
	
			// iPhone の幅に合わせるので 320 固定
			// ※ガラケー基準の場合は、240 でも可
			var DEFAULT_WIDTH = 320;
	
			if (width !== DEFAULT_WIDTH) {
	
				// 320px で収まる DPI を計算する
				var dpi = DEFAULT_WIDTH / width * DEFAULT_DPI;
	
				// 幅が正常に取得できた時だけ （dpi の値が、仕様の 70-400 に収まる）
				// 幅が正常に取得できず DPI が異常値（70-400に入らない）になった場合に除外する
				if (dpi >= 70 && dpi <= 400) {
					// Androidは「target-densitydpi」プロパティで、1インチの中に何ドット表示するかを設定して調整する
					$('head').append('<meta name="viewport" content="target-densitydpi=' + dpi + ', ' + BASE_PARAM + '" />');
				}
			}
		}
	}).trigger('resize.dpi');
	
	pageScroll();
	rollover();
	common();
});

$(function() { //IE8のalpha使用時に発生の黒枠を消す
    if(navigator.userAgent.indexOf("MSIE") != -1) {
        $('img').each(function() {
            if($(this).attr('src').indexOf('.png') != -1) {
                $(this).css({
                    'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' +
                    $(this).attr('src') +
                    '", sizingMethod="scale");'
                });
            }
        });
    }
});	

/* !isUA -------------------------------------------------------------------- */
var isUA = (function(){
	var ua = navigator.userAgent.toLowerCase();
	indexOfKey = function(key){ return (ua.indexOf(key) != -1)? true: false;}
	var o = {};
	o.ie      = function(){ return indexOfKey("msie"); }
	o.fx      = function(){ return indexOfKey("firefox"); }
	o.chrome  = function(){ return indexOfKey("chrome"); }
	o.opera   = function(){ return indexOfKey("opera"); }
	o.android = function(){ return indexOfKey("android"); }
	o.ipad    = function(){ return indexOfKey("ipad"); }
	o.ipod    = function(){ return indexOfKey("ipod"); }
	o.iphone  = function(){ return indexOfKey("iphone"); }
	return o;
})();

/* !rollover ---------------------------------------------------------------- */
var rollover = function(){
	var suffix = { normal : '_no.', over   : '_on.'}
	$('a.over, img.over, input.over').each(function(){
		var a = null;
		var img = null;

		var elem = $(this).get(0);
		if( elem.nodeName.toLowerCase() == 'a' ){
			a = $(this);
			img = $('img',this);
		}else if( elem.nodeName.toLowerCase() == 'img' || elem.nodeName.toLowerCase() == 'input' ){
			img = $(this);
		}

		var src_no = img.attr('src');
		var src_on = src_no.replace(suffix.normal, suffix.over);

		if( elem.nodeName.toLowerCase() == 'a' ){
			a.bind("mouseover focus",function(){ img.attr('src',src_on); })
			 .bind("mouseout blur",  function(){ img.attr('src',src_no); });
		}else if( elem.nodeName.toLowerCase() == 'img' ){
			img.bind("mouseover",function(){ img.attr('src',src_on); })
			   .bind("mouseout", function(){ img.attr('src',src_no); });
		}else if( elem.nodeName.toLowerCase() == 'input' ){
			img.bind("mouseover focus",function(){ img.attr('src',src_on); })
			   .bind("mouseout blur",  function(){ img.attr('src',src_no); });
		}

		var cacheimg = document.createElement('img');
		cacheimg.src = src_on;
	});
};
/* !pageScroll -------------------------------------------------------------- */
var pageScroll = function(){
	jQuery.easing.easeInOutCubic = function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	}; 
	$('a.scroll, .scroll a').each(function(){
		$(this).bind("click keypress",function(e){
			e.preventDefault();
			var target  = $(this).attr('href');
			var targetY = $(target).offset().top;
			var parent  = ( isUA.opera() )? (document.compatMode == 'BackCompat') ? 'body': 'html' : 'html,body';
			$(parent).animate(
				{scrollTop: targetY },
				400
			);
			return false;
		});
	});
	// add active class by scroll remove css 
	$(window).scroll(function() {
        var scrollDistance = $(window).scrollTop();
        var increaseScrol = scrollDistance + 10;  
        // Assign active class to nav links while scolling
        $('.page-section').each(function(i) {
            if ($(this).position().top <= increaseScrol ) {
                $('.navigation li a.active').removeClass('active');
                $('.navigation li').eq(i+1).find('a').addClass('active');
            }
        });
    }).scroll();
	$('.pageTop').click(function(){
		$('html,body').animate({scrollTop: 0}, 'slow','swing', 3000);
		return false;
	});
	$(window).scroll(function() {
	    var height = $(window).scrollTop();
	    if (height > 50) {
	        $('.pageTop').fadeIn();
	    } else {
	        $('.pageTop').fadeOut();
	    }
	});
}



/* !common --------------------------------------------------- */
var common = (function(){
	$('#gNavi li').hover(function(){
		if($(this).has('ul'))
			$(this).find('ul').stop().slideDown(200);
	},function(){
		if($(this).has('ul'))
			$(this).find('ul').stop().slideUp(200);
	});
	$('.navbarToggle').on('click',function(){
		var target = $(this).data('target');
		if($(target).hasClass("on")){
			$(target).stop().slideUp(200).removeClass("on");
			$(this).removeClass("on");
		}else{
			$(target).stop().slideDown(200).addClass("on");
			$(this).addClass("on");
		}
		
	});
	$(window).resize(function (event) {
		if($('.visibleTS').css('display') == 'none') {
			var target = $('.navbarToggle').data('target');
			$(target).hide().removeClass("on");
			$('.navbarToggle').removeClass("on");
		}
	});
	// グローバルナビ 該当コーナーのov
	if ($('#pageID').length == 1) {
		var ides = $('#pageID').val().split(',');
		for (var idx = 0; idx < ides.length; idx++) {
			var id = '#' + ides[idx];
			
			if ($(id).not('a').length == 1)
				$(id).addClass('selected');	
		}
	}
	
});
// Filter with table 
		$("#myInput").on("keyup",function(){
			var value = $(this).val().toLowerCase();
			$("#myTable tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value)> -1);
            });
		});

// for accordion plus icon change and background color change by click 
$('.panel-heading a').click(function(e){
	if($(this).hasClass('bgMinus')){	
		$(this).stop().removeClass('bgMinus');	
		$(this).parents('.bdr-bottom').stop().removeClass('bgclr');
	}
	else{
		$('.panel-heading a').stop().removeClass('bgMinus');	
		$('.panel-heading a').parents('.bdr-bottom').stop().removeClass('bgclr');
		$(this).stop().addClass('bgMinus');	
		$(this).parents('.bdr-bottom').stop().addClass('bgclr');
	}
});
$(".navbarToggle i").click(function(){
	$(".navbarCollapse").slideToggle(300);
});
// for active current page
function getUrl(){
                var url = $(location).attr('href'),
                parts = url.split("/"),
                loc = parts[parts.length-1];
                $('#gNavi').find('a').each(function() {
                    var aHref =  $(this).attr('href'),
                        aparts =  aHref.split("/"),
                        aloc = aparts[aparts.length-1];
                    if( loc == aloc){
                        $("#gNavi a").removeClass('active');
                        $(this).addClass('active');
                    }
                });
            }
            getUrl();
// for active class
$(window).scroll(function() { 
    var scrollDistance = $(window).scrollTop(); 
    var increaseScrol = scrollDistance + 110; 
    // Assign active class to nav links while scolling 
    $('.section').each(function(i) { 
	    if ($(this).offset().top <= increaseScrol ) { 
		    $('#gNavi li a.active').removeClass('active'); 
		    $('#gNavi li').eq(i).find('a').addClass('active'); 
    	} 
   }); 
}).scroll(); 


// for close navbarCollapse
// $(".navbarCollapse ul li a").click(function(){
// 	$(".navbarCollapse").slideToggle(300);
// });
// // for fixed header
// $(window).scroll(function(){
//   var sticky = $('#header'),
//       scroll = $(window).scrollTop();

//   if (scroll >= 50) sticky.addClass('fixed');
//   else sticky.removeClass('fixed');
// });

// for scroll add active class
// $(window).scroll(function() {
// 		var scrollDistance = $(window).scrollTop();
// 		$('.section').each(function(i) {
// 			if ($(this).position().top <= scrollDistance) {
// 				$('#gNavi li a.active').removeClass('active');
// 				$('#gNavi li a').eq(i).addClass('active');
// 			}
// 		});
// }).scroll();
// $('#gNavi li a').click(function(){
// 	$(this).addClass('active');
// });
// for navi show 
// jQuery(".expand").click(function(){
// 	$(this).toggleClass("rotate");
//     $("#gNavi .inner-gNavi").slideToggle(500);
// });
// // for search show 
// jQuery(".search").click(function(){
// 	$("#gNavi li.full-search").css("right", "225px");
// 	$("#gNavi li.full-search").css("top", "0");
// 	$("#gNavi .inner-gNavi").slideUp(500);
// 	$(".expand").removeClass("rotate");
// 	$("#gNavi li:nth-child(1),#gNavi li:nth-child(2),#gNavi li:nth-child(3),#gNavi li:nth-child(4),#gNavi li:nth-child(5)").fadeOut(900);
	
// });
// // for hide search field
// jQuery("#gNavi li.full-search span").click(function(){
// 	$("#gNavi li.full-search").css("right", "-100%");
// 	$("#gNavi li:nth-child(1),#gNavi li:nth-child(2),#gNavi li:nth-child(3),#gNavi li:nth-child(4),#gNavi li:nth-child(5)").fadeIn(900);
// });