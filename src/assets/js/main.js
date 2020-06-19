(function ($) {

	"use strict";

	var fullHeight = function () {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function () {
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
	});

	// var modal = document.getElementById("myModal");

	// var btn = document.getElementById("myBtn");

	// var span = document.getElementsByClassName("close")[0];

	// btn.onclick = function () {
	// 	modal.style.display = "block";
	// }

	// span.onclick = function () {
	// 	modal.style.display = "none";
	// }

	// window.onclick = function (event) {
	// 	if (event.target == modal) {
	// 		modal.style.display = "none";
	// 	}
	// }

})(jQuery);

