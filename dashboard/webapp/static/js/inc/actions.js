'use strict';

$(document).ready(function () {
    var $body = $('body');

    //Fullscreen Launch function
    function launchIntoFullscreen(element) {

        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    //Fullscreen exit function
    function exitFullscreen() {

        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }


    $body.on('click', '[data-sa-action]', function (e) {
        e.preventDefault();

        var $this = $(this);
        var action = $this.attr('data-sa-action');
        var target = '';

        switch (action) {
            /*-------------------------------------------
                Search
            ---------------------------------------------*/
            // Open
            case 'search-open':
                $('.search').addClass('search--toggled');
                break;

            // Close
            case 'search-close':
                $('.search').removeClass('search--toggled');
                break;


            /*-------------------------------------------
                Aside
            ---------------------------------------------*/
            // Open
            case 'aside-open':
                target = $this.data('sa-target');
                $this.addClass('toggled');
                $('body').addClass('aside-toggled');
                $(target).addClass('toggled');
                $('.content, .header').append('<div class="sa-backdrop" data-sa-action="aside-close" data-sa-target='+target+' />');
                break;


            case 'aside-close':
                target = $this.data('sa-target');
                $('body').removeClass('aside-toggled');
                $('[data-sa-action="aside-open"], '+target).removeClass('toggled');
                $('.content, .header').find('.sa-backdrop').remove();
                break;


            /*-------------------------------------------
                Full screen browse
            ---------------------------------------------*/
            case 'fullscreen':
                $this.attr('data-sa-action', 'exit-fullscreen');
                launchIntoFullscreen(document.documentElement);
                break;

            case 'exit-fullscreen':
                $this.attr('data-sa-action', 'fullscreen');
                exitFullscreen();     
                break;


            /*-------------------------------------------
                Print
            ---------------------------------------------*/
            case 'print':
                window.print();
                break;


            /*-------------------------------------------
                Login
            --------------------------------------------*/
            case 'login-switch':
                target = $this.data('sa-target');
                $('.login__block').removeClass('active');
                $(target).addClass('active');
                break;


            /*-------------------------------------------
                Notifications clear
            --------------------------------------------*/
            case 'notifications-clear':
                e.stopPropagation();

                var items = $('.top-nav__notifications .listview__item');
                var itemsCount = items.length;
                var index = 0;
                var delay = 150;

                $this.fadeOut();

                items.each(function () {
                    var currentItem = $(this);
                    setTimeout(function () {
                        currentItem.addClass('animated fadeOutRight');
                    }, index+=delay);
                });

                setTimeout(function () {
                    items.remove();
                    $('.top-nav__notifications').addClass('top-nav__notifications--cleared');
                }, itemsCount*180);
                break;


            /*------------------------------------------------
                Toolbar search toggle
            -------------------------------------------------*/

            // Open
            case 'toolbar-search-open':
                $(this).closest('.toolbar').find('.toolbar__search').fadeIn(200);
                $(this).closest('.toolbar').find('.toolbar__search input').focus();
                break;

            // Close
            case 'toolbar-search-close':
                $(this).closest('.toolbar').find('.toolbar__search input').val('');
                $(this).closest('.toolbar').find('.toolbar__search').fadeOut(200);
                break;


            /*------------------------------------------------
                Accounts slots color toggle
            -------------------------------------------------*/

            // On
            case 'toolbar-slot-colors-on':
                $('.avatar-img').each(function() {
                    if ($(this).attr('id') == 'slot-buying') {
                        $(this).css("background-color", "rgba(0,255,0, 0.1)");
                    }
                    else if ($(this).attr('id') == 'slot-selling') {
                        $(this).css("background-color", "rgba(255,0,0, 0.1)");
                    }
                    else {
                        $(this).css("background-color", "rgba(255,255,255, 0.1)");
                    }

                    // Update the action icon
                    $('.zmdi-invert-colors').attr("hidden", "");
                    $('.zmdi-invert-colors-off').removeAttr("hidden");
                });
                break;

            // Off
            case 'toolbar-slot-colors-off':
                $('.avatar-img').each(function() {
                    $(this).removeAttr("style");

                    // Update the action icon
                    $('.zmdi-invert-colors').removeAttr("hidden");
                    $('.zmdi-invert-colors-off').attr("hidden", "");
                });
                break;
        }

        // $body = $('body');
    }); 
});