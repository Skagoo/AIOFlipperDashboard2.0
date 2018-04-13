$(document).ready(function() {
	var count = 0;
	//.listview__scroll scrollbar-inner
	$('.listview__scroll scrollbar-inner').find('a').each (function(row, a) {
		count++;
	});

	if (count == 0) {
		//.top-nav__notify::before
		$('head').append('<style>.top-nav__notify::before{visibility: hidden !important;}</style>');
	}

});
