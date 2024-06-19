document.addEventListener("DOMContentLoaded", function () {
	function setBackground() {
		var hour = new Date().getHours();
		var body = document.body;
		if (hour >= 19 && hour < 6) {
			body.style.backgroundImage = "url('https://cllli.oss-cn-beijing.aliyuncs.com/background/night.jpg')"; // 白天背景图片
		} else {
			body.style.backgroundImage = "url('https://cllli.oss-cn-beijing.aliyuncs.com/background/day.jpg')"; // 晚上背景图片
		}
	}
	setBackground();
});

// ===== Open Nav =====
$(".burger-wrapper").click(function () {

	// ===== If Nav is not open	
	if ($('.nav').css("display") == "none") {
		TweenMax.to(".dim", 0.5, { opacity: 1, display: 'block', ease: Power2.easeInOut });
		TweenMax.fromTo(".nav", 0.5, { xPercent: -100 },
			{ xPercent: 0, display: 'block', ease: Expo.easeOut });
		TweenMax.staggerFrom('.nav li', 0.5, { opacity: 0, y: 20, ease: Power2.easeInOut }, 0.1);

		$('.logo-text').css({ 'opacity': '0', 'display': 'none' });
	}
	// ===== If Nav is open	and in Curation page
	else if ($('.nav').css("display") == "block" && $('#curator').css("display") == "block") {
		TweenMax.to(".dim", 0.5, { opacity: 0, display: 'none', ease: Power2.easeInOut });
		TweenMax.to(".nav", 0.5, { xPercent: -100, display: 'none', ease: Expo.easeOut });
		// $('.logo-text').css({'opacity': '1', 'display': 'block'});
	}

	else {
		TweenMax.to(".dim", 0.5, { opacity: 0, display: 'none', ease: Power2.easeInOut });
		TweenMax.to(".nav", 0.5, { xPercent: -100, display: 'none', ease: Expo.easeOut });
		$('.logo-text').css({ 'opacity': '1', 'display': 'block' });
	}

});


// ===== Open Player + dim on =====

$(".btn-open-player, .track_info").click(function () {
	TweenMax.to(".dim", 0.5, { opacity: 1, display: 'block', ease: Power2.easeInOut });
	TweenMax.fromTo("#player", 0.5, { xPercent: 100 },
		{ xPercent: 0, display: 'block', ease: Expo.easeOut });
	TweenMax.to(".mini-player", 0.5, { x: 50, ease: Expo.easeOut });
});

$('.dim').click(function () {
	TweenMax.to(".dim", 0.5, { opacity: 0, display: 'none', ease: Power2.easeInOut });
	TweenMax.to("#player", 0.5, { xPercent: 100, display: 'none', ease: Expo.easeOut });
	TweenMax.to(".nav", 0.5, { xPercent: -100, display: 'none', ease: Power2.easeInOut })
	TweenMax.to(".mini-player", 0.5, { x: 0, ease: Expo.easeOut });
});

// ===== Mini Player - Play/Pause Switch =====

$('.btn-play').click(function () {
	TweenMax.to($('.btn-play'), 0.2, { x: 20, opacity: 0, scale: 0.3, display: 'none', ease: Power2.easeInOut });
	TweenMax.fromTo($('.btn-pause'), 0.2, { x: -20, opacity: 0, scale: 0.3, display: 'none' },
		{ x: 0, opacity: 1, scale: 1, display: 'block', ease: Power2.easeInOut });
});

$('.btn-pause').click(function () {
	TweenMax.to($('.btn-pause'), 0.2, { x: 20, opacity: 0, display: 'none', scale: 0.3, ease: Power2.easeInOut });
	TweenMax.fromTo($('.btn-play'), 0.2, { x: -20, opacity: 0, scale: 0.3, display: 'none' },
		{ x: 0, opacity: 1, display: 'block', scale: 1, ease: Power2.easeInOut });
});

// ===== HoverIn/HoverOut Flash Effect =====

