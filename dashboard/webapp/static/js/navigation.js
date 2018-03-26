// Navigation highlight
$(document).ready(function() {
    var current_location = window.location;
    var path_name = current_location.pathname;

    console.log(path_name);

    switch(path_name) {
        case '/':
            $('.homeactive').addClass('navigation__active');
            break;

        case '/exchange-charts/':
            $('.exchangechartsactive').addClass('navigation__active');
            break;

        case '/accounts/':
            $('.accountsactive').addClass('navigation__active');
            break;

        case '/items/':
            $('.itemsactive').addClass('navigation__active');
            break;
    }

});
// /Navigation highlight