$('.track_info').hover(function () {

	TweenMax.fromTo($(this), 0.5, { opacity: 0.5, ease: Power2.easeInOut },
		{ opacity: 1 })
},
	function () {
		$(this).css("opacity", "1");
	});

$('.burger-wrapper, .logo-text, .back_btn').hover(function () {

	TweenMax.fromTo($(this), 0.5, { opacity: 0.5, ease: Power2.easeInOut },
		{ opacity: 1 })
},
	function () {
		$(this).css("opacity", "1")
	});

$('.btn-open-player').hover(function () {

	TweenMax.fromTo($(this), 0.5, { opacity: 0.5, ease: Power2.easeInOut },
		{ opacity: 1 })
},
	function () {
		$(this).css("opacity", "1")
	});

$('.nav a').hover(function () {

	TweenMax.fromTo($(this), 0.5, { opacity: 0.5, ease: Power2.easeInOut },
		{ opacity: 1 })
},
	function () {
		$(this).css("opacity", "1")
	});

// ===== Player - List Items =====
$('.list_item').click(function () {
	$('.list_item').removeClass('selected');
	$(this).addClass('selected');
});


// ===== Main Play Button - Hover =====

$('.text-wrap .text').hover(function () {
	TweenMax.to($('.main-btn_wrapper'), 0.5, { opacity: 1, display: 'block', position: 'absolute', scale: 1, ease: Elastic.easeOut.config(1, 0.75) }),
		TweenMax.to($('.line'), 0.5, { css: { scaleY: 0.6, transformOrigin: "center center" }, ease: Expo.easeOut })
},

	function () {
		TweenMax.to($('.main-btn_wrapper'), 0.5, { opacity: 0, display: 'none', scale: 0, ease: Elastic.easeOut.config(1, 0.75) }),
			TweenMax.to($('.line'), 0.5, { css: { scaleY: 1, transformOrigin: "center center" }, ease: Expo.easeOut })
	});


// ===== Curation Page  =====
// ===== List  =====
$('.item').hover(function () {
	TweenMax.to($(this), 0.5, { y: -30, ease: Power2.easeInOut }),
		$(this).children('.thumb').addClass('shadow'),
		$(this).children('.connect_btn').addClass('shadow'),

		TweenMax.to($(this).children('.info'), 0.5, { opacity: 1, ease: Power2.easeInOut })
},

	function () {
		TweenMax.to($(this), 0.5, { y: 0, ease: Power2.easeInOut }),
			$(this).children('.thumb').removeClass('shadow'),
			$(this).children('.connect_btn').removeClass('shadow'),

			TweenMax.to($(this).children('.info'), 0.5, { opacity: 0, ease: Power2.easeInOut })
	});


// ===== Home Page to Curation Page Transition  =====
// ===== Main Play Button Activate =====

$('.text-wrap .text').click(function () {

	var homeToMain = new TimelineMax({});

	// Hide
	$('.logo-text').css('display', 'none'),
		homeToMain.to($('.line, .text-wrap'), 0.5, { display: 'none', opacity: 0, y: -20, ease: Power2.easeInOut }, 0),

		// Background down
		homeToMain.to($('.wave-container'), 1, { yPercent: 30, ease: Power2.easeInOut }, 0),

		// Show
		$('#curator').css('display', 'block'),
		homeToMain.fromTo($('.back_btn'), 0.8, { x: 15 },
			{ display: 'flex', opacity: 1, x: 0, ease: Power2.easeInOut }, 1),

		homeToMain.fromTo($('.curator_title_wrapper'), 0.8, { opacity: 0, x: 30 },
			{ opacity: 1, x: 0, ease: Power2.easeInOut }, 1),

		homeToMain.fromTo($('.curator_list'), 0.8, { opacity: 0, display: 'none', x: 30 },
			{ opacity: 1, x: 0, display: 'block', ease: Power2.easeInOut }, 1.2)

});


// ===== Curation Page to Playlist Page
